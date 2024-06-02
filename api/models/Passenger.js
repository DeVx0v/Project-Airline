import mongoose from "mongoose"

const passengerSchema = new mongoose.Schema({
    PassengerID: { type: String, required: true, unique: true },
    Surname: { type: String, required: true },
    Name: { type: String, required: true },
    Address: { type: String, required: true },
    Phone: { type: String, required: true }
});

export default mongoose.model('Passenger', passengerSchema);
