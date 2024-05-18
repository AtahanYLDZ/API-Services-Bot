const config = require('../../Settings/config');
const { emojis } = config;
const customerSchema = require('../../Database/Schemas/customerSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");

module.exports = {
    customId: "delete",
    deferReply: false,
    async execute(client, int, embed, values) {

        return await int.message.delete();

    }
}