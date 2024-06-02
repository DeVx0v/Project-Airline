import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors";
import bodyParser from "body-parser"
import airplaneRoutes from './routes/AirplaneRoutes.js';
import cityRoutes from './routes/CityRoutes.js';
import flightRoutes from './routes/FlightRoutes.js';
import passengerRoutes from './routes/PassengerRoutes.js';
import staffRoutes from './routes/StaffRoutes.js';


const app = express();
dotenv.config();    

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to MongoDB")
      } catch (error) {
        console.log("Error in connection with MongoDB")
        throw error;
      }
};

mongoose.connection.on("connected", () =>{
    console.log("MongoDB connected!")
})

mongoose.connection.on("disconnected", () =>{
    console.log("MongoDB disconnected!")
})

app.use(cors())
app.use(bodyParser.json());


// Routes
app.use('/api', airplaneRoutes);
app.use('/api', cityRoutes);
app.use('/api', flightRoutes);
app.use('/api', passengerRoutes);
app.use('/api', staffRoutes);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    console.error('Server error:', err);
    return res.status(errorStatus).json({
      success: false,
      status: errorStatus,
      message: errorMessage,
      stack: err.stack,
    });
  });
  
  connect(); // Call connect function to establish MongoDB connection
  
  // Start the server
  const PORT = process.env.PORT || 8800;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
