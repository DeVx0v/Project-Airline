import Staff from "../models/Staff.js"
import StaffFlight from "../models/Staff_Flight.js"
import PilotRating from "../models/Pilot_Rating.js"


// Add a new staff member
export const addStaff = async (req, res, next) => {
    try {
        const existingStaff = await Staff.findOne({ EmpNum: req.body.EmpNum });
        if (existingStaff) {
            return res.status(400).json({ message: "Staff member already exists in the Database!" });
        }
        const newStaff = new Staff(req.body);
        await newStaff.save();
        res.status(200).json("Staff member has been created.");
    } catch (err) {
        console.error('Error occurred during request submission:', err);
        next(err);
    }
};

// Update staff information
export const updateStaff = async (req, res, next) => {
    try {
        const updatedStaff = await Staff.findOneAndUpdate(
            { EmpNum: req.params.EmpNum },
            { $set: req.body },
            { new: true }
        );
        if (!updatedStaff) {
            return res.status(404).send("Staff member does not exist");
        }
        res.status(200).json("Staff member has been updated.");
    } catch (err) {
        next(err);
    }
};

// Delete a staff member
export const deleteStaff = async (req, res, next) => {
    try {
        const deletedStaff = await Staff.findOneAndDelete({ EmpNum: req.params.EmpNum });
        if (!deletedStaff) {
            return res.status(404).send("Staff member does not exist");
        }
        res.status(200).json("Staff member has been deleted.");
    } catch (err) {
        next(err);
    }
};

// Get an staff member
export const getStaff = async (req, res, next) => {
    try {
      const staff = await Staff.findOne({ EmpNum: req.params.EmpNum });
      if (!staff) {
        return res.status(404).send("Staff member does not exist");
      }
      res.status(200).json(staff);
    } catch (err) {
      next(err);
    }
  };

// Get all staff members
export const getStaffs = async (req, res, next) => {
    try {
      const staffs = await Staff.find();
      if (!staffs) {
        return res.status(404).send("No existing staff members in database");
      }
      res.status(200).json(staffs);
    } catch (err) {
      next(err);
    }
  };


// Assign staff to a flight
export const assignStaffToFlight = async (req, res, next) => {
    try {
        const assignedStaff = await StaffFlight.findOne({ EmpNum: req.params.EmpNum, FlightNum: req.params.FlightNum });
        if (assignedStaff) {
            return res.status(400).json({ message: "Passenger already associated with Flight!" });
        }
        const staffFlight = new StaffFlight({
            EmpNum: req.params.EmpNum,
            FlightNum: req.params.FlightNum
        });
        await staffFlight.save();
        res.status(200).json("Staff member has been assigned to the flight.");
    } catch (err) {
        next(err);
    }
};

// Get an assigned staff member
export const getassignedStaff = async (req, res, next) => {
    try {
      const assignedStaff = await StaffFlight.find({ EmpNum: req.params.EmpNum });
      if (!assignedStaff) {
        return res.status(404).send("Staff member is not assigned or does not exist");
      }
      res.status(200).json(assignedStaff);
    } catch (err) {
      next(err);
    }
  };

// Get all assigned staff members
export const getallassignStaffToFlight = async (req, res, next) => {
    try {
      const assignedStaffs = await StaffFlight.find();
      if (!assignedStaffs) {
        return res.status(404).send("No assigned staff members in database");
      }
      res.status(200).json(assignedStaffs);
    } catch (err) {
      next(err);
    }
  };

// Record pilot rating
export const recordPilotRating = async (req, res, next) => {
    try {
        const pilotRating = new PilotRating({
            EmpNum: req.body.EmpNum,
            Rating: req.body.Rating
        });
        await pilotRating.save();
        res.status(200).json("Pilot rating has been recorded.");
    } catch (err) {
        next(err);
    }
};

// Update Rating
export const updateRating = async (req, res, next) => {
    try {
        const updatedpilotRating = await PilotRating.findOneAndUpdate(
            { EmpNum: req.params.EmpNum },
            { $set: req.body },
            { new: true }
        );
        if (!updatedpilotRating) {
            return res.status(404).send("Rating does not exist");
        }
        res.status(200).json("Rating has been updated.");
    } catch (err) {
        next(err);
    }
};

// Delete a Rating
export const deleteRating = async (req, res, next) => {
    try {
        const deletedRating = await PilotRating.findOneAndDelete({ EmpNum: req.params.EmpNum });
        if (!deletedRating) {
            return res.status(404).send("Rating does not exist");
        }
        res.status(200).json("Rating has been deleted.");
    } catch (err) {
        next(err);
    }
};

// Get Rating
export const getRating = async (req, res, next) => {
    try {
      const getRating = await PilotRating.findOne({ EmpNum: req.params.EmpNum });
      if (!getRating) {
        return res.status(404).send("Rating does not exist");
      }
      res.status(200).json(getRating);
    } catch (err) {
      next(err);
    }
  };