const config = require('../../Settings/config');
const { emojis } = config;
const customerSchema = require('../../Database/Schemas/customerSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");

module.exports = {
    customId: "notifOff",
    deferReply: false,
    async execute(client, int, embed, values) {

        const auth = values[1];

        let authData = await customerSchema.findOne({ Auth: auth });
        if(!authData) return await int.message.delete();

        let notifUsers = authData.Notification.UserIDS;
        if(authData.Notification.UserIDS.includes(int.user.id)) await customerSchema.updateOne({ Auth: auth }, { "Notification.UserIDS": notifUsers.filter(x => x !== int.user.id) });

        return await int.message.delete();

    }
}