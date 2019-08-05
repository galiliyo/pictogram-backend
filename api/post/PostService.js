const UserService = require("../user/UserService");

const DBService = require("../../services/DBService");
const ObjectId = require("mongodb").ObjectId;

module.exports = {
  query,
  getById,
  remove,
  update,
  add,
  addComment
};

const COLLECTION_NAME = "posts";

async function query(params) {
  console.log("query");

  var criteria = {};
  if (params.keyWord) {
    const regex = new RegExp(params.keyWord);
    criteria.keyWord = { $regex: regex };
  }
  // if (params.start) criteria.start = { $gte: params.start };
  // if (params.end) criteria.end = { $lte: params.end };
  // if (params.types) criteria.types = { $in: params.types };
  const collection = await DBService.getCollection(COLLECTION_NAME);
  try {
    console.log("trying", COLLECTION_NAME);
    const posts = await collection.find({}).toArray();
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

    await collection.remove({ _id: ObjectId(id) });
  } catch (err) {
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
    ownerId: commentObj.userId ,
    txt: commentObj.txt,
    timeStamp: commentObj.timeStamp
  };
  console.log("comment", comment);
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
        _id: postId
      },
      { $push: { comments: comment } }
    );
    return comment;
  } catch (err) {
    throw err;
  }
}
