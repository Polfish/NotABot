module.exports = {
    name: "help",
    description: "Displays a list of commands.",
    execute(message, args, prefix, client) {
        // TODO: Turn this into embeds possibly with buttons as well
        if (args[0] === undefined) {
            let cmdlist = "";
            client.commands.each(command => cmdlist += command.name + '\n');
            message.channel.send(cmdlist);
        } else {
            message.channel.send(client.commands.get(args[0]).description);
        }
    }
};