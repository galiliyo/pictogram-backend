const UserService = require("./UserService");
const PostService = require("../post/PostService");
const DBService = require("../../services/DBService");
const ObjectId = require("mongodb").ObjectId;

module.exports = {
  getUsers,
  getUser,
  updateUser,
  toggleLike
};

async function getUsers(req, res) {
  // const id = req.query
  try {
    const users = await UserService.getUsers();
    res.json(users);
  } catch (err) {
    res.status(404).send("Unknown Users");
  }
}

async function getUser(req, res) {
  const id = req.params.id;
  try {
    const user = await UserService.getById(id);
    res.json(user);
  } catch {
    res.status(404).send("Unknown User");
  }
}

async function updateUser(req, res) {
  const user = req.body;
  try {
    const updatedUser = await UserService.update(user);
    res.json(updatedUser);
  } catch {
    res.status(500).send("Could Not Edit");
  }
}

async function toggleLike(req, res) {
  const collection = await DBService.getCollection("users");

  const { userId, postId } = req.body;

  let userLikes = await collection
    .find({ _id: ObjectId(userId) })
    .toArray()
    .then(arr => arr[0].likedPosts);

 
    if (userLikes.includes(postId)) {

      await Promise.all([
        UserService.userRemoveLike(userId, postId),
        PostService.postRemoveLike(userId, postId)
      ]).catch(err => {
        console.log('error removing a like', err)
      })
    } else {

      await Promise.all([
        PostService.postAddLike(userId, postId),
        UserService.userAddLike(userId, postId),
      ]).catch(err => {
        console.log('error adding a like', err)
      })
    }

    let updatedUser = await collection
      .find({ _id: ObjectId(userId) })
      .toArray()
      .then(arr => arr[0]);
      res.json(updatedUser)
  
  }

  // try {
  //   const updatedUser = await UserService.updateLikes(likesUpdateObj)
  //   res.json(updatedUser)
  // } catch (err){
  //   res.status(404).send(err);
  // }
// }
