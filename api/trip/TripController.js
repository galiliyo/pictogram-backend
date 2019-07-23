const TripService = require('./TripService')
const UserService = require('../user/UserService')
const ObjectId = require('mongodb').ObjectId

async function getTrips(req, res) {
    const params = req.query
    // console.log('filter back', params);
    if (req.session && req.session.user) {
        params.owner = {}
        params.owner = { _id: req.session.user._id }
    }
    try {
        const trips = await TripService.query(params)
        res.json(trips)
    } catch (err) {
        res.status(404).send('Unknown Trips')
    }
}

async function getTrip(req, res) {
    const id = req.params.id
    try {
        const trip = await TripService.getById(id)
        res.json(trip)
    } catch (err) {
        res.status(404).send('Unknown Trip')
    }
}

async function deleteTrip(req, res) {
    const id = req.params.id
    const trip = req.body
    if (trip.owner._id !== req.session.user._id) return Promise.reject('You are not the owner of the trip')
    try {
        await TripService.remove(id)
        res.json({})
    } catch (err) {
        res.status(500).send('Could Not Delete')
    }
}

async function addTrip(req, res) {
    const trip = req.body
    trip.owner = {
        _id: req.session.user._id,
    }
    try {
        const tripAdded = await TripService.add(trip)
        res.json(tripAdded)
    } catch (err) {
        res.status(500).send('Could Not Add')
    }
}

async function updateTrip(req, res) {
    const trip = req.body;
    if (trip.owner._id !== req.session.user._id) return res.status(500).send('Could Not Edit')
    try {
        const updatedTrip = await TripService.update(trip)
        res.json(updatedTrip)
    } catch (err) {
        res.status(500).send('Could Not Edit')
    }
}

module.exports = {
    getTrips,
    getTrip,
    deleteTrip,
    addTrip,
    updateTrip
}