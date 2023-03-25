const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.join(__dirname, "../../build/public")));
app.use(express.static(path.join(__dirname, "../../public")));

app.get('/api', (req, res) => {
  res.send("Hallo");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../build/public/index.html"));
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    socket.emit('chat message', "Huhu");
  });
});

server.listen(3002, () => {
  console.log('\n[server/index] 🚀 Server started on *:3002');
});

module.exports = { io };