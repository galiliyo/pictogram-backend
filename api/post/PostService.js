const DBService = require('../../services/DBService')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    remove,
    update,
    add
}

const COLLECTION_NAME = 'post';

async function query(params) {
    console.log('query');
    
    var criteria = {}
    if (params.destination) {
        const regex = new RegExp(params.destination)
        criteria.destination = { $regex: regex }
    }
    if (params.start) criteria.start = { $gte: params.start };
    if (params.end) criteria.end = { $lte: params.end };
    if (params.types) criteria.types = { $in: params.types };
    const collection = await DBService.getCollection(COLLECTION_NAME)
    try {
        const posts = await collection.find({ $or: [criteria, { params }] }).toArray();
        return posts;
    } catch (err) {
        throw err;
    }
}

async function getById(id) {
    const collection = await DBService.getCollection(COLLECTION_NAME)
    try {
        const post = await collection.findOne({ "_id": ObjectId(id) })
        return post;
    } catch (err) {
        throw err;
    }
}


async function remove(id) {
    const collection = await DBService.getCollection(COLLECTION_NAME)
    try {
        const postToCheck = await collection.findOne({ "_id": ObjectId(id) })
        
        await collection.remove({ "_id": ObjectId(id) })
        
    } catch (err) {
        throw err;
    }
}

async function update(post) {
    const collection = await DBService.getCollection(COLLECTION_NAME)
    const id = new ObjectId(post._id)
    post._id = id
    try {
        await collection.updateOne({ "_id": post._id }, { $set: post })
        return post;
    } catch (err) {
        throw err;
    }
}

async function add(post) {
    const collection = await DBService.getCollection(COLLECTION_NAME)
    try {
        await collection.insertOne(post);
        return post;
    } catch (err) {
        throw err;
    }
}