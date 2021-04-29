const Discord = require('discord.js');
const intents = Discord.Intents;

module.exports = {
    name: "users",
    description: "Lists all users of the server.",
    usage: "",
    usesDB: false,
    async execute(message, args, prefix, client) {
        // This command will get all members including the ones that were not cached
        // For some reason it doesn't work every time the bot restarts probably because of caching... 😑
        await message.guild.members.fetch();

        const users = client.users.cache.map(user => user.username);

        const embed = new Discord.MessageEmbed()
            .setTitle('User List')
            .setDescription(users)
            .addField('hihihi', message.guild.emojis.cache.first());
        return message.channel.send(embed);
    }
};