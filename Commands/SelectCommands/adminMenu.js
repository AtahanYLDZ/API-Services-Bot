const config = require("../../Settings/config");
const { emojis } = config;
const customerSchema = require('../../Database/Schemas/customerSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType, AttachmentBuilder } = require("discord.js");
const { verify2FA, apiTable, generate2FA } = require("../../Settings/Functions/functions");

module.exports = {
    customId: "controlPanelMenu",
    deferReply: false,
    async execute(client, int, embed, values) {

        const auth = values[1];
        const islem = int.values[0];

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

        let authInput = new TextInputBuilder()
        .setPlaceholder("Auth giriniz.")
        .setRequired(true)
        .setLabel("Auth")
        .setStyle(TextInputStyle.Short)
        .setCustomId("auth")

        let ipInput = new TextInputBuilder()
        .setPlaceholder("IP giriniz.")
        .setLabel("IP")
        .setRequired(true)
        .setStyle(TextInputStyle.Short)
        .setCustomId("ip")

        let sorgularInput = new TextInputBuilder()
        .setPlaceholder("Sorguları giriniz. (örn: ADSOYAD, ASI, PLAKA)")
        .setLabel("Sorgular")
        .setRequired(true)
        .setStyle(TextInputStyle.Short)
        .setCustomId("sorgular")

        let sureInput = new TextInputBuilder()
        .setPlaceholder("Süreyi giriniz. (örn: 1, 2, -1)")
        .setLabel("Süre")
        .setRequired(true)
        .setStyle(TextInputStyle.Short)
        .setCustomId("sure")

        let authRow = new ActionRowBuilder().addComponents(authInput)
        let ipRow = new ActionRowBuilder().addComponents(ipInput)
        let sorgularRow = new ActionRowBuilder().addComponents(sorgularInput)
        let sureRow = new ActionRowBuilder().addComponents(sureInput)

        switch(islem) {

            case "addAuth":

                const addModal = new ModalBuilder()
                .setTitle("Perla API - Auth Yönetim Sistemi")
                .setCustomId(`addAuthModal-${auth}-${int.user.id}`)
                .setComponents([authRow, ipRow, sorgularRow])

                await int.showModal(addModal);

            break;

            case "removeAuth":

                const removeModal = new ModalBuilder()
                .setTitle("Perla API - Auth Yönetim Sistemi")
                .setCustomId(`removeAuthModal-${auth}-${int.user.id}`)
                .setComponents([authRow])

                await int.showModal(removeModal);

            break;

            case "removeSorgu":

                const removeSorguModal = new ModalBuilder()
                .setTitle("Perla API - Auth Yönetim Sistemi")
                .setCustomId(`removeSorguModal-${auth}-${int.user.id}`)
                .setComponents([authRow, sorgularRow])

                await int.showModal(removeSorguModal);

            break;

            case "addSorgu":

                const addSorguModal = new ModalBuilder()
                .setTitle("Perla API - Auth Yönetim Sistemi")
                .setCustomId(`addSorguModal-${auth}-${int.user.id}`)
                .setComponents([authRow, sorgularRow])

                await int.showModal(addSorguModal);

            break;

            case "editSorgu":

                const editSorguModal = new ModalBuilder()
                .setTitle("Perla API - Auth Yönetim Sistemi")
                .setCustomId(`editSorguModal-${auth}-${int.user.id}`)
                .setComponents([authRow, sorgularRow, sureRow])

                await int.showModal(editSorguModal);

            break;

            case "editAuth":

                const editAuthModal = new ModalBuilder()
                .setTitle("Perla API - Auth Yönetim Sistemi")
                .setCustomId(`editAuthModal-${auth}-${int.user.id}`)
                .setComponents([authRow, ipRow])

                await int.showModal(editAuthModal);

            break;

            case "listAuth":

                const listAuthModal = new ModalBuilder()
                .setTitle("Perla API - Auth Yönetim Sistemi")
                .setCustomId(`listAuthModal-${auth}-${int.user.id}`)
                .setComponents([authRow])

                await int.showModal(listAuthModal);

            break;

            case "authInfo":

                const authInfoModal = new ModalBuilder()
                .setTitle("Perla API - Auth Yönetim Sistemi")
                .setCustomId(`authInfoModal-${auth}-${int.user.id}`)
                .setComponents([authRow])

                await int.showModal(authInfoModal);

            break;

        }

    }
}