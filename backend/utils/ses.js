import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({ region: process.env.AWS_REGION });

export const sendOTPViaEmail = async (email, otp) => {
    const params = {
        Destination: {
            ToAddresses: [email]
        },
        Message: {
            Body: {
                Text: {
                    Data: `Your OTP code is ${otp}.`
                },
                Html: {
                    Data: `<p>Your OTP code is <strong>${otp}</strong>.</p>`
                }
            },
            Subject: {
                Data: "Your OTP code"
            }
        },
        Source: process.env.AWS_SES_SENDER_EMAIL
    };

    try {
        const command = new SendEmailCommand(params);
        const result = await sesClient.send(command);
        console.log("Email sent successfully. MessageId:", result.MessageId);
        return result;
    } catch (error) {
        console.error("Error sending email:", error.message);
        throw error
    }
};