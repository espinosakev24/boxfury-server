class SessionStore {
  MAX_SESSIONS = 100;
  MAX_PLAYERS = 1;

  constructor() {
    this.sessions = new Map();

    this.currentSessionId = Date.now();

    this.sessions.set(this.currentSessionId, { players: [] });
  }

  findSession(id) {
    return this.sessions.get(id);
  }

  createSession() {
    const sessionId = Date.now();

    console.log(sessionId);

    this.sessions.set(sessionId, { players: [] });

    return sessionId;
  }

  addToSession(id, player) {
    const session = this.sessions.get(id);
    if (session.players.length === 2) {
      this.currentSessionId = this.createSession();
    }
    this.sessions.get(this.currentSessionId).players.push(player);
  }

  getCurrentSession() {
    return this.sessions.get(this.currentSessionId);
  }

  removePlayerFromSession(sessionId, socketId) {
    const session = this.sessions.get(sessionId);

    let playerOutId = null;

    session.players = session.players.filter((player) => {
      if (player.socketId === socketId) {
        playerOutId = player.id;
        return false;
      }
      return true;
    });

    return playerOutId;
  }

  findAllSessions() {
    return [...this.sessions.values()];
  }
}

export const sessionStore = new SessionStore();
