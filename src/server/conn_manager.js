
class ConnManager {

    constructor(io) {
        this.io = io;

        this.clients = [];
    }
    
    listen() {

        this.io.on("connection", (socket) => {

            socket.on("join", (data) => {

                socket.emit('login', {
                    team: "blue"
                });

                this.clients.push(socket);
            });

            socket.on("keep alive", (data) => {
               console.log(data);
            });

        });

    }

}

module.exports = ConnManager;