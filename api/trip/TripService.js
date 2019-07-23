const DBService = require('../../services/DBService')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    remove,
    update,
    add
}

const COLLECTION_NAME = 'trip';

async function query(params) {
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
        const trips = await collection.find({ $or: [criteria, { params }] }).toArray();
        return trips;
    } catch (err) {
        throw err;
    }
}

async function getById(id) {
    const collection = await DBService.getCollection(COLLECTION_NAME)
    try {
        const trip = await collection.findOne({ "_id": ObjectId(id) })
        return trip;
    } catch (err) {
        throw err;
    }
}


async function remove(id) {
    const collection = await DBService.getCollection(COLLECTION_NAME)
    try {
        const tripToCheck = await collection.findOne({ "_id": ObjectId(id) })
        
        await collection.remove({ "_id": ObjectId(id) })
        
    } catch (err) {
        throw err;
    }
}

async function update(trip) {
    const collection = await DBService.getCollection(COLLECTION_NAME)
    const id = new ObjectId(trip._id)
    trip._id = id
    try {
        await collection.updateOne({ "_id": trip._id }, { $set: trip })
        return trip;
    } catch (err) {
        throw err;
    }
}

async function add(trip) {
    const collection = await DBService.getCollection(COLLECTION_NAME)
    try {
        await collection.insertOne(trip);
        return trip;
    } catch (err) {
        throw err;
    }
}