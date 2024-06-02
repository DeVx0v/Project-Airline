import express from 'express';
import { addPassenger, updatePassenger, deletePassenger,getPassenger, getPassengers, addPassengerToFlight, getTravelHistory } from '../controllers/Passenger.js';

const router = express.Router();

//Create passenger
router.post('/passengers', addPassenger);

//Update passeenger
router.put('/passengers/:PassengerID', updatePassenger);

//delete passenger
router.delete('/passengers/:PassengerID', deletePassenger);

//Get passenger
router.get('/passengers/:PassengerID', getPassenger);

//Get passengers
router.get('/passengers', getPassengers);

//Add passenger to flight
router.post('/passenger-flight/:PassengerID/:FlightNum', addPassengerToFlight);

//Get passenger's flight history
router.get('/passengers/travel-history/:PassengerID', getTravelHistory);

export default router;
