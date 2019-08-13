const PostService = require("../post/PostService");
const DBService = require("../../services/DBService");
const ObjectId = require("mongodb").ObjectId;

const COLLECTION_USER = "users";

async function getUsers() {
  const collection = await DBService.getCollection(COLLECTION_USER);
  try {
    const users = await collection.find().toArray();
    return users;
  } catch (err) {
    console.log(`ERROR: while finding user ${email}`);
    throw err;
  }
}

async function getByEmail(email) {
  const collection = await DBService.getCollection(COLLECTION_USER);
  try {
    const user = await collection.findOne({ email });
    return user;
  } catch (err) {
    console.log(`ERROR: while finding user ${email}`);
    throw err;
  }
}

async function add(newUser) {
  const collection = await DBService.getCollection(COLLECTION_USER);
  try {
    await collection.insertOne(newUser);
    console.log("added", newUser);
    return newUser;
  } catch (err) {
    console.log(`ERROR: cannot insert user`);
    throw err;
  }
}

async function getById(id) {
  const collection = await DBService.getCollection(COLLECTION_USER);
  try {
    const user = await collection.findOne({ _id: ObjectId(id) });

    return user;
  } catch (err) {
    throw err;
  }
}

async function update(user) {
  const collection = await DBService.getCollection(COLLECTION_USER);
  const id = new ObjectId(user._id);
  user._id = id;
  try {
    await collection.updateOne({ _id: user._id }, { $set: user });
    return user;
  } catch (err) {
    throw err;
  }
}

async function userRemoveLike(userId, postId) {
  const collection = await DBService.getCollection(COLLECTION_USER);
  try {
    await collection.updateOne(
      { _id: ObjectId(userId) },
      { $pull: { likedPosts: postId } }
    );
    return Promise.resolve(true);
  } catch {
    return Promise.reject("Could not update likes at userRemoveLike");
  }
}

async function userAddLike(userId, postId) {
  const collection = await DBService.getCollection(COLLECTION_USER);
  try {
    await collection.updateOne(
      { _id: ObjectId(userId) },
      { $addToSet: { likedPosts: postId } }
    );
    return Promise.resolve(true);
  } catch {
    return Promise.reject("Could not update likes at userAddLike");
  }
}



module.exports = {
  getUsers,
  getByEmail,
  add,
  getById,
  update,
  // updateLikes,
  userAddLike,
  userRemoveLike
};
