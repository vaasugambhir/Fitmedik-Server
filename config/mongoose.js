import mongoose from "mongoose";

export default async function ConfigureDatabase() {
  await mongoose
    .connect(
      "mongodb+srv://aaditya:123@fitmedik.ivd9cyo.mongodb.net/test"
    )
    .then(() => console.log("Connected to the database successfully."))
    .catch(() => console.log("Error in connecting to the database."));
}
