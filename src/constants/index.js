import path from 'path';

export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const THIRTY_DAYS = 720 * 60 * 60 * 1000;

export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');


export const CLOUDINARY = {
    CLOUD_NAME: 'CLOUD_NAME',
    API_KEY: 'API_KEY',
    API_SECRET: 'API_SECRET',
}