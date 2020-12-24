const fsp = require('fs').promises;

module.exports = {
    name: "setprefix",
    description: "Sets the prefix for the bot.",
    async execute(message, args) {
        try {
            if (args[1] === undefined) {
                return message.channel.send('No arguments!')
            }
            
            let data = await fsp.readFile('auth.json');
            let auth = JSON.parse(data);

            message.channel.send(`Old prefix is: ${auth.prefix}`);
            // set whatever property or properties in the object that you are trying to change
            auth.prefix = args[0];
            message.channel.send(`New prefix is: ${auth.prefix}`);

            await fsp.writeFile('auth.json', JSON.stringify(auth));
        } catch (e) {
            // error handling here
            console.log(e);
            message.channel.send('Error sending message!');
            throw e;      // make sure caller can see the message
        }
    }
};