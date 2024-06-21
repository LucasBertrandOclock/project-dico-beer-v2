import "dotenv/config";
import mongoose, { connect } from "mongoose";

const mongoose = connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default mongoose;
