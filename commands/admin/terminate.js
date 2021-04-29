/**
 * This command should only be used in emergency situations, such as recursive calling
 */
module.exports = {
    name: "terminate",
    description: "Terminates the bot!",
    usage: "",
    usesDB: false,
    execute(message, args, prefix, client) {
        client.destroy();
    }
};