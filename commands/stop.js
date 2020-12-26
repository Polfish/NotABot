module.exports = {
    name: "stop",
    description: "Terminates the bot!",
    execute(message, args, prefix, client) {
        client.destroy();
    }
};