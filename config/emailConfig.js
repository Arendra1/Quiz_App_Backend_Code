import dotenv from 'dotenv'
dotenv.config()
import nodemailer from 'nodemailer'


let transporter = nodemailer.createTransport({

    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465 false for other ports
    auth : {
        user: process.env.EMAIL_USER,  // Admin gmail ID
        pass: process.env.EMAIL_PASS   // Admin Password
    },


    // Hardcoded code
    // host: 'smtp.gmail.com',
    // port: 587,
    // secure: false, // true for 465 false for other ports
    // auth : {
    //     user: 'rajpootsandeep7987@gmail.com',  // Admin gmail ID
    //     pass: 'Sandeep@123'   // Admin Password
    // },


})

export default transporter