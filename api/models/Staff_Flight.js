import mongoose from "mongoose"

const staffFlightSchema = new mongoose.Schema({
    EmpNum: { type: String, ref: 'Staff', required: true },
    FlightNum: { type: String, ref: 'Flight', required: true }
});

export default mongoose.model('StaffFlight', staffFlightSchema);
