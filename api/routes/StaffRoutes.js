import express from 'express';
import { addStaff, updateStaff, deleteStaff, assignStaffToFlight, getStaff, getStaffs, getassignedStaff, getallassignStaffToFlight, recordPilotRating, updateRating, deleteRating, getRating } from '../controllers/Staff.js';

const router = express.Router();

// CREATE
router.post('/staff', addStaff);

// UPDATE
router.put('/staff/:EmpNum', updateStaff);

// DELETE
router.delete('/staff/:EmpNum', deleteStaff);

// GET
router.get("/getstaff/:EmpNum",  getStaff);

// GET ALL
router.get("/getallstaff",  getStaffs);

//ASSIGN STAFF TO FLIGHT
router.post('/staff-flight/:EmpNum/:FlightNum', assignStaffToFlight);

// GET
router.get("/staff-flight/:EmpNum",  getassignedStaff);

// GET ALL
router.get("/staff-flight",  getallassignStaffToFlight);

//RECORD PILOT RATING
router.post('/staff-rating', recordPilotRating);

// UPDATE PILOT RATING
router.put('/staff-rating/:EmpNum', updateRating);

// DELETE PILOT RATING
router.delete('/staff-rating/:EmpNum', deleteRating);

// GET PILOT RATING
router.get("/staff-rating/:EmpNum",  getRating);

export default router;
