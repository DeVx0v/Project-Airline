import mongoose from "mongoose"

const staffSchema = new mongoose.Schema({
    EmpNum: { type: String, required: true, unique: true },
    Surname: { type: String, required: true },
    Name: { type: String, required: true },
    Address: { type: String, required: true },
    Phone: { type: String, required: true },
    Salary: { type: Number, required: true, set: v => Math.round(v * 100) / 100 },// This will round the value to two decimal places 
    StaffType: { type: String, required: true }
});

export default mongoose.model('Staff', staffSchema);
