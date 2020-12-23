const bcrypt = require('bcrypt');
const SALT_WORL_FACTOR = 10;

const encrypt = (password) => {
  let salt = bcrypt.genSaltSync(SALT_WORL_FACTOR);
  let hash = bcrypt.hashSync(password, salt);
  return hash;
};

const comparePassword = (fromUser, fromDatabase) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(fromUser, fromDatabase, (err, res) => {
      if(err){
        reject(err)
      }
      resolve(res)
    })
  })
}

module.exports = {
  encrypt,
  comparePassword,
};
