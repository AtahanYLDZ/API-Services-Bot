const config = require("../../../Settings/config");
const { emojis } = config;
const customerSchema = require('../../../Database/Schemas/customerSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType, WebhookClient } = require("discord.js");

module.exports = {
    customId: "returnModal",
    deferReply: true,
    async execute(client, int, embed, values) {

        const auth = values[1];
        const apiName = values[2];
        const sebep = int.fields.getTextInputValue("returnReason");
        const banka = int.fields.getTextInputValue("returnBank");

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

        let apiData = authData.sorgular.find(x => x.name == apiName)
        if(!apiData) return await int.followUp({ embeds: [embed.setDescription(`Girilen API ismi ile eşleşen bir API kaydı bulunamadı.`)] })

        await new WebhookClient({ url: config.webhookURL }).send({ embeds: [embed.setDescription(`
        Yeni bir iade talebi oluşturuldu.

        Talep Sahibi: ${int.user} (\`${int.user.id}\`)
        Talep Sahibinin Auth'u: \`${auth}\`
        Talep Sahibinin API'si: \`${apiName}\`
        Talep Sahibinin Papara Hesabı: \`${banka}\`

        Iade Sebebi;
        ${codeBlock(sebep)}
        `).setThumbnail(null)] })

        return await int.followUp({ embeds:[embed.setDescription(`
        Merhaba ${int.user} 👋🏻!

        \`${apiName}\` adlı API'nin iade talebi başarıyla oluşturuldu, talebiniz en kısa sürede incelenecektir.
        `)], ephemeral: true })

    }
}