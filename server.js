import "dotenv/config";
import { Server as WebsocketServer } from "socket.io";
import { createServer } from "node:http";

import app from "./app.js";

const httpServer = createServer(app);
const io = new WebsocketServer(httpServer);

const users = [];

io.on("connection", (socket) => {
  console.log("Un utilisateur est connecté");
  const user = {
    id: socket.id,
    ip: socket.handshake.address,
    username: socket.id,
  };
  users.push(user);

  console.log(`user ${user.username} connected`);
  console.log(`we are now ${users.length} users connected`);

  socket.on("disconnect", () => {
    console.log("utilisateur déconnecté");
    const userIndex = users.find((currentUser) => currentUser.id === user.id);
    users.splice(userIndex, 1);
    console.log(`user ${user.id} disconnected`);
    console.log(`we are now ${users.length} users connected`);
  });
});

const port = process.env.SERVER_PORT ?? 3000;

httpServer.listen(port, () => {
  console.log(`🚀 Server listening at http://localhost:${port}`);
});
