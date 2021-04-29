module.exports = {
    name: "ping",
    description: "Pings the bot! Also displays latency/ping information.",
    usage: "",
    usesDB: false,
    async execute(message, args, prefix) {
        return message.channel.send(`Pong${prefix}`);
    }
};