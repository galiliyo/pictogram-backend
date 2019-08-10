const UserService = require("../user/UserService");

const DBService = require("../../services/DBService");
const ObjectId = require("mongodb").ObjectId;

const COLLECTION_NAME = "posts";

async function query(params) {

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
    const posts = await collection.find({}).toArray();
    return posts;
  } catch (err) {
    throw err;
  }
}

// //Create the index 
// posts.createIndex({"$**":"text"}) //This is indexing all the texts fields on the posts table 

// //Then perform the fulltext search 
// posts.find({$text: {$search: params.keyword}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}) .toArray()



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
    console.log('trying to remove post',postId);

    await collection.updateOne(
      { _id: ObjectId(postId) },
      { $pull: { likedBy: userId } }
    );
    return Promise.resolve(true);
  } catch(err) {
    console.log('error during postRemoveLike', err)
    return Promise.reject("Could not update likes at postRemoveLike");
  }
}

async function postAddLike(userId, postId) {
  const collection = await DBService.getCollection(COLLECTION_NAME);
  try {
   console.log('trying to add post',postId ,userId);
  //  const post = await getById(postId)
  //  console.log('post', post)
    const result = await collection.updateOne(
      { _id: ObjectId(postId) },
      { $addToSet: { likedBy: userId } }
    );
    console.log('added like to a post!', result)
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