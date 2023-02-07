import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import ConfigureDatabase from './config/mongoose.js';
import routes from './routes/index.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50MB' }));
app.use(express.urlencoded({ extended: true }));

ConfigureDatabase();
app.use('/', routes);

app.listen(port, error => {
  if (error) {
    console.log(`Error in starting the server, ${error}`);
    return;
  }

  console.log(`Server is running on port, ${port}`);
});
