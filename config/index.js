const path = require('path');
require('dotenv').config({
    path:
        process.env.NODE_ENV === 'development '
            ? path.resolve('.env.development')
            : path.resolve(".env"),
});

exports.config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_MAILER_KEY: process.env.NODE_MAILER_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    SUCCESS_REDIRECT: process.env.SUCCESS_REDIRECT,
    FAILED_REDIRECT: process.env.FAILED_REDIRECT,
    GOOGLE_CALL_BACK_URL: process.env.GOOGLE_CALL_BACK_URL,
    DISCORD_CALL_BACK_URL: process.env.DISCORD_CALL_BACK_URL,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRET_KEY: process.env.S3_SECRET_KEY
}
