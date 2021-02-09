"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        // generator.next()返回{value: 0, done: false}
        // 每次遇到yield x;就返回一个对象{value: x, done: true/false}，然后“暂停”。
        // 返回的value就是yield的返回值，done表示这个generator是否已经执行结束了。如果done为true，则value就是return的返回值
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pool = void 0;
const Deferred_1 = require("./Deferred");
const AggregateError_1 = require("./AggregateError");
class Pool {
    // 构造函数里面对一些必要属性进行了验证，并创建了一些实例属性
    constructor(factory) {
        this.log = false;
        if (!factory.create) {
            throw new Error('create function is required');
        }
        if (!factory.destroy) {
            throw new Error('destroy function is required');
        }
        if (!factory.validate) {
            throw new Error('validate function is required');
        }
        if (typeof factory.min !== 'number' ||
            factory.min < 0 ||
            factory.min !== Math.round(factory.min)) {
            throw new Error('min must be an integer >= 0');
        }
        if (typeof factory.max !== 'number' ||
            factory.max <= 0 ||
            factory.max !== Math.round(factory.max)) {
            throw new Error('max must be an integer > 0');
        }
        if (factory.min > factory.max) {
            throw new Error('max is smaller than min');
        }
        if (factory.maxUses !== undefined &&
            (typeof factory.maxUses !== 'number' || factory.maxUses < 0)) {
            throw new Error('maxUses must be an integer >= 0');
        }
        this.idleTimeoutMillis = factory.idleTimeoutMillis || 30000;
        this.acquireTimeoutMillis = factory.acquireTimeoutMillis || 30000;
        this.reapIntervalMillis = factory.reapIntervalMillis || 1000;
        this.maxUsesPerResource = factory.maxUses || Infinity;
        this.log = factory.log || false;
        this._factory = factory;
        this._count = 0;
        this._draining = false;
        this._pendingAcquires = [];
        this._inUseObjects = [];  // 使用中的连接结合，接连使用完以后如果符合条件会被重新推入到_availableObjects中，最为可用的连接
        this._availableObjects = []; // 可用连接池，供后续请求使用
        this._removeIdleScheduled = false;
        // this._ensureMinimum(); 并不会一开始就创建最小数目的连接
    }
    get size() {
        return this._count;
    }
    get name() {
        return this._factory.name;
    }
    get available() {
        return this._availableObjects.length;
    }
    get using() {
        return this._inUseObjects.length;
    }
    get waiting() {
        return this._pendingAcquires.length;
    }
    get maxSize() {
        return this._factory.max;
    }
    get minSize() {
        return this._factory.min;
    }

    /**
     * 记录日志
     * @param message：日志信息
     * @param level：日志等级
     * @private
     */
    _log(message, level) {
        // 当创建Pool实例对象的时候传入了记录日志方法，就调用用户传入的记录日志的方法
        if (typeof this.log === 'function') {
            this.log(message, level);
        }
        else if (this.log) {
            console.log(`${level.toUpperCase()} pool ${this.name || ''} - ${message}`);
        }
    }
    // 移除闲置超时的连接
    _removeIdle() {
        const toRemove = [];
        const now = Date.now();
        let i;
        let available = this._availableObjects.length;
        const maxRemovable = this.size - this.minSize;  // 计算出可移除连接的数量
        let timeout;
        this._removeIdleScheduled = false;
        for (i = 0; i < available && maxRemovable > toRemove.length; i++) {
            timeout = this._availableObjects[i].timeout;
            if (now >= timeout) { // 判断当前availableObject是否超时
                this._log('removeIdle() destroying obj - now:' + now + ' timeout:' + timeout, 'verbose');
                toRemove.push(this._availableObjects[i].resource);
            }
        }
        // 销毁所有连接
        toRemove.forEach(this.destroy, this);
        available = this._availableObjects.length;
        if (available > 0) {
            this._log('this._availableObjects.length=' + available, 'verbose');
            this._scheduleRemoveIdle();
        } else {
            this._log('removeIdle() all objects removed', 'verbose');
        }
    }
    // 移除闲置连接的工具方法，内部设置了调用时间间隔，默认是1秒钟
    _scheduleRemoveIdle() {
        if (!this._removeIdleScheduled) {
            this._removeIdleScheduled = true;
            this._removeIdleTimer = setTimeout(() => {
                this._removeIdle();
            }, this.reapIntervalMillis);
        }
    }
    // 为每个pending状态的deferred对象分发连接
    _dispense() {
        let wrappedResource = null;
        // this._pendingAcquires里面保存的都是处于pending状态的deferred对象
        const waitingCount = this._pendingAcquires.length;
        // this._availableObjects里面包含的是可用的数据库连接
        this._log(`dispense() clients=${waitingCount} available=${this._availableObjects.length}`, 'info');
        if (waitingCount < 1) {
            return;
        }
        while (this._availableObjects.length > 0) {
            this._log('dispense() - reusing obj', 'verbose');
            wrappedResource = this._availableObjects[this._availableObjects.length - 1];
            if (!this._factory.validate(wrappedResource.resource)) {
                this.destroy(wrappedResource.resource);
                continue;
            }
            this._availableObjects.pop();
            this._addResourceToInUseObjects(wrappedResource.resource, wrappedResource.useCount);
            const deferred = this._pendingAcquires.shift();
            return deferred.resolve(wrappedResource.resource);
        }
        // 当可用连接数小于最大可连接数时，自动创建一个连接
        if (this.size < this.maxSize) {
            this._createResource();
        }
    }
    // 创建一个数据库连接
    _createResource() {
        this._count += 1;
        this._log(`createResource() - creating obj - count=${this.size} min=${this.minSize} max=${this.maxSize}`, 'verbose');
        // this._factory.create()返回一个promise对象，then方法接受到的参数就是一个connection对象
        this._factory
            .create()
            .then((resource) => {

                const deferred = this._pendingAcquires.shift();
                if (deferred) {
                    this._addResourceToInUseObjects(resource, 0);
                    deferred.resolve(resource);
                }
                else {
                    this._addResourceToAvailableObjects(resource, 0);
                }
            })
            .catch((error) => {
                const deferred = this._pendingAcquires.shift();
                this._count -= 1;
                if (this._count < 0)
                    this._count = 0;
                if (deferred) {
                    deferred.reject(error);
                }
                process.nextTick(() => {
                    this._dispense(); // 在创建连接失败以后要重新调用_dispense方法，去检查是否有未处理的请求，有的话做相应处理
                });
            })
            .finally(() => {
                console.log(this._availableObjects.length)
            });
    }

    /**
     * 将数据库连接包装成自定义的可供使用的对象
     * @param resource：数据库连接
     * @param useCount
     * @private
     */
    _addResourceToAvailableObjects(resource, useCount) {
        const wrappedResource = {
            resource: resource,
            useCount: useCount,
            timeout: Date.now() + this.idleTimeoutMillis,
        };
        this._availableObjects.push(wrappedResource);
        this._dispense();
        this._scheduleRemoveIdle();
    }

    /**
     * 将数据库连接包装成自定义的使用状态的对象
     * @param resource：数据库连接
     * @param useCount
     * @private
     */
    _addResourceToInUseObjects(resource, useCount) {
        const wrappedResource = {
            resource: resource,
            useCount: useCount,
        };
        this._inUseObjects.push(wrappedResource);
    }
    // 确保可用连接数不会少于设置的最小连接数
    _ensureMinimum() {
        let i, diff;
        if (!this._draining && this.size < this.minSize) {
            diff = this.minSize - this.size;
            for (i = 0; i < diff; i++) {
                this._createResource();
            }
        }
    }

    /**
     * 返回一个deferred对象，这个deferred对象完成状态时会返回一个数据库连接
     * @returns {*}
     */
    acquire() {
        if (this._draining) {
            return Promise.reject(new Error('pool is draining and cannot accept work'));
        }
        // 创建一个deferred对象
        const deferred = new Deferred_1.Deferred();
        // 将超时的deferred对象从队列中剔除
        deferred.registerTimeout(this.acquireTimeoutMillis, () => {
            this._pendingAcquires = this._pendingAcquires.filter((pending) => pending !== deferred);
        });
        this._pendingAcquires.push(deferred);
        this._dispense();
        // 返回deferred实例对象内部的promise对象
        return deferred.promise();
    }

    /**
     * 释放使用中连接（保存在_inUseObjects的连接）：超过最大使用次数了就销毁，否则就放回到_availableObjects，但是使用次数还是会被记录下来
     * @param resource：数据库连接
     */
    release(resource) {
        // 同一个连接不可重复释放
        if (this._availableObjects.some((resourceWithTimeout) => resourceWithTimeout.resource === resource)) {
            this._log('release called twice for the same resource: ' + new Error().stack, 'error');
            return;
        }
        const index = this._inUseObjects.findIndex((wrappedResource) => wrappedResource.resource === resource);
        if (index < 0) {
            this._log('attempt to release an invalid resource: ' + new Error().stack, 'error');
            return;
        }
        const wrappedResource = this._inUseObjects[index];
        wrappedResource.useCount += 1;
        /**
         * 当wrappedResource的使用次数超过每个连接可用的最大次数时，需要销毁该连接并重新创建连接
         * 为什么要这样？用户的访问存在高峰和低谷期，假设数据库那边做了动态扩展（通过DNS），在低谷期每个服务器都连接到一个由3个成员组成的读取副本集，可以在一个DNS名称后面访问，在高峰期会自动添加10台读取副本。如果不销毁连接，这个连接永远连接的是
         * 原来的三个副本集，这样新加的副本集就闲置了
         */
        if (wrappedResource.useCount >= this.maxUsesPerResource) {
            this._log(`release() destroying obj - useCount:${wrappedResource.useCount} maxUsesPerResource:${this.maxUsesPerResource}`, 'verbose');
            this.destroy(wrappedResource.resource);
            this._dispense();
        } else {
            this._inUseObjects.splice(index, 1);
            this._addResourceToAvailableObjects(wrappedResource.resource, wrappedResource.useCount);
        }
    }

    /**
     * 销毁数据库连接
     * @param resource：需要销毁的连接
     * @returns {*|Promise<any>}
     */
    destroy(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            const available = this._availableObjects.length;
            const using = this._inUseObjects.length;
            this._availableObjects = this._availableObjects.filter((object) => object.resource !== resource);
            this._inUseObjects = this._inUseObjects.filter((object) => object.resource !== resource);
            if (available === this._availableObjects.length && using === this._inUseObjects.length) {
                this._ensureMinimum();  // 确保连接数不会小于设置的最小连接数
                return;
            }
            this._count -= 1;
            if (this._count < 0) {
                this._count = 0;
            }
            try {
                // 销毁数据库连接
                yield this._factory.destroy(resource);
            } finally {
                // 确保连接数不会小于设置的最小连接数
                this._ensureMinimum();  // 确保连接数不会小于设置的最小连接数
            }
        });
    }
    // 当要关闭连接池时，会调用该方法
    drain() {
        this._log('draining', 'info');
        this._draining = true;
        const check = (callback) => {
            // 确保所有的请求都被处理完才会去真正关闭连接池
            if (this._pendingAcquires.length > 0) {
                this._dispense();
                setTimeout(() => {
                    check(callback);
                }, 100);
                return;
            }
            // this._availableObjects.length !== this._count说明还有链接在使用中，要等_inUseObjects里面的所有链接使用完回到_availableObjects中才会去销毁整个连接池
            if (this._availableObjects.length !== this._count) {
                setTimeout(() => {
                    check(callback);
                }, 100);
                return;
            }
            callback();
        };
        return new Promise((resolve) => check(resolve));
    }
    destroyAllNow() {
        return __awaiter(this, void 0, void 0, function* () {
            this._log('force destroying all objects', 'info');
            this._removeIdleScheduled = false;
            clearTimeout(this._removeIdleTimer);
            const resources = this._availableObjects.map((resource) => resource.resource);
            const errors = [];
            for (const resource of resources) {
                try {
                    yield this.destroy(resource);
                }
                catch (ex) {
                    this._log('Error destroying resource: ' + ex.stack, 'error');
                    errors.push(ex);
                }
            }
            if (errors.length > 0) {
                // 把所有错误合并成一个返回
                throw new AggregateError_1.AggregateError(errors);
            }
        });
    }
}
exports.Pool = Pool;
//# sourceMappingURL=Pool.js.map
