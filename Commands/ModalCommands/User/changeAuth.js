const config = require("../../../Settings/config");
const { emojis } = config;
const customerSchema = require('../../../Database/Schemas/customerSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");
const { verify2FA, apiTable } = require("../../../Settings/Functions/functions");

module.exports = {
    customId: "changeAuthModal",
    deferReply: true,
    async execute(client, int, embed, values) {

        const auth = values[1];
        const newAuth = int.fields.getTextInputValue("newAuth").toLocaleLowerCase("TR");
        const code = int.fields.getTextInputValue("2fa")

        if(await customerSchema.findOne({ Auth: newAuth })) return await int.followUp({ embeds: [embed.setDescription(`Girilen Auth zaten kullanımda.`)] })

        let authData = await customerSchema.findOne({ Auth: auth })
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

        if(!authData.TwoFactor.active) return await int.followUp({ embeds: [embed.setDescription(`2FA aktif olmayan bir hesapta Auth değiştirme işlemi yapılamaz.`)] })

        if(!await verify2FA(authData, code)) return await int.followUp({ embeds: [embed.setDescription(`Girilen 2FA kodunuz yanlis.`)] })

        authData.Auth = newAuth
        await authData.save()

        return await int.followUp({ embeds:[embed.setDescription(`
        Merhaba ${int.user} 👋🏻!

        Auth'unuz başarıyla değiştirildi, artık yeni Auth'unuz ile giriş yapabilirsiniz.

        Yeni Auth'unuz: \`${newAuth}\`
        `)], ephemeral: true })

    }
}