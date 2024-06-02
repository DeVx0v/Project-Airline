import mongoose from "mongoose"

const pilotRatingSchema = new mongoose.Schema({
    EmpNum: { type: String, ref: 'Staff', required: true },
    Rating: { type: String, required: true }
});

export default mongoose.model('PilotRating', pilotRatingSchema);
