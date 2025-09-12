const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');

require('dotenv').config();

const connectDB = require('./config/db');

const postsRoute = require('./routes/posts');
const commentsRoute = require('./routes/comments');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.set('io', io); // <-- Add this line to make io available in controllers

app.use(helmet());
app.use(cors({origin: process.env.CLIENT_URL, credentials: true}));
app.use(express.json());
app.use(cookieParser());    

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60, // limit each IP to 60 requests per windowMs
})

app.use(limiter)

app.use('/api/posts', postsRoute);
app.use('/api/posts', commentsRoute);

// Default route
app.get('/', (req, res) => {
  res.send('Anonymous Wall backend is running');
});

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('createPost', (post) => {
    io.emit('newPost', post);
  });

  socket.on('createComment', (comment) => {
    io.emit('newComment', comment);
  });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Connect to DB and start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
