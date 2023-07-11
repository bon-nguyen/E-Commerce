const express = require('express')
const bodyParser = require("body-parser");
const app = express()
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 4000
const dbConnect = require('./config/dbConnect')

// controller
const authRouter = require("./routes/authRoute");


dbConnect()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/user", authRouter);

app.use('/', (req, res) => {
    res.send("Hello server side")
})

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
})