import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import { dbStart } from './src/config/database.js';

const PORT = process.env.PORT || 5000;

dbStart();
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
