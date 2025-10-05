import express from "express";
import "dotenv/config";
import cors from 'cors'
import userRouter from "./src/routes/user.route.js";
import ownerRouter from "./src/routes/owner.route.js";
import bookingRouter from "./src/routes/booking.route.js";
import midtransRouter from "./src/routes/midtrans.route.js";

// Initialize express app
const app = express();


// Middleware
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Server is Running!")
})

// Routes
app.use("/api/user", userRouter)
app.use("/api/owner", ownerRouter)
app.use("/api/bookings", bookingRouter)
app.use("/api/midtrans", midtransRouter)


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
