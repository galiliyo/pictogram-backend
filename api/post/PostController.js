const PostService = require("./PostService");
const UserService = require("../user/UserService");
const ObjectId = require("mongodb").ObjectId;

async function getPosts(req, res) {
  const params = req.query;

  if (req.session && req.session.user) {
    params.owner = {};
    params.owner = { _id: req.session.user._id };
  }
  try {
    const posts = await PostService.query(params);
    res.json(posts);
  } catch (err) {
    res.status(404).send("Unknown Posts");
  }
}

async function getPost(req, res) {
  const id = req.params.id;
  try {
    const post = await PostService.getById(id);
    res.json(post);
  } catch (err) {
    res.status(404).send("Unknown Post");
  }
}

async function deletePost(req, res) {
  const id = req.params.id;
  const post = req.body;
  if (post.owner._id !== req.session.user._id)
    return Promise.reject("You are not the owner of the post");
  try {
    await PostService.remove(id);
    res.json({});
  } catch (err) {
    res.status(500).send("Could not delete");
  }
}

async function addPost(req, res) {
  const post = req.body;
  post.owner = {
    _id: req.session.user._id
  };
  try {
    const postAdded = await PostService.add(post);
    res.json(postAdded);
  } catch (err) {
    res.status(500).send("Could not add");
  }
}

async function updatePost(req, res) {
  const post = req.body;
  if (post.owner._id !== req.session.user._id)
    return res.status(500).send("Could Not Edit");
  try {
    const updatedPost = await PostService.update(post);
    res.json(updatedPost);
  } catch (err) {
    res.status(500).send("Could not edit");
  }
}

async function addComment(req, res) {
  const commentObj = req.body;
  try {
    const updatedPost = await PostService.addComment(commentObj);
    res.json(updatedPost);
  } catch (err) {
    res.status(500).send("Could not add comment");
  }
}

module.exports = {
  getPosts,
  getPost,
  deletePost,
  addPost,
  updatePost,
  addComment
};
