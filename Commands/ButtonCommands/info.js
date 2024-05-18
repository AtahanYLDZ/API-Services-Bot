const config = require('../../Settings/config');
const { emojis } = config;
const customerSchema = require('../../Database/Schemas/customerSchema');
const APIList = require('../../Settings/apiList.json');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");
const { apiTable, toplamAylikKazanç } = require('../../Settings/Functions/functions');

module.exports = {
    customId: "info",
    deferReply: false,
    async execute(client, int, embed, values) {

        await int.update({ embeds: [embed.setDescription(`
        Merhaba ${int.user} ${emojis.hello}!

        \`Hakkımızda:\` Perla Ekibi olarak ilk baştaki amaçımız siz değerli kullanıcılarımıza hiç bir sistemin güvenilir olmadığını göstermek niyetiyle bu serüvenimize başladık.
        Temeli \`2020\` yılına dayanan "Perla" şuanda siz değerli kullanıcılarımıza piyasadaki en iyi hizmeti sunmak için çaba gösteriyor. 
        API'lerimizi siz değerli kullanıcılara uygun fiyata veriyor ve her zaman destek gösteriyoruz.
        
        \`S.S.S\`
        \`?\` Perla API'lerini nereden alabilirim?
        \`!\` Perla API'lerini sadece [Discord](https://discord.gg/perlaservis) ve [Telegram](https://t.me/hosterdrake) üzerinden alabilirsiniz.

        \`?\` Perla API'lerini bedava kullanabilirmiyiz?
        \`!\` Perla API'lerini kullanıcı güvenliği nedeniyle sadece satın alarak kullanabilirsiniz.

        \`?\` Perla Ekibine nasıl katılabilirim?
        \`!\` Perla Ekibine girişlerimiz yoktur, ekip üyesi almak istersek [Discord](https://discord.gg/perlaservis) ve [Telegram](https://t.me/hosterdrake) üzerinden siz değerli kullanıcılarımıza haber veririz.

        \`Toplam Kullanıcı Sayısı:\` ${await customerSchema.countDocuments()}
        \`Toplam API Sayısı:\` ${APIList.length}
        \`Toplam Aylık Kazanç:\` ${await toplamAylikKazanç()}

        \`Geliştirici Ekibimiz;\`
        Discord: \`Atahan#8888\`
        Mail: \`Bulunmamakta.\`

        Discord: \`❈ Rowy ∞#1468\`
        Mail: \`Bulunmamakta.\`

        \`İletişim Bilgilerimiz;\`
        Discord: \`Hoster#1000\` **|** \`Atahan#8888\`
        Mail: \`Bulunmamakta.\`
        Web: https://perlaservis.net/
        `)] }).catch(() => {})

    }
}