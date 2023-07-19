const express = require('express')
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express()
const dotenv = require('dotenv').config()
const morgan = require('morgan')
const PORT = process.env.PORT || 4000
const dbConnect = require('./config/dbConnect')
const { notFound, errorHandler } = require('./middlewares/errorHandler');

dbConnect()
app.use(morgan())
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// controller
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute")
const blogRouter = require('./routes/blogRoute')

app.use("/api/user", authRouter);
app.use('/api/product', productRouter)
app.use('/api/blog', blogRouter)

app.use(notFound)
app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
})