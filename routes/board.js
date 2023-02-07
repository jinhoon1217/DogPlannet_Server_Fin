const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Post} = require('../models');
const { isLoggedIn } = require('../../../config/jwtMiddleware');

const router = express.Router();

// uploads 폴더 없으면 생성
try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({ // 어디에 저장할지
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) { // 어떤 이름으로 저장할지
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기 제한
});

// 이미지 업로드
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});

// 게시글 업로드
const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    console.log(req.user);
    const post = await Post.create({ // 게시글 저장
      content: req.body.content,
      img: req.body.url, // 업로드한 이미지 주소
      UserId: req.user.id,
    });
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
