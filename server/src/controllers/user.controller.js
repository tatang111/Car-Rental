import prisma from "../prisma-client.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// Generate JWT Token
const generateToken = (userId) => {
    const payload = userId;
    return jwt.sign(payload, process.env.JWT_SECRET)
}


// Register User
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Fill all the fields" })
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" })
        }

        const userExist = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (userExist) {
            return res.status(409).json({ success: false, message: "User already Exist" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })

        const token = generateToken(user.id.toString());

        res.status(201).json({ success: true, token })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Login user
export const loginUser = async (req, res) => {
    try {
        const { email, password, provider, name } = req.body;

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            if (provider === "google") {
                const newUser = await prisma.user.create({
                    data: {
                        name,
                        email,
                        password: await bcrypt.hash("GOOGLE_SECRET", 10),
                        provider: "google",
                    },
                });
                const token = generateToken(newUser.id.toString());
                return res.status(200).json({ success: true, token });
            } else {
                return res.status(404).json({ success: false, message: "Invalid credentials" });
            }
        }

        // Existing user
        if (provider === "google") {
            // Let the user login with google 
            // even though the user registered with email and password

            // if (user.provider !== "google") {
            //     return res.status(400).json({ success: false, message: "This email is registered with password, not Google" });
            // }
        } else if (user.provider === "google") {
            return res.status(400).json({ success: false, message: "Please login with Google for this email" });
        } else {
            // Normal login
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: "Invalid credentials" });
            }
        }

        const token = generateToken(user.id.toString());
        return res.status(200).json({ success: true, token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};


// Get User data using token (JWT)
export const getUserData = async (req, res) => {
    try {
        const { user } = req;
        res.json({ success: true, user })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Get All Cars for the frontend
export const getCars = async (req, res) => {
    try {
        const cars = await prisma.car.findMany({
            where: {
                isAvailable: true
            }
        })

        res.json({ success: true, cars })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: error.message })
    }
}



