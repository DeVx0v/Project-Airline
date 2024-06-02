import express from "express";
import {
  updateAirplane,
  deleteAirplane,
  getAirplane,
  getAirplanes,
  newAirplane,
  getAssignedAirplane,
  getAssignedAirplanes
} from "../controllers/Airplane.js";

const router = express.Router();

// CREATE
router.post("/newairplane", newAirplane);

// UPDATE
router.put("/updateairplane/:SerNum",  updateAirplane);

// DELETE
router.delete("/deleteairplane/:SerNum",  deleteAirplane);

// GET
router.get("/getairplane/:SerNum",  getAirplane);

// GET ALL
router.get("/getallairplanes",  getAirplanes);

// GET ASSIGNED AIRPLANE
router.get("/getassigned/:SerNum",  getAssignedAirplane);

// GET ALL ASSIGNED AIRPLANES
router.get("/getallassigned",  getAssignedAirplanes);


export default router;


