import City from "../models/City.js"
import IntermediateCities from "../models/Intermediate_Cities.js"

// Add a new city
export const addCity = async (req, res, next) => {
    try {
        const existingCity = await City.findOne({ CityName: req.body.CityName });
        if (existingCity) {
            return res.status(400).json({ message: "City already exists in the Database!" });
        }
        const newCity = new City(req.body);
        await newCity.save();
        res.status(200).json("City has been created.");
    } catch (err) {
        console.error('Error occurred during request submission:', err);
        next(err);
    }
};

// Update city information
export const updateCity = async (req, res, next) => {
    try {
        const updatedCity = await City.findOneAndUpdate(
            { CityName: req.params.CityName },
            { $set: { CityName: req.body.CityName } },
            { new: true }
        );
        if (!updatedCity) {
            return res.status(404).send("City not found");
        }
        res.status(200).json("City has been updated.");
    } catch (err) {
        next(err);
    }
};

// Delete a city
export const deleteCity = async (req, res, next) => {
    try {
        const deletedCity = await City.findOneAndDelete({ CityName: req.params.CityName});
        if (!deletedCity) {
            return res.status(404).send("City not found");
        }
        res.status(200).json("City has been deleted.");
    } catch (err) {
        next(err);
    }
};

// Get a city
export const getCity = async (req, res, next) => {
    try {
      const city = await City.findOne({ CityName: req.params.CityName });
      if (!city) {
        return res.status(404).send("City does not exist");
      }
      res.status(200).json(city);
    } catch (err) {
      next(err);
    }
  };
  // Get all cities
export const getCities = async (req, res, next) => {
    try {
      const cities = await City.find();
      if (!cities) {
        return res.status(404).send("No existing cities in database");
      }
      res.status(200).json(cities);
    } catch (err) {
      next(err);
    }
};




// Add an intermediate stop for a flight
export const addIntermediateStop = async (req, res, next) => {
    try {
        const existingCity = await City.findOne({ CityName: req.body.CityName });
        if (!existingCity) {
            return res.status(400).json({ message: "City doesn't exist in the Database!" });
        }
        const recordedstop = await IntermediateCities.findOne({ CityName: req.body.CityName, FlightNum: req.body.FlightNum });
        if (recordedstop) {
            return res.status(400).json({ message: "Intermediate stop for this flight is already recorded!" });
        }
        const intermediateCity = new IntermediateCities({
            CityName: req.body.CityName,
            FlightNum: req.body.FlightNum
        });
        await intermediateCity.save();
        res.status(200).json("Intermediate stop has been added.");
    } catch (err) {
        next(err);
    }
};

// Update intermediate stop information
export const updateIntermediateStop = async (req, res, next) => {
    try {
        const existingCity = await City.findOne({ CityName: req.params.CityName });
        if (!existingCity) {
            return res.status(400).json({ message: "City doesn't exist in the Database!" });
        }
        const updatedCity = await IntermediateCities.findOneAndUpdate(
            { CityName: req.params.CityName },
            { $set: req.body },
            { new: true }
        );
        if (!updatedCity) {
            return res.status(404).send("Intermediate stop not found");
        }
        res.status(200).json("Intermediate stop has been updated.");
    } catch (err) {
        next(err);
    }
};

// Delete an intermediate stop
export const deleteIntermediateStop = async (req, res, next) => {
    try {
        const deletedintermediatestop = await IntermediateCities.findOneAndDelete({ CityName: req.params.CityName, FlightNum: req.params.FlightNum});
        if (!deletedintermediatestop) {
            return res.status(404).send("Intermediate stop not found");
        }
        res.status(200).json("Intermediate stop has been deleted.");
    } catch (err) {
        next(err);
    }
};

// Get an intermediate stop
export const getIntermediateStop = async (req, res, next) => {
    try {
      const stop = await IntermediateCities.findOne({ CityName: req.params.CityName, FlightNum: req.params.FlightNum });
      if (!stop) {
        return res.status(404).send("This Intermediate stop does not exist");
      }
      res.status(200).json(stop);
    } catch (err) {
      next(err);
    }
};

// Get all intermediate stops for a flight
export const getIntermediateStops = async (req, res, next) => {
    try {
        const stops = await IntermediateCities.find({ FlightNum: req.params.FlightNum });
        if (stops.length === 0) {
            return res.status(404).send("Flight does not have any intermediate stops recorded");
          }
        res.status(200).json(stops);
    } catch (err) {
        next(err);
    }
};

