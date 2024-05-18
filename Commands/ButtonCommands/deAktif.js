const config = require('../../Settings/config');
const { emojis } = config;
const customerSchema = require('../../Database/Schemas/customerSchema');
const APIList = require('../../Settings/apiList.json');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");
const { apiTable, toplamAylikKazanç } = require('../../Settings/Functions/functions');

module.exports = {
    customId: "deAktifEt",
    deferReply: false,
    async execute(client, int, embed, values) {

        const auth = values[1];
        const api = values[2];

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
        let apiIndex = authData.sorgular.findIndex((sorgu) => sorgu.name === api);

        let row = new ActionRowBuilder().addComponents([
            new ButtonBuilder()
            .setCustomId(`iade-${auth}-${api}o-${int.user.id}`)
            .setEmoji(emojis.iade)
            .setStyle(ButtonStyle.Danger)
            .setDisabled(Date.now() - apiData.startTimestamp > 3 * 86400000),
            new ButtonBuilder()
            .setCustomId(`aktifEt-${auth}-${api}-${int.user.id}`)
            .setEmoji(emojis.yes)
            .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
            .setCustomId(`back-${auth}-${int.user.id}`)
            .setEmoji(emojis.back)
            .setStyle(ButtonStyle.Primary)
        ])

        apiData.active = false;
        apiData.returnTimestamp = Date.now();

        authData.sorgular[apiIndex] = apiData;

        await authData.save();

        await int.update({ embeds:[embed.setDescription(`
        Merhaba ${int.user} ${emojis.hello}!
        
        \`${apiData.name}\` API'niz <t:${Math.floor(Date.now() / 1000)}> tarihi itibariyle kullanıma kapalı duruma getirilmiştir.`)], components: [row], ephemeral: true })

    }
}