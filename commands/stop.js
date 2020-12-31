/**
 * This command should only be used in emergency situations, such as recursive calling
 */
module.exports = {
    name: "stop",
    description: "Terminates the bot!",
    usesDB: "false",
    execute(message, args, prefix, client) {
        client.destroy();
    }
};