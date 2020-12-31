const Discord = require('discord.js');

module.exports = {
    name: "ping",
    description: "Pings the bot! Bot will respond with 'Pong' and the set prefix at the end.",
    usesDB: "false",
    async execute(message, args, prefix) {
        return message.channel.send(`Pong${prefix}`);
    }
};