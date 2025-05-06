const bcrypt = require('bcrypt');

const plainPassword = '123456';

bcrypt.hash(plainPassword, 10)
  .then(hash => {
    console.log('Mật khẩu đã mã hoá:', hash);
  })
  .catch(err => {
    console.error('Lỗi khi hash mật khẩu:', err);
  });
