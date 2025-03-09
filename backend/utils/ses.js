import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({ region: process.env.AWS_REGION });

const sendEmail = async (email, message, subject) => {
    const params = {
        Destination: {
            ToAddresses: [email]
        },
        Message: {
            Body: {
                Text: {
                    Data: `${message}.`
                },
                Html: {
                    Data: `<p>${message}</p>`
                }
            },
            Subject: {
                Data: subject
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

export default sendEmail