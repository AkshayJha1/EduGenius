require('dotenv').config();
const express = require('express');
const cors = require("cors");
const path = require('path');
const { app , server , io} = require('./src/config/socket.io.config');

const cookieParser = require('cookie-parser');

const connectDb = require('./src/config/db.config');

const PORT = process.env.PORT || 5000;

const videoRoute = require('./src/routes/video.route');
const authRoute = require('./src/routes/auth.route');
const profileRoute = require('./src/routes/profile.route');
const homeRoute = require('./src/routes/home.route');
const aiRoute = require('./src/routes/ai.route');
const paymentRoute = require('./src/routes/payment.route');

const corsOption = {
  origin : process.env.NODE_ENV === 'development' ? "http://localhost:5173" : "https://edugenius.onrender.com",
  methods : "GET ,  POST , PUT , DELETE , PUT , PATCH ,  HEAD",
  Credential : true,
}

app.use(cookieParser())
app.use("/api/payment/handlingWebhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(cors(corsOption));

app.use( "/api/videos" , videoRoute);
app.use('/api/auth' , authRoute);
app.use('/api/profile' , profileRoute);
app.use('/api/home' , homeRoute);
app.use('/api/ai', aiRoute);
app.use('/api/payment', paymentRoute);


const fs = require("fs");

if (process.env.NODE_ENV === "production") {
    const buildPath = path.join(__dirname, "../frontend/dist/index.html");
    
    if (!fs.existsSync(buildPath)) {
        console.error("🚨 Frontend build is missing! Run 'npm run build' inside the frontend folder.");
    } else {
        console.log("✅ Frontend build detected.");
    }

    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        if (!req.path.startsWith("/api")) {
            res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
        }
    });
}


server.listen(PORT,()=>{
    console.log(`Sever is running on the port number ${PORT}`);
    connectDb();
})