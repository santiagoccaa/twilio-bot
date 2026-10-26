import "dotenv/config";

const accountSid = process.env.TWILIO_ACCOUNT_SID || "";
const authToken = process.env.TWILIO_AUTH_TOKEN || "";

if(!accountSid) throw new Error("⁉️ Account Sid not found")
if(!authToken) throw new Error("⁉️ Auth Token not found")

export const twilioClient = require("twilio")(accountSid, authToken);