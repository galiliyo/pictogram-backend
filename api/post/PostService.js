const UserService = require("../user/UserService");

const DBService = require("../../services/DBService");
const ObjectId = require("mongodb").ObjectId;

const COLLECTION_NAME = "posts";

DBService.createIndex(COLLECTION_NAME);

//db.messages.find({$text: {$search: "chicago"}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}})

async function createIndex() {
  const collection = await DBService.getCollection(COLLECTION_NAME);
  collection.createIndex({ txt: "text" });
}
async function query(params) {
  const collection = await DBService.getCollection(COLLECTION_NAME);

  if (params.keyword) {
    console.log("find in index", params.keyword);
    try {
      let posts = await collection
        .find({
          $or: [
            { txt: { $regex: params.keyword, $options: "$i" } },
            { tags: { $regex: params.keyword, $options: "$i" } },
            { "comments.txt": { $regex: params.keyword, $options: "$i" } }
          ]
        })
        .toArray();
      return posts;
    } catch (err) {
      console.log("could not load from index", err);
      throw err;
    }
  } else
    try {
      let posts = await collection.find({}).toArray();

      return posts;
    } catch (err) {
      throw err;
    }
}

async function getById(id) {
  const collection = await DBService.getCollection(COLLECTION_NAME);
  try {
    const post = await collection.findOne({ _id: ObjectId(id) });
    return post;
  } catch (err) {
    throw err;
  }
}

async function remove(id) {
  const collection = await DBService.getCollection(COLLECTION_NAME);
  try {
    const postToCheck = await collection.findOne({ _id: ObjectId(id) });

    await collection.deleteOne({ _id: ObjectId(id) });
  } catch (err) {
    console.log("Could not delete post");

    throw err;
  }
}

async function update(post) {
  const collection = await DBService.getCollection(COLLECTION_NAME);
  const id = new ObjectId(post._id);
  post._id = id;
  try {
    await collection.updateOne({ _id: post._id }, { $set: post });
    return post;
  } catch (err) {
    throw err;
  }
}

async function add(post) {
  const collection = await DBService.getCollection(COLLECTION_NAME);
  try {
    await collection.insertOne(post);
    return post;
  } catch (err) {
    throw err;
  }
}

async function addComment(commentObj) {
  let postId = commentObj.postId;
  let comment = {
    ownerId: commentObj.userId,
    txt: commentObj.txt,
    timeStamp: commentObj.timeStamp
  };
  try {
    let user = await UserService.getById(comment.ownerId);
    comment.ownerFullName = `${user.firstName} ${user.lastName}`;
  } catch (err) {
    throw err;
  }

  const collection = await DBService.getCollection(COLLECTION_NAME);

  try {
    await collection.updateOne(
      {
        _id: ObjectId(postId)
      },
      { $push: { comments: comment } }
    );
    return comment;
  } catch (err) {
    throw err;
  }
}

async function postRemoveLike(userId, postId) {
  const collection = await DBService.getCollection(COLLECTION_NAME);
  try {
    await collection.updateOne(
      { _id: ObjectId(postId) },
      { $pull: { likedBy: userId } }
    );
    return Promise.resolve(true);
  } catch (err) {
    console.log("error during post RemoveLike", err);
    return Promise.reject("Could not update likes at postRemoveLike");
  }
}

async function postAddLike(userId, postId) {
  const collection = await DBService.getCollection(COLLECTION_NAME);
  try {
    const result = await collection.updateOne(
      { _id: ObjectId(postId) },
      { $addToSet: { likedBy: userId } }
    );
    console.log("added like to a post!", result);
    return Promise.resolve(true);
  } catch {
    return Promise.reject("Could not update likes at postAddLike");
  }
}

module.exports = {
  query,
  getById,
  remove,
  update,
  add,
  addComment,
  postAddLike,
  postRemoveLike
};
