import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (token?: string) => {
  if (!socket) {
    socket = io("/", {
      autoConnect: false,
      auth: { token }
    });
  } else if (token && socket.auth && (socket.auth as any).token !== token) {
    socket.auth = { token };
    socket.disconnect().connect();
  }
  return socket;
};
