const http = require('http');
const express = require('express');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Socket.io server code here
io.on('connection', (socket) => {
  console.log(`User connected`);


  // Listen for custom events and handle them here
  socket.on('chat message', (message) => {
    // Broadcast the message to all connected clients
    io.emit('chat message', message);
  });

  // Handle incoming friend requests
  socket.on('incoming_friend_requests', (data) => {
    console.log("heeeeeeeere server incoming_friend_requests")
    // Handle incoming friend request data here
    // You can send this data to the specific user by targeting their socket ID
    // Example: io.to(socketId).emit('incoming_friend_requests', data);
    //io.to(socket.id).emit('incoming_friend_requests', {
      io.emit('incoming_friend_requests', {
      senderId: data.senderId,
      senderEmail:data.senderEmail
    });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});


// // server.js
// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const bodyParser = require('body-parser'); // Middleware for parsing JSON request bodies

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"]
//   }
// });

// // Add the following CORS setup before defining your WebSocket logic
// const cors = require('cors');

// const corsOptions = {
//   origin: 'http://localhost:3000', // Replace with the origin of your frontend application
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true, // If your application uses credentials (cookies, sessions, etc.)
// };

// app.use(cors(corsOptions));

// //const router  = express.Router(); 

// // Use the bodyParser middleware to parse JSON request bodies
// app.use(bodyParser.json());

// // Add your custom server routes and middleware here if needed

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   // Define your socket.io event handlers here
//   socket.on('incoming_friend_requests', (message) => {
//     io.emit('incoming_friend_requests', message); // Broadcast the message to all connected clients
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });

// // app.post('/api/add-friend', async (req, res) => {
// //   console.log("server api addddd")
// //   try {
// //     const body = await req.json()

// //     // valid request, send friend request
// //     console.log("trigger pusher", body)
// //     //   await pusherServer.trigger(
// //     //     toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
// //     //     'incoming_friend_requests',
// //     //     {
// //     //         senderId: session.user.id,
// //     //         senderEmail: session.user.email,
// //     //     }
// //     // )
// //     const idToAdd = 'someUserId'; // Replace with the target user's ID
// //     const senderId = body.session.user.id;
// //     const senderEmail = body.session.user.email;
// //     // Emit the event to the specific user's room (assuming idToAdd is the socket room name)
// //     io.to(body.idToAdd).emit('incoming_friend_requests', {
// //       senderId,
// //       senderEmail,
// //     });


// //     return new Response('OK')
// //   } catch (error) {
// //      return new Response('Invalid request', { status: 400 })
// //   }
// // });

// //app.use(router)

// server.listen(3001, () => {
//   console.log('Server is running on port 3001');
// });
