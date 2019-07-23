const express = require('express')
const requireAuth = require('../../middlewares/requireAuth.middleware')
const { getTrips, getTrip, deleteTrip, addTrip, updateTrip } = require('./TripController')
const router = express.Router()

router.get('/', getTrips)
router.get('/:id', getTrip)
router.delete('/:id', requireAuth, deleteTrip)
router.post('/', requireAuth, addTrip)
router.put('/:id', requireAuth, updateTrip)

module.exports = router
