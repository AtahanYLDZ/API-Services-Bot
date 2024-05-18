const config = require("../../Settings/config");
const { emojis } = config;
const customerSchema = require('../../Database/Schemas/customerSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");
const { verify2FA, apiTable } = require("../../Settings/Functions/functions");

module.exports = {
    customId: "aktifApiler",
    deferReply: false,
    async execute(client, int, embed, values) {

        const auth = values[1];
        const api = int.values[0];

        let authData = await customerSchema.findOne({ Auth: auth })
        if(!authData) {

            return await int.update({ embeds:[embed.setDescription(`
            Merhaba ${int.user} ${emojis.hello}!
            
            Girilen bilgilerle eşleşen bir __Auth__ kaydı bulunamadı, bilgilerinizi kontrol edin ve tekrar deneyin
            
            Başlıca Hatalar;
            \`1.\` Böyle bir Auth kaydı veritabanında bulunmuyor olabilir.
            \`2.\` Auth bilgisi veya Şifre bilgisi yanlış girilmiş olabilir.
            \`3.\` Yaptığınız bir hatadan dolayı "Auth" kaydınız silinmiş olabilir.
            
            Eğer hata bunlardan biri değil ise lütfen "Geliştirici ekibine" yazmayın, sorunlarınızı sadece yönetim ve üst yönetimdeki kişilere bildirin.
            `)], components: [], ephemeral: true })

        }

        let apiData = authData.sorgular.find((sorgu) => sorgu.name === api)

        let row = new ActionRowBuilder().addComponents([
            new ButtonBuilder()
            .setCustomId(`iade-${int.user.id}`)
            .setEmoji(emojis.iade)
            .setStyle(ButtonStyle.Danger)
            .setDisabled(Date.now() - apiData.startTimestamp > 3 * 86400000),
            new ButtonBuilder()
            .setCustomId(`${apiData.active === true ? "deAktifEt" : "aktifEt"}-${auth}-${api}-${int.user.id}`)
            .setEmoji(apiData.active === true ? emojis.no : emojis.yes)
            .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
            .setCustomId(`back-${auth}-${int.user.id}`)
            .setEmoji(emojis.back)
            .setStyle(ButtonStyle.Primary)
        ])

        let msg = await int.update({ embeds: [embed.setDescription(`
        Merhaba ${int.user} ${emojis.hello}!

        \`${apiData.name}\` API'sinin kontrol sistemini görüntülüyorsunuz. Aşağıdaki butonlar aracılığıyla \`3 günü\` geçmeyen API'nizi iade yapabilir veya API'nizi kapatıp açabilirsiniz.

        \`${emojis.question}\` Eğer API'niz 3 günü geçtiyse iade butonu \`otomatik\` olarak kapalı halde görünücektir.
        ${apiData.active === true ? `\`${emojis.no}\` Emojisine tıklıyarak API'nizi kapalı duruma getirebilirsiniz.` : `\`${emojis.yes}\` Emojisi ile API'nizi aktif duruma getirebilirsiniz.`}
        `)], components: [row], ephemeral: true })

        const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button });

        collector.on("collect", async(i) => {

                if(i.customId === `iade-${i.user.id}`) {

                    const returnReason = new TextInputBuilder()
                    .setCustomId("returnReason")
                    .setLabel("İade Sebebi")
                    .setPlaceholder("İade sebebinizi girin.")
                    .setMinLength(1)
                    .setMaxLength(1024)
                    .setRequired(true)
                    .setStyle(TextInputStyle.Paragraph)

                    const returnBank = new TextInputBuilder()
                    .setCustomId("returnBank")
                    .setLabel("Papara İban")
                    .setPlaceholder("İade sağlanacak olan papara iban girn.")
                    .setMinLength(1)
                    .setMaxLength(64)
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)

                    const returnReasonRow = new ActionRowBuilder().addComponents([returnReason])
                    const returnBankRow = new ActionRowBuilder().addComponents([returnBank])

                    const returnModal = new ModalBuilder()
                    .setCustomId(`returnModal-${auth}-${apiData.name}-${i.user.id}`)
                    .setTitle("İade Talebi")
                    .setComponents([returnReasonRow, returnBankRow])

                    await i.showModal(returnModal)
                    
                }

        })

    }
}