const config = require("./Settings/config");
const { Client, Collection, Partials } = require("discord.js");
const glob = require("glob");
const client = global.client = new Client({
    intents: [3276799],
    partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.User],
});
client.login(config.token)
require("./Database/connect");

client.modalCommands = new Collection();
client.selectCommands = new Collection();
client.buttonCommands = new Collection();

const modalFiles = glob.sync(__dirname + "/Commands/ModalCommands/**/*.js");
for (const file of modalFiles) {
    const command = require(`./${file}`);
    client.modalCommands.set(command.customId, command);
}

const selectFiles = glob.sync(__dirname + "/Commands/SelectCommands/*.js");
for (const file of selectFiles) {
    const command = require(`./${file}`);
    client.selectCommands.set(command.customId, command);
}

const buttonFiles = glob.sync(__dirname + "/Commands/ButtonCommands/*.js");
for (const file of buttonFiles) {
    const command = require(`./${file}`);
    client.buttonCommands.set(command.customId, command);
}

const eventFiles = glob.sync(__dirname + "/Events/*.js");
for (const file of eventFiles) {
    const event = require(`./${file}`);
    client.on(event.name, event.execute);
}