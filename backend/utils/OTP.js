import "dotenv/config";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

// Load environment variables
const { AWS_REGION, DYNAMODB_TABLE } = process.env;

if (!AWS_REGION || !DYNAMODB_TABLE) {
    throw new Error('Missing required environment variables');
}

// Configure AWS SDK v3 DynamoDB client
const client = new DynamoDBClient({ region: AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

const sendOTP = async (email) => {
    if (!email) {
        throw new Error('Email is required');
    }

    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
    const ttl = Math.floor(Date.now() / 1000) + 300; // OTP valid for 5 minutes

    const params = {
        TableName: DYNAMODB_TABLE,
        Item: {
            email,
            otp,
            ttl,
        },
    };

    try {
        await docClient.send(new PutCommand(params));
        return { success: true, message: 'OTP generated and stored', otp };
    } catch (error) {
        console.error('Error storing OTP:', error);
        throw new Error('Failed to store OTP');
    }
};


const verifyOTP = async (email, otp) => {
    if (!email || !otp) {
        throw new Error('Email and OTP are required');
    }

    const params = {
        TableName: DYNAMODB_TABLE,
        Key: {
            email,
        },
    };

    try {
        const result = await docClient.send(new GetCommand(params));

        if (!result.Item) {
            return { success: false, message: 'OTP not found or expired' };
        }

        if (result.Item.otp === otp && result.Item.ttl > Math.floor(Date.now() / 1000)) {
            return { success: true, message: 'OTP verified successfully' };
        } else {
            return { success: false, message: 'Invalid OTP or expired' };
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        throw new Error('Failed to verify OTP');
    }
};

export { sendOTP, verifyOTP };