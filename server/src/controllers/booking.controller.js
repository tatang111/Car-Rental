import prisma from "../prisma-client.js"


// Function to check avilability of car for a given date 
export const checkAvailability = async (carId, pickupDate, returnDate) => {
    const bookings = await prisma.booking.findMany({
        where: {
            car: carId,
            pickupDate: { lte: new Date(returnDate) },
            returnDate: { gte: new Date(pickupDate) },
        }
    })
    return bookings.length === 0
}

// api to check availability of cars for the given date and location
export const checkAvailabilityOfCar = async (req, res) => {
    try {
        const { location, pickupDate, returnDate } = req.body

        // fetch all available cars for the given location
        const cars = await prisma.car.findMany({
            where: {
                location,
                isAvailable: true
            }
        })

        //fetch car availability for the given date range using promise
        const availableCarsPromise = cars.map(async (car) => {
            const isAvailable = await checkAvailability(car.id, pickupDate, returnDate)
            return { ...car, isAvailable }
        })

        let availableCars = await Promise.all(availableCarsPromise)
        availableCars = availableCars.filter(car => car.isAvailable == true)

        res.status(200).json({ success: true, availableCars })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: error.message })
    }
}

// API to create booking
export const createBooking = async (req, res) => {
    try {
        const { id } = req.user;
        const { car, pickupDate, returnDate } = req.body

        const isAvailable = await checkAvailability(car, pickupDate, returnDate)
        if (!isAvailable) return res.status(400).json({ success: false, message: "This car is not available for the selected dates." })

        const carData = await prisma.car.findUnique({
            where: {
                id: car
            }
        })

        //Calculate price based on pickupDate and returnDate 
        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);
        const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24))

        const price = carData.pricePerDay * noOfDays;

        const booking = await prisma.booking.create({
            data: {
                car,
                owner: carData.owner,
                user: id,
                pickupDate,
                returnDate,
                price
            }
        })

        res.status(201).json({ success: true, message: "Booking created!", booking})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: error.message })
    }
}

// API TO list user bookings 
export const getUserBookings = async (req, res) => {
    try {
        const { id } = req.user;

        const bookings = await prisma.booking.findMany({
            where: {
                user: id
            },
            include: {
                carRel: true,
                ownerRel: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        res.status(201).json({ success: true, bookings })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: error.message })
    }
}

// API to get Owner bookings  
export const getOwnerBookings = async (req, res) => {
    try {
        if (req.user.role !== "owner") return res.status(400).json({ success: false, message: "Not authorizedd" });

        const bookings = await prisma.booking.findMany({
            where: {
                owner: req.user.id
            },
            include: {
                carRel: true,
                userRel: true,
                ownerRel: true,
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        res.status(201).json({ success: true, bookings })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: error.message })
    }
}

// API to change the booking status
export const changeBookingStatus = async (req, res) => {
    try {
        const { id } = req.user;
        const { bookingId, status } = req.body


        const booking = await prisma.booking.findUnique({
            where: {
                id: bookingId
            }
        })

        if (!id || !booking) {
            return res.status(400).json({ success: false, message: "Not authorized" })
        }

        await prisma.booking.update({
            where: {
                id: bookingId
            },
            data: {
                status
            }
        })

        res.status(201).json({ success: true, message: "Status updated" })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: error.message })
    }
}