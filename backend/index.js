require('dotenv').config();
const express = require('express');
const cors = require("cors");
const { app , server , io} = require('./src/config/socket.io.config');

const cookieParser = require('cookie-parser');

const connectDb = require('./src/config/db.config');

const PORT = process.env.PORT || 5000;

const videoRoute = require('./src/routes/video.route');
const authRoute = require('./src/routes/auth.route');
const profileRoute = require('./src/routes/profile.route');
const homeRoute = require('./src/routes/home.route');
const aiRoute = require('./src/routes/ai.route');
app.use(cookieParser())
app.use(express.json());
app.use(
    cors({
      origin: ["http://localhost:5173", "https://yourfrontend.com"], // Allowed origins
      methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
      allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
      credentials: true, // Allow cookies & authorization headers
    })
);

app.use( "/api/videos" , videoRoute);
app.use('/api/auth' , authRoute);
app.use('/api/profile' , profileRoute);
app.use('/api/home' , homeRoute);
app.use('/api/ai', aiRoute)

server.listen(PORT,()=>{
    console.log(`Sever is running on the port number ${PORT}`);
    connectDb();
})