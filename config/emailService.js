import http from 'http'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
})
async function sendEmail(to, subject, text, html) {
    try {
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        const info = await transporter.sendMail({
            from: process.env.EMAIL,
            to,
            subject,
            text,
            html
        })
        // const info = await transporter.sendMail({
        //     from: process.env.EMAIL,
        //     to: 'one@one.com',
        //     subject: 'test',
        //     text: 'test',
        //     html: verifyCode
        // })
        return { success: true, messageId: info.messageId }
    } catch (error) {
        console.error('error sending email', error)
        return { success: false, error: error.message }
    }
}
export { sendEmail }



// const sendEmail = async ({ sendTo, subject, html }) => {
//     try {
//         const { data, error } = await resend.emails.send({
//             from: 'person',
//             to: sendTo,
//             subject: subject,
//             html: html
//         })
//         if (error) {
//             return console.error({ error })
//         }
//         return data
//     } catch (error) {
//         console.log(error)
//     }
// }
