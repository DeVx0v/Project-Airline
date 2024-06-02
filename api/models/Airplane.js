import mongoose from "mongoose"

const airplaneSchema = new mongoose.Schema({
    SerNum: { type: String, required: true, unique: true },
    Manufacturer: { type: String, required: true },
    Model: { type: String, required: true }
});

export default mongoose.model('Airplane', airplaneSchema);
