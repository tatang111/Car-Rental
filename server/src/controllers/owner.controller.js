import imagekit from "../lib/imageKit.js";
import prisma from "../prisma-client.js"
import fs from "fs"

// API to change role of user
export const changeRoleToOwner = async (req, res) => {
    try {
        const { id } = req.user;

        await prisma.user.update({
            where: {
                id
            },
            data: {
                role: "owner"
            }
        })

        res.status(200).json({ success: true, message: "Now you can list cars" })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message })
    }
}

// API TO List car
export const addCar = async (req, res) => {
    try {
        const { id } = req.user;
        let car = JSON.parse(req.body.carData)
        let imageFile = req.file;

        // Upload image to imagekit
        const response = await imagekit.files.upload({
            file: fs.createReadStream(imageFile.path),
            fileName: imageFile.originalname,
            folder: "/cars"
        })


        // optimization through imagekit url transformation
        const optimizedImageUrl = imagekit.helper.buildSrc({
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
            src: response.filePath,
            transformation: [
                { width: 1280 }, // Width resizing
                { quality: "auto" }, // Auto compression 
                { format: "webp" }, // Convert to moden format
            ],
        });

        const image = optimizedImageUrl;
        await prisma.car.create({
            data: {
                ...car,
                owner: id,
                image
            }
        })

        res.status(201).json({ success: true, message: "Car Added" })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message })
    }
}

// API to list Owner Cars
export const getOwnerCars = async (req, res) => {
    try {
        const { id } = req.user;

        const cars = await prisma.car.findMany({
            where: {
                owner: id
            }
        })

        res.status(200).json({ success: true, cars })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message })
    }
}

// API to toggle car availability
export const toggleCarAvailability = async (req, res) => {
    try {
        const { id } = req.user;
        const { carId } = req.body

        const car = await prisma.car.findUnique({
            where: {
                id: carId
            }
        })

        // Checking is car belongs to the user
        if (car.owner.toString() !== id.toString()) {
            return res.status(400).json({ success: false, message: "Unauthorized" })
        }

        await prisma.car.update({
            where: {
                id: car.id
            },
            data: {
                isAvailable: !car.isAvailable
            }
        })

        res.status(200).json({ success: true, message: "Availability Toggled" })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message })
    }
}

// API to delete a car
export const deleteCar = async (req, res) => {
    try {
        const { id } = req.user;
        const { carId } = req.body

        const car = await prisma.car.findUnique({
            where: {
                id: carId
            }
        })

        // Checking is car belongs to the user
        if (car.owner.toString() !== id.toString()) {
            return res.status(400).json({ success: false, message: "Unauthorized" })
        }

        await prisma.car.update({
            where: {
                id: car.id
            },
            data: {
                owner: null,
                isAvailable: false
            }
        })

        res.status(200).json({ success: true, message: "Car Removed" })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message })
    }
}

// API to get Dashboard data
export const getDashboardData = async (req, res) => {
    try {
        const { id, role } = req.user;

        if (role !== "owner") {
            return res.status(409).json({ success: false, message: "Unauthorized" })
        }

        const cars = await prisma.car.findMany({
            where: {
                owner: id
            },
        });

        const bookings = await prisma.booking.findMany({
            where: {
                owner: id
            },
            include: {
                carRel: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        const pendingBookings = await prisma.booking.findMany({
            where: {
                owner: id,
                status: "pending"
            }
        })

        const completedBookings = await prisma.booking.findMany({
            where: {
                owner: id,
                status: "confirmed"
            }
        })

        // Calculate from booking where status is confirmed
        const monthlyRevenue = bookings.slice().filter((booking) => booking.status === "confirmed").reduce((acc, booking) => acc + booking.price, 0)

        const dashboardData = {
            totalCars: cars.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice(0, 3),
            monthlyRevenue
        }

        res.status(200).json({ success: true, dashboardData })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message })
    }
}

// API to update user image
export const updateUserImage = async (req, res) => {
    try {
        const { id } = req.user;
        const imageFile = req.file

        // Upload image to imagekit
        const response = await imagekit.files.upload({
            file: fs.createReadStream(imageFile.path),
            fileName: imageFile.originalname,
            folder: "/users"
        })

        // Optimization through imagekit URL transformation
        const optimizedImageUrl = imagekit.helper.buildSrc({
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
            src: response.filePath,
            transformation: [
                { width: 400 }, // Width resizing
                { quality: "auto" }, // Auto compression 
                { format: "webp" }, // Convert to moden format
            ],
        })

        const image = optimizedImageUrl;

        await prisma.user.update({
            where: {
                id
            },
            data: {
                image
            }
        })

        res.status(200).json({ success: true, message: "Image updated!" })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message })
    }
}