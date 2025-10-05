import jwt from "jsonwebtoken"
import prisma from "../prisma-client.js";

export const protect = async (req, res, next) => {
    const authHeader = req.headers["authorization"]
    
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({ success: false, message: "Not Authorized" })
    }

    const token = authHeader.split(" ")[1]
    try {

        const userId = jwt.decode(token, process.env.JWT_SECRET)
        
        if (!userId) {
            return res.status(401).json({ success: false, message: "Not Authorized" })
        }
        
        req.user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            omit: {
                password: true
            }
        })
        next()
    } catch (error) {
        return res.status(401).json({ success: false, message: "Not Authorized" })
    }
}