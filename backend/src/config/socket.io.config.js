const express = require('express');
const { Server } = require('socket.io');
const http = require('http');

const app = express();

const server = http.createServer(app);

const io = new Server(server , {
    cors : {
        origin : ['http://localhost:5173']
    },
});

io.on('connection', (socket)=>{
    console.log("A user connected", socket.id);

    socket.on("joinRoom", (videoId) => {
    socket.join(videoId);
    console.log(`User joined room: ${videoId}`);
  });

  // Handle new comments
  socket.on("sendComment", ({ videoId, comment }) => {
    io.to(videoId).emit("newComment", comment);  // Send only to users in that room
  });
    
    socket.on('disconnect',()=>{
        console.log("A user disconnected",socket.id)
    })
})

module.exports = { server , app , io}