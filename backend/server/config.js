const dotenv = require('dotenv');
const path   = require('path');
const fs     = require('fs');

const legacyPath = path.resolve(__dirname, '..', '..', '.env');
const rootPath   = path.resolve(__dirname, '..', '..', '..', '.env');

if (fs.existsSync(legacyPath)) {
  dotenv.config({ path: legacyPath });
} else if (fs.existsSync(rootPath)) {
  dotenv.config({ path: rootPath });
} else {
  dotenv.config();
}

const env = {
  PORT                    : parseInt(process.env.PORT, 10) || 5000,
  INSTAGRAM_ACCESS_TOKEN  : process.env.INSTAGRAM_ACCESS_TOKEN || '',
  INSTAGRAM_USER_ID       : process.env.INSTAGRAM_USER_ID || '',
  NODE_ENV                : process.env.NODE_ENV || 'development',
};

module.exports = env;
