const config = require("../../../Settings/config");
const { emojis } = config;
const customerSchema = require('../../../Database/Schemas/customerSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");
const { verify2FA, apiTable, cfAddIpWl, cfRemoveIpWl } = require("../../../Settings/Functions/functions");

module.exports = {
    customId: "editAuthModal",
    deferReply: true,
    async execute(client, int, embed, values) {

        const auth = int.fields.getTextInputValue("auth");
        const ip = int.fields.getTextInputValue("ip");

        let authData = await customerSchema.findOne({ Auth: auth })
        let ipData = await customerSchema.findOne({ IP: ip })
        if(!authData) await int.followUp({ embeds:[embed.setDescription(`Girilen Auth geçersiz!`)] })

        if(ip !== "195.206.235.178" && authData.IP === ip || ip !== "195.206.235.178" && ipData) return await int.followUp({ embeds:[embed.setDescription(`Girilen IP zaten kullaniliyor!`)] })

        await cfAddIpWl(ip)
        await cfRemoveIpWl(authData)

        await customerSchema.findOneAndUpdate({ Auth: auth }, { IP: ip })

        return await int.followUp({ embeds:[embed.setDescription(`
        Merhaba ${int.user} ${emojis.hello}!

        **${auth}** Auth kodun yeni IP adresi \`${ip}\` olarak güncellendi!
        `)], ephemeral: true })

    }
}