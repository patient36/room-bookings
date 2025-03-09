import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const snsClient = new SNSClient({ region: process.env.AWS_REGION })

const sendSMS = async (phone, message) => {
    const params = {
        Message: message,
        PhoneNumber: phone
    }

    try {
        const command = new PublishCommand(params)
        const result = await snsClient.send(command)
        console.log("SMS sent successfully", result.MessageId)
        return result
    } catch (error) {
        console.error("Error sending SMS", error.message)
        throw error
    }
}

export default sendSMS