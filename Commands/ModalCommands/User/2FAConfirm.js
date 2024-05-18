const config = require("../../../Settings/config");
const { emojis } = config;
const customerSchema = require('../../../Database/Schemas/customerSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");
const { verify2FA, apiTable } = require("../../../Settings/Functions/functions");
const speakeasy = require("speakeasy");

module.exports = {
    customId: "2FAConfirmModal",
    deferReply: false,
    async execute(client, int, embed, values) {

        const auth = values[1];
        const secret = values[2];
        const code = int.fields.getTextInputValue("2fa")

        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: code
        });

        if(!verified) return await int.update({ embeds:[embed.setDescription(`Girilen 2FA kodunuz yanlis.`)], components: [], attachments: [] })

        await customerSchema.findOneAndUpdate({ Auth: auth }, { "TwoFactor.active": true, "TwoFactor.secret": secret });

        return await int.update({ embeds:[embed.setDescription(`
        Merhaba ${int.user} ${emojis.hello}!

        Başarıyla 2FA sistemi aktif edildi.
        `)], components: [], attachments: [] })

    }
}