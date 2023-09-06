const express = require('express');
const router = express.Router();
const { getPosts, getPost, getPostsBySearch, createPosts, updatePosts, deletePosts, likePosts, commentPost } = require('../controllers/posts.js');
const auth = require('../middleware/auth.js');

router.get('/search', getPostsBySearch);
router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', auth, createPosts);
router.patch('/:id', auth, updatePosts);
router.delete('/:id', auth, deletePosts);
router.patch('/:id/likePost', auth, likePosts);
router.post('/:id/commentPost', auth, commentPost);

module.exports = router;