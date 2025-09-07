import {app} from './app.js'; 
import dotenv from 'dotenv';
import { connectDb } from './db/index.js';

dotenv.config(); 

connectDb();

const PORT = process.env.PORT || 5000

try { 
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  
} catch (error) {
  console.error('Error starting server:', error);   
}