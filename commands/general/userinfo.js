const Discord = require('discord.js');
const User = require('../../schema/user');

module.exports = {
    name: "userinfo",
    description: "Displays information for a user.",
    usage: "",
    usesDB: true,
    async execute(message, args, prefix, client) {
        // Try finding the user first before checking the database
        const fetchedUser = !args[0] ? await client.users.fetch(message.author.id) : await client.users.fetch(args[0]);

        if (!fetchedUser) {
            return message.channel.reply(`User not found! Try \`${prefix}users\``);
        }

        // Finding user in database
        let user = !args[0] ? await User.findOne({ id: message.author.id }) : await User.findOne({ id: args[0] });

        // Getting guildMember version of user
        const guildMember = !args[0] ? await message.member : await message.guild.members.fetch(fetchedUser.id);

        // Getting roles of the user
        const roles = guildMember.roles.cache.map(role => role.name);

        const type = guildMember.user.bot ? "Bot" : "Human";

        // Add user to database if not found
        if (!user) {
            const newUser = new User({
                name: fetchedUser.username,
                type: type,
                id: fetchedUser.id,
                registeredAt: guildMember.joinedAt
            })

            await newUser.save().catch(err => console.log(err));
            user = newUser;
        }

        // An embed CANNOT ping a user!
        const embed = new Discord.MessageEmbed()
            .setAuthor(fetchedUser.tag, fetchedUser.displayAvatarURL())
            .setThumbnail(fetchedUser.displayAvatarURL())
            .addFields(
                { name: 'User', value: `${user.name} [${user.id}]`},
                { name: 'Type', value: user.type},
                { name: 'Created At', value: fetchedUser.createdAt},
                { name: 'Joined At', value: guildMember.joinedAt},
                { name: 'Roles', value: roles},
            );

        return message.channel.send(embed);
    }
}