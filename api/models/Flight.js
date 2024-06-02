import mongoose from "mongoose"

const flightSchema = new mongoose.Schema({
    FlightNum: { type: String, required: true, unique: true },
    Origin: { type: String, required: true },
    Destination: { type: String, required: true },
    Date: { type: String, required: true },
    ArrTime: { type: String, required: true },
    DepTime: { type: String, required: true },
    SerNum: { type: String, ref: 'Airplane', required: true }
});

export default mongoose.model('Flight', flightSchema);
