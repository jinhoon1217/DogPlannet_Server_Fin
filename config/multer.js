//multer.js
// AWS S3 에 대한 설정을 담당하는 모듈
const mutler = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
aws.config.loadFromPath(__dirname + "/../config/s3Info.json"); // AWS 키를 저장한 파일 s3Info
const s3 = new aws.S3();


// upload를 할 때 사용하는 multer 모듈
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'bucketname',
        acl: 'public-read-write',
        key: (req, file, cb) => {
            cb(null, Date.now() + "." + file.originalname.split(".").pop()); // 파일 이름을 유니크한이름.확장자 형태로
        }
    })
});

module.exports = upload;
