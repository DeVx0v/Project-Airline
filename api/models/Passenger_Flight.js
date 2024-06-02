import mongoose from "mongoose"

const passengerFlightSchema = new mongoose.Schema({
    PassengerID: { type: String, ref: 'Passenger', required: true },
    FlightNum: { type: String, ref: 'Flight', required: true }
});

export default mongoose.model('PassengerFlight', passengerFlightSchema);
