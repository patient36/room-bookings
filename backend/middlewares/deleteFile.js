import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: process.env.AWS_REGION });

const extractKeyFromUrl = (url) => {
    try {
        const parts = url.replace("https://", "").split("/");
        const key = parts.slice(1).join("/");
        return key;
    } catch (error) {
        console.error("Error extracting key from URL:", error.message);
        throw error;
    }
};

export const deleteFileFromS3ByUrl = async (url) => {
    try {
        const key = extractKeyFromUrl(url);

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key
        };
        const command = new DeleteObjectCommand(params);
        const result = await s3Client.send(command);
        console.log("File deleted successfully. Request ID:", result['$metadata'].requestId);
        return result;
    } catch (error) {
        console.error("Error deleting file from S3 by URL:", error.message);
        throw error;
    }
};