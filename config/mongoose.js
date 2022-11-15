import mongoose from 'mongoose';

export default async function ConfigureDatabase() {
  await mongoose
    .connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log('Connected to the database successfully.'))
    .catch(() => console.log('Error in connecting to the database.'));
}
