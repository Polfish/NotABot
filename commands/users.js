const Discord = require('discord.js');

module.exports = {
    name: "users",
    description: "Lists all users of the server.",
    async execute(message, args, prefix, client) {
        // For some reason some users don't get cached and don't come out in the list. A fix was to use this line and put in the user id of the 
        // users that weren't cached:
        // await client.users.fetch('<userID>');

        const users = client.users.cache.map(user => user.username);

        const embed = new Discord.MessageEmbed()
            .setTitle('User List')
            .setDescription(users);
        return message.channel.send(embed);
    }
};