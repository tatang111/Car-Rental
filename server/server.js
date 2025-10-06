import express from "express";
import "dotenv/config";
import cors from 'cors'
import userRouter from "./src/routes/user.route.js";
import ownerRouter from "./src/routes/owner.route.js";
import bookingRouter from "./src/routes/booking.route.js";
import midtransRouter from "./src/routes/midtrans.route.js";
import pkg from "@supabase/supabase-js"
import serverless from "serverless-http"

// Initialize express app
const app = express();
const { createClient } = pkg

// Middleware
app.use(cors({
    origin: ["http://localhost:3000", "https://car-rental-gold-five.vercel.app"],
    credentials: true
}));
app.use(express.json());

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
)

app.get("/ping", async (req, res) => {
    try {
        const { data, error } = await supabase.from("user").select("id").limit(1)
        if (error) throw error;
        res.json({ message: "Ping successful!", time: new Date().toISOString() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ping failed", error: error.message });
    }
})

app.get("/", (req, res) => {
    res.send("Server is Running!")
})

// Routes
app.use("/api/user", userRouter)
app.use("/api/owner", ownerRouter)
app.use("/api/bookings", bookingRouter)
app.use("/api/midtrans", midtransRouter)

export const handler = serverless(app);
const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`)
// })
