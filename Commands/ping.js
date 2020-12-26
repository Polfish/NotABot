module.exports = {a
    name: "ping",
    description: "Pings the bot!",
    execute(message, args, prefix) {
        message.channel.send(`Pong${prefix}`);
    }
};