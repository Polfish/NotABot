const fsp = require('fs').promises;

module.exports = {
    name: "setprefix",
    description: "Sets the prefix for the bot.",
    async execute(message, args) {
        try {
            // If no arguments are given then don't continue
            if (args[0] === undefined) {
                return message.reply('No arguments!');
            }
            
            let data = await fsp.readFile('auth.json');
            let auth = JSON.parse(data);

            // Changing the prefix
            await message.channel.send(`Old prefix is: ${auth.prefix}`);
            auth.prefix = args[0];
            await message.channel.send(`New prefix is: ${auth.prefix}`);

            await fsp.writeFile('auth.json', JSON.stringify(auth));
        } catch (e) {
            console.log(e);
            message.channel.send('Error sending message!');
            throw e;
        }
    }
};