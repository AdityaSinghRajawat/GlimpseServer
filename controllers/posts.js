const { default: mongoose } = require('mongoose');
const PostMessage = require('../models/postMessage.js');

const getPosts = async (req, res) => {

    const { page } = req.query;

    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT; //Get the starting index of every page
        const total = await PostMessage.countDocuments({});

        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });

    } catch (error) {
        res.status(404).json({ error });
    }
};

const getPost = async (req, res) => {

    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);
        res.status(200).json(post);

    } catch (error) {
        res.status(404).json({ error });
    }

};

const getPostsBySearch = async (req, res) => {

    const { searchQuery, tags } = req.query;

    try {

        const title = new RegExp(searchQuery, 'i');
        const posts = await PostMessage.find({ $or: [{ title }, { tags: { $in: tags.split(',') } }] });
        console.log({ data: posts });

        res.json({ data: posts });

    } catch (error) {
        res.status(404).json({ error });
        console.log(error);
    }
};

const createPosts = async (req, res) => {

    const post = req.body;
    const newPost = PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });

    try {

        await newPost.save();
        res.status(201).json(newPost);

    } catch (error) {
        res.status(409).json({ error });
    }
};

const updatePosts = async (req, res) => {

    const { id: _id } = req.params;
    const post = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('No post with that id');
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, { ...post, _id }, { new: true });
    res.json(updatedPost);

};


const deletePosts = async (req, res) => {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send('No post with that id');
    }

    await PostMessage.findByIdAndRemove(id);

    res.json({ message: "Post deleted successfully" });

};

const likePosts = async (req, res) => {

    const { id } = req.params;

    if (!req.userId) return res.json({ message: 'Unauthenticated' });

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send('No post with that id');
    }

    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
        post.likes.push(req.userId);
    } else {
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    res.json(updatedPost);

};

const commentPost = async (req, res) => {

    const { id } = req.params;
    const { value } = req.body;

    const post = await PostMessage.findById(id);

    post.comments.push(value);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);

};

module.exports = {
    getPosts,
    getPost,
    getPostsBySearch,
    createPosts,
    updatePosts,
    deletePosts,
    likePosts,
    commentPost
}