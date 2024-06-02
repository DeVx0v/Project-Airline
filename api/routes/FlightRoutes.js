import express from 'express';
import { addFlight, updateFlight, deleteFlight, getFlight, getFlights, getPassengers } from '../controllers/Flight.js';

const router = express.Router();

//Create flight
router.post('/flights', addFlight);

//Update flight
router.put('/flights/:FlightNum', updateFlight);

//Delete flight
router.delete('/flights/:FlightNum', deleteFlight);

//Get flight
router.get('/flights/:FlightNum', getFlight);

//Get flights
router.get('/flights', getFlights);

//Get all passengers on flight
router.get('/flights/passengers/:FlightNum', getPassengers);

export default router;
