const config = require("../../../Settings/config");
const { emojis } = config;
const customerSchema = require('../../../Database/Schemas/customerSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");
const { verify2FA, apiTable, cfRemoveIpWl } = require("../../../Settings/Functions/functions");

module.exports = {
    customId: "removeAuthModal",
    deferReply: true,
    async execute(client, int, embed, values) {

        const auth = int.fields.getTextInputValue("auth");

        let authData = await customerSchema.findOne({ Auth: auth })
        if(!authData) return await int.followUp({ embeds:[embed.setDescription(`Girilen Auth geçersiz!`)], ephemeral: true })

        await customerSchema.findOneAndDelete({ Auth: auth })
        await cfRemoveIpWl(authData.IP);

        return await int.followUp({ embeds:[embed.setDescription(`
        Merhaba ${int.user} ${emojis.hello}!

        **${auth}** Auth kodu silindi.
        `)], ephemeral: true })

    }
}