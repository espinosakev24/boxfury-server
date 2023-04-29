import { createServer } from 'http';
import { Server } from 'socket.io';
import { EVENTS } from './src/constants/events.js';
import Player from './src/models/player.js';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
  },
});

let players = [];

io.on('connection', function (socket) {
  socket.on('player_connect', ({ id, name, x, y }) => {
    const newPlayer = new Player({
      id,
      name: 'name1',
      x,
      y,
      socketId: socket.id,
    });
    players.push(newPlayer);

    io.to(socket.id).emit('connected', { players });
    socket.broadcast.emit('new_player_connected', newPlayer);
  });

  socket.on(EVENTS.DISCONECT, (data) => {
    let playerOutId = 0;
    players = players.filter((player) => {
      if (player.socketId === socket.id) {
        playerOutId = player.id;
        return false;
      }
      return true;
    });

    console.log(players);

    socket.broadcast.emit('player_disconnected', { id: playerOutId });
  });
});

httpServer.listen(8000);
