const express = require("express");
const { route } = require("..");
const router = express.Router();
const upload = require("../../config/multer");
const postCtr = require('../../controllers/boards');

// 1. create
router.get('/upload', checkUser, (req, res) => {
    res.render('upload');
});

// 2. read 
router.get("/", postCtr.list);  // 게시물 전체 조회.
router.get("/:id", postCtr.detail);  // 게시물 하나 조회

// 3. update
// web에서 form 형태로 데이터를 전송하면 get / post 두가지 밖에 쓸 수 없기 때문에
// update에 PUT이 아니라 POST 메서드를 사용하여 요청 보냄.
router.post('/update:id', postCtr.updateLayout);
router.post('/', upload.single("image"), postCtr.upload);
router.post('/update:id', postCtr.update);

// 4. delete
router.post('/delete/:id', postCtr.delete);

module.exports = router;
