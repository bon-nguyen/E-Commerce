const express = require('express')
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express()
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 4000
const dbConnect = require('./config/dbConnect')
const { notFound, errorHandler } = require('./middlewares/errorHandler');


// controller
const authRouter = require("./routes/authRoute");



dbConnect()
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/user", authRouter);
app.use(notFound)
app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
})