const express = require('express');
const memoController = require('../controllers/memoController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/memos', memoController.getAllMemos);
router.get('/get-memos-secured', authMiddleware, memoController.getAllMemos);

router.get('/user/memos', authMiddleware, memoController.getUserMemos);

router.post('/user/memos', memoController.createMemo);
router.post('/user/secured-memos', authMiddleware, memoController.securedCreateMemo);

router.put('/user/memos/:id', authMiddleware, memoController.updateMemo);

router.delete('/user/memos/:id', memoController.deleteMemo);
router.delete('/user/secured-memos-delete/:id', authMiddleware, memoController.securedDeleteMemo);

module.exports = router;