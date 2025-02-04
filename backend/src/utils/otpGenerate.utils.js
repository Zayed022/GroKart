import axios from "axios";

// MSG91 API Configuration
const MSG91_API_KEY = process.env.MSG91_API_KEY; // Replace with your actual MSG91 API key
const SENDER_ID = process.env.SENDER_ID; // Replace with your approved MSG91 Sender ID
const TEMPLATE_ID = process.env.TEMPLATE_ID; // Replace with your approved template ID
/*

async function sendOTP(phone) {
  try {
    const response = await axios.post(" https://api.msg91.com/api/v5/otp", {
      authkey: MSG91_API_KEY,
      phone: phone,
      sender: SENDER_ID,
      otp_length: 4, // OTP length as needed
      template_id: TEMPLATE_ID, // Ensure this is correct
    });
    console.log("OTP sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error.response?.data || error.message);
    throw new Error("Failed to send OTP");
  }
}


async function verifyOTP(phone, otp) {
  try {
    const response = await axios.post("https://api.msg91.com/api/v5/otp/verify", {
      authkey: MSG91_API_KEY,
      phone: phone,
      otp: otp,
    });
    console.log("OTP verified successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error.response.data);
    throw new Error("Failed to verify OTP");
  }
}
  */

export const sendOTP = async (phone, otp) => {
  const apiKey = process.env.MSG91_API_KEY;
  const senderId = process.env.SENDER_ID;
  const message = `Your OTP is ${otp}. Please use this to complete your registration.`;

  const url = `https://control.msg91.com/api/v5/otp?authkey=${apiKey}&mobile=${phone}&message=${message}&sender=${senderId}&otp=${otp}&otp_length=6&otp_expiry=5`;

  try {
    const response = await axios.post(url);
    console.log(url)
    return response.data;
  } catch (error) {
    throw new Error("Failed to send OTP: " + error.message);
  }
};

//export{sendOTP,//verifyOTP
  //}