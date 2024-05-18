const config = require("../../../Settings/config");
const { emojis } = config;
const customerSchema = require('../../../Database/Schemas/customerSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");
const { verify2FA, apiTable } = require("../../../Settings/Functions/functions");

module.exports = {
    customId: "authInfoModal",
    deferReply: false,
    async execute(client, int, embed, values) {

        const auth = int.fields.getTextInputValue("auth");

        let authData = await customerSchema.findOne({ Auth: auth })
        if(!authData) return await int.update({ embeds:[embed.setDescription(`Girilen Auth kodu bulunamadı!`)], ephemeral: true })

        await int.update({ embeds:[embed.setDescription(`
        Merhaba ${int.user} ${emojis.hello}!

        **${auth}** Auth kodu bilgileri;

        **IP:** \`${authData.IP}\`
        **Şifre:** \`${authData.Password}\`
        **API Sayısı:** \`${authData.sorgular.length}\`
        **2FA:** \`${authData.TwoFactor.active ? "Aktif" : "Deaktif"}\`
        `)], ephemeral: true }).catch(() => {})

    }
}