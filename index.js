require("dotenv").config();
const express = require("express");
const cors =require("cors");
const connectDb = require("./src/config/db");
const router = require("./src/routes/orderRouter");

connectDb()


const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/order',router)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`user-service is running at port http://localhost:${PORT}`);
});
