module.exports = {
    name: "ping",
    description: "Pings the bot! Bot will respond with 'Pong' and the set prefix at the end.",
    execute(message, args, prefix) {
        message.channel.send(`Pong${prefix}`);
    }
};