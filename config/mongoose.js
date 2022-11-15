import mongoose from 'mongoose';

export default async function ConfigureDatabase() {
  await mongoose
    .connect(
      'mongodb+srv://fitmedik:fitmedik@cluster0.kg9dsge.mongodb.net/?retryWrites=true&w=majority',
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log('Connected to the database successfully.'))
    .catch(() => console.log('Error in connecting to the database.'));
}
