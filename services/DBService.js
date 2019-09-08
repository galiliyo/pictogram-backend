const MongoClient = require('mongodb').MongoClient

const config = require('../config')

// Database Name
const dbName = 'pictogram_db'

var dbConn = null

async function createIndex(collectionName) {
  const collection = await getCollection(collectionName)
  collection.dropIndexes()
  collection.createIndex({ '$**': 'text' }, function(err, result) {
  })
}

async function connect() {
  if (dbConn) return dbConn
  try {
    const client = await MongoClient.connect(config.dbURL, {
      useNewUrlParser: true
    })
    const db = client.db(dbName)
    dbConn = db
    return db
  } catch (err) {
    console.log('Cannot Connect to DB', err)
    throw err
  }
}

async function getCollection(collectionName) {
  const db = await connect()
  return db.collection(collectionName)
}

module.exports = {
  connect,
  createIndex,
  getCollection
}
