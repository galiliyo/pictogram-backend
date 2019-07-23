const DBService = require('../../services/DBService')
const ObjectId = require('mongodb').ObjectId

const COLLECTION_USER = 'user';


async function getUsers() {
    const collection = await DBService.getCollection(COLLECTION_USER)
    // {$or:[{},{ pending: { tripId: id.tripId } }]}
    try {
        const users = await collection.find().toArray();
        return users
    } catch (err) {
        console.log(`ERROR: while finding user ${email}`)
        throw err
    }

}

async function getByEmail(email) {
    const collection = await DBService.getCollection(COLLECTION_USER)
    try {
        const user = await collection.findOne({ email })
        return user
    } catch (err) {
        console.log(`ERROR: while finding user ${email}`)
        throw err
    }
}

async function add(newUser) {
    const collection = await DBService.getCollection(COLLECTION_USER)
    try {
        await collection.insertOne(newUser);
        return newUser;
    } catch (err) {
        console.log(`ERROR: cannot insert user`)
        throw err;
    }
}

async function getById(id) {
    const collection = await DBService.getCollection(COLLECTION_USER)
    try {
        const user = await collection.findOne({ "_id": ObjectId(id) })
        return user;
    } catch (err) {
        throw err;
    }
}

async function update(user) {
    const collection = await DBService.getCollection(COLLECTION_USER)
    const id = new ObjectId(user._id)
    user._id = id
    try {
        await collection.updateOne({ "_id": user._id }, { $set: user })
        return user;
    } catch (err) {
        throw err;
    }
}


module.exports = {
    getUsers,
    getByEmail,
    add,
    getById,
    update
}

