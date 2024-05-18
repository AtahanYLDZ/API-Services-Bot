const config = require("../../Settings/config");
const { emojis } = config;
const customerSchema = require('../../Database/Schemas/customerSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType, AttachmentBuilder } = require("discord.js");
const { verify2FA, apiTable, generate2FA } = require("../../Settings/Functions/functions");

module.exports = {
    customId: "settingsMenu",
    deferReply: false,
    async execute(client, int, embed, values) {

        const auth = values[1];
        const islem = int.values[0];

        let authData = await customerSchema.findOne({ Auth: auth })
        if(!authData) {

            return await int.followUp({ embeds:[embed.setDescription(`
            Merhaba ${int.user} 👋🏻!
            
            Girilen bilgilerle eşleşen bir __Auth__ kaydı bulunamadı, bilgilerinizi kontrol edin ve tekrar deneyin
            
            Başlıca Hatalar;
            \`1.\` Böyle bir Auth kaydı veritabanında bulunmuyor olabilir.
            \`2.\` Auth bilgisi veya Şifre bilgisi yanlış girilmiş olabilir.
            \`3.\` Yaptığınız bir hatadan dolayı "Auth" kaydınız silinmiş olabilir.
            
            Eğer hata bunlardan biri değil ise lütfen "Geliştirici ekibine" yazmayın, sorunlarınızı sadece yönetim ve üst yönetimdeki kişilere bildirin.
            `)], ephemeral: true })

        }
        
        let row = new ActionRowBuilder().addComponents([
            new ButtonBuilder()
            .setCustomId(`info-${int.user.id}`)
            .setEmoji(emojis.info)
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId(`payment-${auth}-${int.user.id}`)
            .setEmoji(emojis.payment)
            .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
            .setCustomId(`back-${auth}-${int.user.id}`)
            .setEmoji(emojis.back)
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId(`adminPanel-${auth}-${int.user.id}`)
            .setEmoji(emojis.panel)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(!config.adminAuths.includes(auth)),
        ])

        const codeInput = new TextInputBuilder()
        .setPlaceholder("2FA Kodunuzu girin. (Eğer 2FA'nız yoksa boş bırakınız.)")
        .setRequired(authData.TwoFactor.active || false)
        .setLabel("2FA Kodu")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(6)
        .setMinLength(6)
        .setCustomId("2fa")

        const codeRow = new ActionRowBuilder().addComponents(codeInput)

        switch(islem) {

            case "change2FA":

                if(authData.TwoFactor.active) {

                    const passwordInput = new TextInputBuilder()
                    .setPlaceholder("Şifrenizi girin.")
                    .setRequired(true)
                    .setLabel("Şifre")
                    .setStyle(TextInputStyle.Short)
                    .setCustomId("password")

                    const passwordRow = new ActionRowBuilder().addComponents(passwordInput)

                    const modal = new ModalBuilder()
                    .setTitle("Perla API - Auth Yönetim Sistemi")
                    .setCustomId(`change2FAModal-${auth}-${int.user.id}`)
                    .setComponents([passwordRow, codeRow])

                    await int.showModal(modal)

                    await int.deleteReply();

                } else {

                    let qrRow = new ActionRowBuilder().addComponents([
                        new ButtonBuilder()
                        .setCustomId("2FAConfirm")
                        .setStyle(ButtonStyle.Success)
                        .setLabel("2FA Kodunu Gir")
                    ])

                    await int.deferReply({ ephemeral: true });

                    const google2FA = await generate2FA(auth);

                    const qrKod = new AttachmentBuilder(Buffer.from(google2FA.qrCode.replace("data:image/png;base64,", ""), "base64"), { name: "qrCode.jpg" })

                    let msg = await int.followUp({ embeds: [embed.setDescription(`
                    Merhaba ${int.user} 👋🏻!

                    2FA Aktif etmek için aşağıdaki adımları takip edin;
                    \`1.\` Telefonunuza "Google Authenticator" uygulamasını indirin.
                    \`2.\` Uygulamayı açın ve QR Kodunu okutun veya "Kod Ekle" seçeneğini seçin ve aşağıdaki kodu girin.
                    \`3.\` Uygulamada gözüken 6 haneli kodu aşağıdaki butona tıklayarak girin.
                    \`4.\` 2FA Aktif etme işlemi tamamlandı, artık 2FA aktif durumda.

                    **2FA Kodu:** \`${google2FA.secret}\`
                    `).setImage("attachment://qrCode.jpg")], files:[qrKod], components: [qrRow] })

                    const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button })

                    collector.on("collect", async (i) => {

                        if(i.user.id === int.user.id) {

                            if(i.customId === "2FAConfirm") {

                                const codeInput = new TextInputBuilder()
                                .setPlaceholder("2FA Kodunuzu girin.")
                                .setRequired(true)
                                .setLabel("2FA Kodu")
                                .setStyle(TextInputStyle.Short)
                                .setMaxLength(6)
                                .setMinLength(6)
                                .setCustomId("2fa")

                                const codeRow = new ActionRowBuilder().addComponents(codeInput)

                                const modal = new ModalBuilder()
                                .setTitle("Perla API - Auth Yönetim Sistemi")
                                .setCustomId(`2FAConfirmModal-${auth}-${google2FA.secret}-${int.user.id}`)
                                .setComponents([codeRow])

                                await i.showModal(modal)

                            }

                        }

                    })

                }

            break;

            case "changePassword":

                const passwordInput = new TextInputBuilder()
                .setPlaceholder("Şifrenizi girin.")
                .setRequired(true)
                .setLabel("Şifre")
                .setStyle(TextInputStyle.Short)
                .setCustomId("oldPassword")

                const newPasswordInput = new TextInputBuilder()
                .setPlaceholder("Yeni Şifrenizi girin.")
                .setRequired(true)
                .setLabel("Yeni Şifre")
                .setStyle(TextInputStyle.Short)
                .setCustomId("newPassword")

                const passwordRow = new ActionRowBuilder().addComponents(passwordInput)
                const newPasswordRow = new ActionRowBuilder().addComponents(newPasswordInput)

                const modal = new ModalBuilder()
                .setTitle("Perla API - Auth Yönetim Sistemi")
                .setCustomId(`changePwModal-${auth}-${int.user.id}`)
                .setComponents([passwordRow, newPasswordRow, codeRow])

                await int.showModal(modal)

                await int.deleteReply();

            break;

            case "changeAuth":

                const newAuth = new TextInputBuilder()
                .setPlaceholder("Yeni Auth'unuzu girin.")
                .setRequired(true)
                .setLabel("Yeni Auth")
                .setStyle(TextInputStyle.Short)
                .setCustomId("newAuth")

                const newAuthRow = new ActionRowBuilder().addComponents(newAuth)

                const authModal = new ModalBuilder()
                .setTitle("Perla API - Auth Yönetim Sistemi")
                .setCustomId(`changeAuthModal-${auth}-${int.user.id}`)
                .setComponents([newAuthRow, codeRow])

                await int.showModal(authModal)

                await int.deleteReply();

            break;

            case "changeIP":

                const newIP = new TextInputBuilder()
                .setPlaceholder("Yeni IP'nizi girin.")
                .setRequired(true)
                .setLabel("Yeni IP")
                .setStyle(TextInputStyle.Short)
                .setCustomId("newIP")

                const newIPRow = new ActionRowBuilder().addComponents(newIP)

                const IPModal = new ModalBuilder()
                .setTitle("Perla API - Auth Yönetim Sistemi")
                .setCustomId(`changeIPModal-${auth}-${int.user.id}`)
                .setComponents([newIPRow, codeRow])

                await int.showModal(IPModal)

            break;

            case "changeNotification":
            
                if(authData?.Notification && authData.Notification.UserIDS.includes(int.user.id)) {

                    let notifUsers = authData.Notification.UserIDS.filter(x => x !== int.user.id)

                    await customerSchema.updateOne({ Auth: auth }, { "Notification.UserIDS": notifUsers })

                    let SettingsMenu = new StringSelectMenuBuilder()
                    .setCustomId(`settingsMenu-${auth}-${int.user.id}`)
                    .setPlaceholder("Ayarlarınızı görüntülemek için tıklayın.")
                    .addOptions([
                        new StringSelectMenuOptionBuilder()
                        .setLabel("Şifre Değiştir")
                        .setValue(`changePassword`)
                        .setDescription("Buraya tıklayarak şifrenizi değiştirebilirsiniz.")
                        .setEmoji(emojis.password),
                        new StringSelectMenuOptionBuilder()
                        .setLabel(authData.TwoFactor.active ? "2FA Devre Dışı Bırak" : "2FA Aktif Et")
                        .setValue(`change2FA`)
                        .setDescription(authData.TwoFactor.active ? "Buraya tıklayarak 2FA'nızı devre dışı bırakabilirsiniz." : "Buraya tıklayarak 2FA'nızı aktif edebilirsiniz.")
                        .setEmoji(emojis.verify),
                        new StringSelectMenuOptionBuilder()
                        .setLabel("Auth Değiştir")
                        .setValue(`changeAuth`)
                        .setDescription("Buraya tıklayarak Auth'unuzu değiştirebilirsiniz.")
                        .setEmoji(emojis.auth),
                        new StringSelectMenuOptionBuilder()
                        .setLabel("IP Değiştir")
                        .setValue(`changeIP`)
                        .setDescription("Buraya tıklayarak IP'nizi değiştirebilirsiniz.")
                        .setEmoji(emojis.ip),
                        new StringSelectMenuOptionBuilder()
                        .setLabel(`${notifUsers.includes(int.user.id) ? "Bildirimleri Kapat" : "Bildirimleri Aç"}`)
                        .setValue(`changeNotification`)
                        .setDescription(`${notifUsers.includes(int.user.id) ? "Buraya tıklayarak bildirimlerinizi kapatabilirsiniz." : "Buraya tıklayarak bildirimlerinizi açabilirsiniz."}`)
                        .setEmoji(notifUsers.includes(int.user.id) ? emojis.notificationOff : emojis.notificationOn),
                    ])
            
                    let settingsRow = new ActionRowBuilder().addComponents(SettingsMenu);

                    await int.update({ components: [row, settingsRow] })

                } else {

                    let notifUsers = authData?.Notification?.UserIDS || []
                    notifUsers.push(int.user.id)

                    await customerSchema.updateOne({ Auth: auth }, { "Notification.UserIDS": notifUsers })

                    let SettingsMenu = new StringSelectMenuBuilder()
                    .setCustomId(`settingsMenu-${auth}-${int.user.id}`)
                    .setPlaceholder("Ayarlarınızı görüntülemek için tıklayın.")
                    .addOptions([
                        new StringSelectMenuOptionBuilder()
                        .setLabel("Şifre Değiştir")
                        .setValue(`changePassword`)
                        .setDescription("Buraya tıklayarak şifrenizi değiştirebilirsiniz.")
                        .setEmoji(emojis.password),
                        new StringSelectMenuOptionBuilder()
                        .setLabel(authData.TwoFactor.active ? "2FA Devre Dışı Bırak" : "2FA Aktif Et")
                        .setValue(`change2FA`)
                        .setDescription(authData.TwoFactor.active ? "Buraya tıklayarak 2FA'nızı devre dışı bırakabilirsiniz." : "Buraya tıklayarak 2FA'nızı aktif edebilirsiniz.")
                        .setEmoji(emojis.verify),
                        new StringSelectMenuOptionBuilder()
                        .setLabel("Auth Değiştir")
                        .setValue(`changeAuth`)
                        .setDescription("Buraya tıklayarak Auth'unuzu değiştirebilirsiniz.")
                        .setEmoji(emojis.auth),
                        new StringSelectMenuOptionBuilder()
                        .setLabel("IP Değiştir")
                        .setValue(`changeIP`)
                        .setDescription("Buraya tıklayarak IP'nizi değiştirebilirsiniz.")
                        .setEmoji(emojis.ip),
                        new StringSelectMenuOptionBuilder()
                        .setLabel(`${notifUsers.includes(int.user.id) ? "Bildirimleri Kapat" : "Bildirimleri Aç"}`)
                        .setValue(`changeNotification`)
                        .setDescription(`${notifUsers.includes(int.user.id) ? "Buraya tıklayarak bildirimlerinizi kapatabilirsiniz." : "Buraya tıklayarak bildirimlerinizi açabilirsiniz."}`)
                        .setEmoji(notifUsers.includes(int.user.id) ? emojis.notificationOff : emojis.notificationOn),
                    ])
            
                    let settingsRow = new ActionRowBuilder().addComponents(SettingsMenu);

                    await int.update({ components: [row, settingsRow] })

                }

            break;

        }

    }
}