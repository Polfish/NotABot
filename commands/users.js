const Discord = require('discord.js');

module.exports = {
    name: "users",
    description: "Lists all users of the server.",
    usesDB: "false",
    async execute(message, args, prefix, client) {
        // This command will get all members including the ones that were not cached
        await message.guild.members.fetch();

        const users = client.users.cache.map(user => user.username);

        const embed = new Discord.MessageEmbed()
            .setTitle('User List')
            .setDescription(users);
        return message.channel.send(embed);
    }
};