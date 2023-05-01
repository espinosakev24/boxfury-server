class Player {
  constructor({ id, name, x, y, socketId }) {
    this.id = id;
    this.name = name;
    this.x = x;
    this.y = y;
    this.socketId = socketId;

    this.aimAngle = Math.PI / 4;
  }
}

export default Player;
