import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service:"Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOrderNotification = async (userEmail, subject, message)=>{
    const mailOptions = {
        from : process.env.EMAIL_USER,
        to : user.email,
        subject,
        text: message,
    };
    try{
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully", userEmail);
    }
    catch(error){
        console.log("Error sending email", error);
    }
}


export {sendOrderNotification}