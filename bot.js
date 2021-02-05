const Discord = require('discord.js');
const logger = require('winston');
const fs = require('fs');
const { token, prefix } = require('./auth.json');
let { mongoPass } = require('./auth.json');
const mongoose = require('mongoose');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
const client = new Discord.Client();

client.on('ready', () => {
    // Showing whether bot has logged in
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(client.username + ' - (' + client.id + ')');

    // Setting presence of bot
    client.user.setPresence({
        activity: {
            name: 'humans complaining!',
            type: 'LISTENING'
        },
        status: 'online'
    });

    // Playing with the new slash commands
    client.api.applications(client.user.id).guilds('370795842191360012').commands.post({
        data: {
            name: 'self',
            description: 'Get yourself!'
        }
    })

    client.ws.on('INTERACTION_CREATE', async interaction => {
        const command = interaction.data.name;
        if (command.toLowerCase() === 'self') {
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: interaction.member.user.username
                    }
                }
            })
        }
    })
});

client.login(token);

// Loading command files
client.commands = new Discord.Collection;
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); // Should this be async??? Not sure the performance benefit...

logger.info('Loading commands...');

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

logger.info('Complete!');

// Executing commands
client.on('message', async (message) => {
    // TODO: Turn this into an async function!

    // If a message does not start with the prefix or the author of the message was the bot, then don't execute any commands and
    // just return
    if (!message.content.startsWith(prefix) || message.author.bot) {
        return;
    }

    // Turning the message into an array
    const argsBefore = message.content.slice(prefix.length).trim();
    // The array has to be explicitly created so that the when shift() is called it deletes the command from the array
    // and when called later it will return empty if no arguments were given
    let args = argsBefore.split(/ +/);

    // Take the first entry after the prefix, which should be the command
    const command = args.shift().toLowerCase();

    // Don't need it anymore, but if I do here it is
    // // Check if the argument contains single or double quotes. If need be add two extra statements to check
    // // whether there are quotes at the end of the arguemnts
    // if (args[0] && (args[0].indexOf('\'') == 0 || args[0].indexOf('"') == 0)) {
    //     // If they do, then find the value inside of the quotes and take out the quotes
    //     // https://stackoverflow.com/questions/171480/regex-grabbing-values-between-quotation-marks
    //     args = argsBefore.match(/(["'])(?:(?=(\\?))\2.)*?\1/gm);
    //     args[0] = args[0].replace(/['"]+/g, '');
    // }

    if (!client.commands.has(command)) {
        return message.reply(`Command not found! Try \`${prefix}help\` to find the right command.`);
    }

    const usesDB = client.commands.get(command).usesDB;
    if (usesDB) {
        const guildName = client.guilds.cache.filter(guild => message.guild.id === guild.id).map(guild => guild.name);
        // Creates a new database for each new server
        mongoPass = mongoPass.replace('<dbname>', guildName).replace(' ', '_');

        logger.info(`Logging into MongoDB dbname: ${guildName}`);

        mongoose.connect(mongoPass, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        logger.info('Complete!');
    }

    try {
        await client.commands.get(command).execute(message, args, prefix, client);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }

    // Disconnect to save database usage
    if (usesDB) {
        mongoose.disconnect();
    }
});