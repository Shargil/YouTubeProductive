require('dotenv').config()

// Connect DB
const mongoose = require('mongoose')
// const uri = "mongodb+srv://admin:qVc450BAG6K0hC7C@youtubeproductive.f2djv.mongodb.net/YouTubeProductive?retryWrites=true&w=majority";
const prodUri = "mongodb://localhost:27017/local";
// If MONGO_DB_URI_DEV is defined connect to -> mongo atlas cloud Dev DB, if not connect to local (that what happens in prod)
const uri = process.env.MONGO_DB_URI_DEV || prodUri;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', (error) => { console.error(error) })
db.once('open', () => { console.log('Connected to DataBase') })

// Setup server
const express = require('express')
const helmet = require('helmet');

const app = express()

// Middleware
app.use(express.json())
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(helmet());
// app.use(compression()); // Compress all routes

// Routes
const channelsListRouter = require("./routes/channelsList")
app.use('/channelsList', channelsListRouter)

// Listen
app.listen(3000, () => { console.log('Server Started') })