const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/admin/profile');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.png');
    }
});
const uploadImg = multer({
    storage: storage
}).single('profileImage');

module.exports = uploadImg;