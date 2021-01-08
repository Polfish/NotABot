const Discord = require('discord.js');
const Reaction = require('../schema/reaction');

module.exports = {
  name: "react",
  description: `Reacts to a trigger created by a user. No arguments gives the list of reactions, 
  one give one argument to trigger the reaction, and give two arguments to add/edit a reaction.
  If you have a trigger that is more than one word than separate the trigger and the reaction with \'|\'. Ex: hello boi|wat`,
  usage: "<prefix>react <trigger> <reaction>",
  usesDB: true,
  async execute(message, args) {
    const containsLine = message.content.includes("|");
    if (args[0] && args[1] || containsLine) {
      let trigger = "";
      let reaction = "";
      let newArgs = [];
      let fetchedReaction;
      if (containsLine) {
        newArgs = args.join(" ").split("|");
        trigger = newArgs[0];
        reaction = newArgs[1];
        fetchedReaction = await Reaction.findOne({ trigger: newArgs[0] });
      } else {
        trigger = args[0];
        reaction = args.slice(1).join(" ");
        fetchedReaction = await Reaction.findOne({ trigger: args[0] });
      }

      // Add reaction to database if not found
      if (!fetchedReaction) {
        const newReaction = new Reaction({
          trigger: trigger,
          reaction: reaction,
          id: 0,
          createdAt: Date.now()
        })

        await newReaction.save().catch(err => console.log(err));
        fetchedReaction = newReaction;

        const embed = new Discord.MessageEmbed()
          .setTitle('New Reaction Added!')
          .addFields(
            { name: 'Trigger', value: fetchedReaction.trigger, inline: false },
            { name: 'Reaction', value: fetchedReaction.reaction, inline: false },
            { name: 'ID', value: fetchedReaction.id, inline: false },
            { name: 'Created At', value: fetchedReaction.createdAt, inline: false },
          );

        return message.channel.send(embed);
      }

      fetchedReaction.reaction = reaction;
      fetchedReaction.save().catch(err => console.log(err));

      return message.channel.send('Reaction edited!');
    } else if (args[0]) {
      // Finding reaction in database
      const fetchedReaction = await Reaction.findOne({ trigger: args[0] });
      message.channel.send(fetchedReaction.reaction);
    } else {
      // TODO
    }
  }
};