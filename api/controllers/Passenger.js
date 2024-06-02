import Passenger from "../models/Passenger.js"
import PassengerFlight from "../models/Passenger_Flight.js"

// Add a new passenger
export const addPassenger = async (req, res, next) => {
    try {
        const existingPassenger = await Passenger.findOne({ PassengerID: req.body.PassengerID });
        if (existingPassenger) {
            return res.status(400).json({ message: "Passenger already exists in the Database!" });
        }
        const newPassenger = new Passenger(req.body);
        await newPassenger.save();
        res.status(200).json("Passenger has been created.");
    } catch (err) {
        console.error('Error occurred during request submission:', err);
        next(err);
    }
};

// Update passenger information
export const updatePassenger = async (req, res, next) => {
    try {
        const updatedPassenger = await Passenger.findOneAndUpdate(
            { PassengerID: req.params.PassengerID },
            { $set: req.body },
            { new: true }
        );
        if (!updatedPassenger) {
            return res.status(404).send("Passenger does not exist");
        }
        res.status(200).json("Passenger has been updated.");
    } catch (err) {
        next(err);
    }
};

// Delete a passenger
export const deletePassenger = async (req, res, next) => {
    try {
        const deletedPassenger = await Passenger.findOneAndDelete({ PassengerID: req.params.PassengerID });
        if (!deletedPassenger) {
            return res.status(404).send("Passenger does not exist");
        }
        res.status(200).json("Passenger has been deleted.");
    } catch (err) {
        next(err);
    }
};

// Get an passenger
export const getPassenger = async (req, res, next) => {
    try {
      const passenger = await Passenger.findOne({ PassengerID: req.params.PassengerID });
      if (!passenger) {
        return res.status(404).send("Passenger does not exist");
      }
      res.status(200).json(passenger);
    } catch (err) {
      next(err);
    }
  };

// Get all passengers
export const getPassengers = async (req, res, next) => {
    try {
      const passengers = await Passenger.find();
      if (!passengers) {
        return res.status(404).send("No existing passengers in database");
      }
      res.status(200).json(passengers);
    } catch (err) {
      next(err);
    }
  };

// Associate a passenger with a flight
export const addPassengerToFlight = async (req, res, next) => {
    try {
        const existingPassenger = await Passenger.findOne({ PassengerID: req.params.PassengerID });
        if (!existingPassenger) {
            return res.status(400).json({ message: "Passenger does not exist in the Database!" });
        }
        const accociatedPassenger = await PassengerFlight.findOne({ PassengerID: req.params.PassengerID, FlightNum: req.params.FlightNum });
        if (accociatedPassenger) {
            return res.status(400).json({ message: "Passenger already associated with Flight!" });
        }
        const passengerFlight = new PassengerFlight({
            PassengerID: req.params.PassengerID,
            FlightNum: req.params.FlightNum
        });
        await passengerFlight.save();
        res.status(200).json("Passenger has been associated with the flight.");
    } catch (err) {
        next(err);
    }
};

// Get passenger travel history
export const getTravelHistory = async (req, res, next) => {
    try {
        const travelHistory = await PassengerFlight.find({ PassengerID: req.params.PassengerID });
        if (travelHistory.length === 0) {
            return res.status(404).send("Passenger does not have any travels recorded or does not exist");
          }
        res.status(200).json(travelHistory);
    } catch (err) {
        next(err);
    }
};

