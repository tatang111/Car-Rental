import midtransClient from "midtrans-client"
import prisma from "../prisma-client.js"

let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
})

export const createTokenMidtrans = async (req, res) => {
    try {
        const { id, totalPrice, productName } = req.body

        let parameter = {
            transaction_details: {
                order_id: id,
                gross_amount: Number(totalPrice)
            },
            customer_details: {
                id: id,
                price: totalPrice,
                name: productName
            }
        }


        const token = await snap.createTransaction(parameter)

        await prisma.booking.update({
            where: {
                id: id
            },
            data: {
                midtransToken: token.token
            }
        })

        res.status(201).json({ token: token.token })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
} 