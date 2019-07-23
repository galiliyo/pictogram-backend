const DBService = require('../../services/DBService')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    add,
    getById,
    update
}

const COLLECTION_NAME = 'chat';

async function add(chat) {
    const collection = await DBService.getCollection(COLLECTION_NAME)
    try {
        await collection.insertOne(chat);
        return chat;
    } catch (err) {
        throw err;
    }
}

async function getById(id) {
    const collection = await DBService.getCollection(COLLECTION_NAME)
    try {
        const chat = await collection.findOne({ "_id": ObjectId(id) })
        return chat;
    } catch (err) {
        throw err;
    }
}

async function update(chat) {
    const collection = await DBService.getCollection(COLLECTION_NAME)
    const id = new ObjectId(chat._id)
    chat._id = id
    try {
        await collection.updateOne({ "_id": chat._id }, { $set: chat })
        return chat;
    } catch (err) {
        throw err;
    }
}