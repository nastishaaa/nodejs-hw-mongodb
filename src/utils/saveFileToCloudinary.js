import cloudinary from "cloudinary";
import streamifier from "streamifier";
import { getEnvVar } from "./getEnvVar.js";
import { CLOUDINARY } from "../constants/index.js";

cloudinary.v2.config({
    cloud_name: getEnvVar(CLOUDINARY.CLOUD_NAME),
    api_key: getEnvVar(CLOUDINARY.API_KEY),
    api_secret: getEnvVar(CLOUDINARY.API_SECRET),
});

export const saveFileToCloudinary = async (file) => {
    if (!file || !file.buffer) {
        throw new Error("Missing required parameter - file");
    }

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
            { folder: "contacts" },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
};
