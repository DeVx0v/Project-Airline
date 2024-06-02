import Airplane from "../models/Airplane.js"
import Flight from "../models/Flight.js"

// Add a new airplane
export const newAirplane = async (req, res, next) => {
    try {
      // Check if the airplane already exists
      const existingairplane = await Airplane.findOne({ SerNum: req.body.SerNum });
      if (existingairplane) {
        return res.status(400).json({ message: "Airplane already exists in the Database!" });
      }
      const newAirplane = new Airplane({
        ...req.body,
      });
  
      await newAirplane.save();
      res.status(200).json("Airplane has been created.");
    } catch (err) {
      console.error('Error occurred during request submission:', err);
      next(err);
    }
};

// Update airplane information
export const updateAirplane = async (req, res, next) => {
    try {
      const updatedAirplane = await Airplane.findOneAndUpdate(
        { SerNum: req.params.SerNum },
        { $set: req.body },
        { new: true }
      );
      if (!updatedAirplane) {
        return res.status(404).send("Airplane does not exist");
      }
      res.status(200).json("Airplane has been updated.");
    } catch (err) {
      next(err);
    }
};

// Delete an airplane
export const deleteAirplane = async (req, res, next) => {
    try {
      const deletedAirplane = await Airplane.findOneAndDelete({  SerNum: req.params.SerNum });
      if (!deletedAirplane) {
        return res.status(404).send("Airplane does not exist");
    }
      res.status(200).json("Airplane has been deleted.");
    } catch (err) {
      next(err);
    }
};

// Get an airplane
export const getAirplane = async (req, res, next) => {
    try {
      const airplane = await Airplane.findOne({ SerNum: req.params.SerNum });
      if (!airplane) {
        return res.status(404).send("Airplane does not exist");
      }
      res.status(200).json(airplane);
    } catch (err) {
      next(err);
    }
  };

// Get all airplanes
export const getAirplanes = async (req, res, next) => {
    try {
      const airplanes = await Airplane.find();
      if (!airplanes) {
        return res.status(404).send("No existing Airplanes in database");
      }
      res.status(200).json(airplanes);
    } catch (err) {
      next(err);
    }
  };

// Get Assigned airplane on flight
export const getAssignedAirplane = async (req, res, next) => {
  try {
    const airplane = await Flight.findOne({ SerNum: req.params.SerNum });
    if (!airplane) {
      return res.status(404).send("Airplane is on assigned");
    }
    res.status(200).json(airplane);
  } catch (err) {
    next(err);
  }
};
// Get all Assigned airplanes
export const getAssignedAirplanes = async (req, res, next) => {
  try {
    const airplanes = await Flight.find();
    if (!airplanes) {
      return res.status(404).send("No existing Assigned Airplanes on flights in database");
    }
    res.status(200).json(airplanes);
  } catch (err) {
    next(err);
  }
};