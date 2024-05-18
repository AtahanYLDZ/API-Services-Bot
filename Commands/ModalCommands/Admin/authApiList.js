const config = require("../../../Settings/config");
const { emojis } = config;
const customerSchema = require('../../../Database/Schemas/customerSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");
const { verify2FA, apiTable } = require("../../../Settings/Functions/functions");

module.exports = {
    customId: "listAuthModal",
    deferReply: false,
    async execute(client, int, embed, values) {

        const auth = int.fields.getTextInputValue("auth");

        let authData = await customerSchema.findOne({ Auth: auth })
        if(!authData) await int.update({ embeds:[embed.setDescription(`Girilen Auth geçersiz!`)] })

        const tableContent = await apiTable(authData)
                    
        await int.update({
            embeds: [embed.setThumbnail(null).setDescription(`${codeBlock("css", tableContent)}`)]
        }).catch(() => {})

    }
}