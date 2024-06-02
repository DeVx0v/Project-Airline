import mongoose from "mongoose"

const intermediateCitiesSchema = new mongoose.Schema({
    CityName: { type: String, ref: 'City', required: true },
    FlightNum: { type: String, ref: 'Flight', required: true }
});

export default mongoose.model('IntermediateCities', intermediateCitiesSchema);
