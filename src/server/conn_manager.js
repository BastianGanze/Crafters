'use strict';

class ConnManager {

    constructor(io) {
        this.io = io;

        this.clients = [];
        this.events = new Map();
    }
    
    listen() {

        this.io.on("connection", (socket) => {

            socket.on("join", (data) => {

                socket.emit('login', {
                    team: "blue"
                });

                this.clients.push(socket);
                this.events.set(socket, []);
            });

            socket.on("leave", () => {
                for (let i = 0; i < this.clients.length; i++) {
                    if (socket === this.clients[i]) {
                        this.clients.splice(i, 1);
                        this.events.delete(socket);
                        return;
                    }
                }
            });

            socket.on("mouse event", (data) => {
                this.events.get(socket).push({ mouse: data });
            });

            socket.on("keep alive", (data) => {
               //console.log(data);
            });

        });

    }

}

module.exports = ConnManager;