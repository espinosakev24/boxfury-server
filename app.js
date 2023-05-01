import { createServer } from 'http';
import { Server } from 'socket.io';
import { EVENTS } from './src/constants/events.js';
import Player from './src/models/player.js';
import { sessionStore } from './src/sessionStore.js';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', function (socket) {
  socket.on('player_connect', ({ id, name, x, y }) => {
    const newPlayer = new Player({
      id,
      name: 'name1',
      x,
      y,
      socketId: socket.id,
    });
    sessionStore.addToSession(sessionStore.currentSessionId, newPlayer);

    const currentSession = sessionStore.getCurrentSession();

    socket.join(sessionStore.currentSessionId);

    io.to(socket.id).emit('connected', { players: currentSession.players });
    socket.broadcast
      .to(sessionStore.currentSessionId)
      .emit('new_player_connected', newPlayer);
  });

  socket.on('player_action', ({ action, id, aimSpeed }) => {
    socket.broadcast.emit('player_moved', { action, id, aimSpeed });
  });

  socket.on('player_update', ({ id, x, y, aimAngle }) => {
    socket.broadcast.emit('player_updated', { id, x, y, aimAngle });
  });

  socket.on(EVENTS.DISCONECT, (data) => {
    const playerId = sessionStore.removePlayerFromSession(
      sessionStore.currentSessionId,
      socket.id
    );

    socket.broadcast.emit('player_disconnected', { id: playerId });
  });
});

httpServer.listen(8000);
