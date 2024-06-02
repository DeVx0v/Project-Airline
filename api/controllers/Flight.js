import Flight from "../models/Flight.js"
import PassengerFlight from "../models/Passenger_Flight.js"
import Airplane from "../models/Airplane.js"


// Add a new flight
export const addFlight = async (req, res, next) => {
    try {
        // Check if Airplane with given SerNum exists
        const airplane = await Airplane.findOne({ SerNum: req.body.SerNum });
        if (!airplane) {
            return res.status(404).send({ success: false, message: "Airplane not found" });
        }
        const existingFlight = await Flight.findOne({ FlightNum: req.body.FlightNum });
        if (existingFlight) {
            return res.status(400).json({ message: "Flight already exists in the Database!" });
        }
        const newFlight = new Flight(req.body);
        await newFlight.save();
        res.status(200).json("Flight has been created.");
    } catch (err) {
        console.error('Error occurred during request submission:', err);
        next(err);
    }
};

// Update flight information
export const updateFlight = async (req, res, next) => {
    try {
        // Check if Airplane with given SerNum exists
        const airplane = await Airplane.findOne({ SerNum: req.body.SerNum });
        if (!airplane) {
            return res.status(404).send({ success: false, message: "Airplane not found" });
        }
        const updatedFlight = await Flight.findOneAndUpdate(
            { FlightNum: req.body.FlightNum },
            { $set: req.body },
            { new: true }
        );
        if (!updatedFlight) {
            return res.status(404).send("Flight not found");
        }
        res.status(200).json("Flight has been updated.");
    } catch (err) {
        next(err);
    }
};

// Delete a flight
export const deleteFlight = async (req, res, next) => {
    try {
        const deletedFlight = await Flight.findOneAndDelete({ FlightNum: req.params.FlightNum });
        if (!deletedFlight) {
            return res.status(404).send("Flight does not exist");
        }
        res.status(200).json("Flight has been deleted.");
    } catch (err) {
        next(err);
    }
};

// Get a flight
export const getFlight = async (req, res, next) => {
    try {
      const flight = await Flight.findOne({ FlightNum: req.params.FlightNum });
      if (!flight) {
        return res.status(404).send("Flight does not exist");
      }
      res.status(200).json(flight);
    } catch (err) {
      next(err);
    }
  };
  // Get all flights
export const getFlights = async (req, res, next) => {
    try {
      const flights = await Flight.find();
      if (!flights) {
        return res.status(404).send("No existing flights in database");
      }
      res.status(200).json(flights);
    } catch (err) {
      next(err);
    }
  };


// Get passengers on a flight
export const getPassengers = async (req, res, next) => {
    try {
        const passengers = await PassengerFlight.find({ FlightNum: req.params.FlightNum });
        if (passengers.length === 0) {
            return res.status(404).send("Flight does not have any passengers recorded or does not exist");
          }
        res.status(200).json(passengers);
    } catch (err) {
        next(err);
    }
};

