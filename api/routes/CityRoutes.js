import express from 'express';
import { addCity, updateCity, deleteCity, addIntermediateStop,getCity,getCities, getIntermediateStops, getIntermediateStop, updateIntermediateStop, deleteIntermediateStop } from '../controllers/City.js';

const router = express.Router();

//CREATE CITY
router.post('/cities', addCity);

//Update CITY
router.put('/cities/:CityName', updateCity);

//Delete CITY
router.delete('/cities/:CityName', deleteCity);

//Get CITY
router.get('/cities', getCities);

//Get all CITY
router.get('/cities/:CityName', getCity);

//Add an intermediate stop for a flight
router.post('/intermediate', addIntermediateStop);

//Update intermediate stop
router.put('/intermediate/:FlightNum/:CityName', updateIntermediateStop);

//Delete intermediate stop
router.delete('/intermediate/:FlightNum/:CityName', deleteIntermediateStop);

//Get intermediate stop
router.get('/intermediate/:CityName/:FlightNum', getIntermediateStop);

//Get all intermediate stops for a flight
router.get('/intermediate/:FlightNum', getIntermediateStops);

export default router;
