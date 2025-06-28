import cloudinary from 'cloudinary';
import { getEnvVar } from './getEnvVar.js';
import { CLOUDINARY } from '../constants/index.js';
import streamifier from 'streamifier';

cloudinary.v2.config({
  secure: true,
  cloud_name: getEnvVar(CLOUDINARY.CLOUD_NAME),
  api_key: getEnvVar(CLOUDINARY.API_KEY),
  api_secret: getEnvVar(CLOUDINARY.API_SECRET),
});

export const saveFileToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder: 'contacts' }, 
      (error, result) => {
        if (error) {
          console.log('Cloudinary error:', error);
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};
