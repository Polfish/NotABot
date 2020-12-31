const Discord = require('discord.js');

module.exports = {
    name: "help",
    description: "Displays a list of commands.",
    usesDB: "false",
    execute(message, args, prefix, client) {
        if (!args[0]) {
            const embed = new Discord.MessageEmbed()
            .setAuthor('NotABot Help List', client.user.displayAvatarURL());

            let cmdlist = '';
            // If I don't put that \n first then the first command doesn't show up (ㆆ_ㆆ)
            client.commands.filter(command => command.name !== 'help').each(command => cmdlist += '\n' + command.name);

            // Could also do: ` \`\`\`\n${cmdlist}\`\`\` `
            embed.addField(`Do \`${prefix}help <command>\` to know more about the command!`, "```" + cmdlist + "```");

            return message.channel.send(embed);
        } else {
            if (!client.commands.has(args[0])) {
                return message.reply(`Command not found! Try \`${prefix}help\` to find the right command.`);
            }

            const command = client.commands.get(args[0]);

            const embed = new Discord.MessageEmbed()
            .setTitle(command.name.charAt(0).toUpperCase() + command.name.slice(1))
            .setDescription(command.description)
            .addFields(
                { name: 'Usage', value: `${prefix}${command.name}` },
                { name: 'Uses the database', value:` ${command.usesDB}` },
                );

            return message.channel.send(embed);
        }
    }
};