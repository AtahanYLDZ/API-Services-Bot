const config = require("../../../Settings/config");
const { emojis } = config;
const customerSchema = require('../../../Database/Schemas/customerSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");
const { verify2FA, apiTable } = require("../../../Settings/Functions/functions");

module.exports = {
    customId: "changePwModal",
    deferReply: true,
    async execute(client, int, embed, values) {

        const auth = values[1];
        const oldPassword = int.fields.getTextInputValue("oldPassword")
        const newPassword = int.fields.getTextInputValue("newPassword")
        const code = int.fields.getTextInputValue("2fa")

        let authData = await customerSchema.findOne({ Auth: auth, Password: oldPassword })
        if(!authData) {

            return await int.followUp({ embeds:[embed.setDescription(`
            Merhaba ${int.user} ${emojis.hello}!

            Girilen bilgilerle eşleşen bir __Auth__ kaydı bulunamadı, bilgilerinizi kontrol edin ve tekrar deneyin

            Başlıca Hatalar;
            \`1.\` Böyle bir Auth kaydı veritabanında bulunmuyor olabilir.
            \`2.\` Auth bilgisi veya Şifre bilgisi yanlış girilmiş olabilir.
            \`3.\` Yaptığınız bir hatadan dolayı "Auth" kaydınız silinmiş olabilir.

            Eğer hata bunlardan biri değil ise lütfen "Geliştirici ekibine" yazmayın, sorunlarınızı sadece yönetim ve üst yönetimdeki kişilere bildirin.
            `)], ephemeral: true })

        }

        if(authData.TwoFactor.active === true && !await verify2FA(authData, code)) return await int.followUp({ embeds: [embed.setDescription(`Girilen 2FA kodunuz yanlis.`)] })

        authData.Password = newPassword
        await authData.save()

        return await int.followUp({ embeds:[embed.setDescription(`
        Merhaba ${int.user} ${emojis.hello}!

        Şifreniz başarıyla değiştirildi, artık yeni şifreniz ile giriş yapabilirsiniz.

        Yeni şifreniz: \`${newPassword}\`
        `)], ephemeral: true })

    }
}