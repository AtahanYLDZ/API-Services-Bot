const config = require("../Settings/config");
const { emojis } = config;
const customerSchema = require("../Database/Schemas/customerSchema");
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");
const { executeModal, executeButton } = require("../Settings/Functions/executor");
const { apiTable, toplamAylikKazanç } = require("../Settings/Functions/functions");
const APIList = require("../Settings/apiList.json");

module.exports = {
    name: "interactionCreate",
    async execute(int) {

        if(!int.isButton()) return;

        let embed = new EmbedBuilder()
        .setColor('#2b2d31')
        .setFooter({ text: `Perla Geliştirici Ekibi © 2023 API Services` })
        .setThumbnail(int.user.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setTitle("Perla API - Auth Yönetim Sistemi")

        if(int.customId == `login`) {

            const authInput = new TextInputBuilder()
            .setCustomId("auth")
            .setLabel("Auth")
            .setPlaceholder("Auth'unuzu giriniz.")
            .setRequired(true)
            .setStyle(TextInputStyle.Short)

            const passwordInput = new TextInputBuilder()
            .setCustomId("password")
            .setLabel("Şifre")
            .setPlaceholder("Şifre'nizi giriniz.")
            .setRequired(true)
            .setStyle(TextInputStyle.Short)

            const codeInput = new TextInputBuilder()
            .setCustomId("2fa")
            .setLabel("2FA Kodu")
            .setPlaceholder("2FA Kodunuzu giriniz. (Eğer 2FA'nız yoksa boş bırakınız.)")
            .setRequired(false)
            .setStyle(TextInputStyle.Short)
            .setMaxLength(6)

            const authRow = new ActionRowBuilder().addComponents(authInput);
            const passwordRow = new ActionRowBuilder().addComponents(passwordInput);
            const codeRow = new ActionRowBuilder().addComponents(codeInput);

            const modal = new ModalBuilder()
            .setCustomId(`loginModal-${int.user.id}`)
            .setTitle("Perla API - Auth Yönetim Sistemi")
            .setComponents([authRow, passwordRow, codeRow]);

            await int.showModal(modal).catch(() => {});

        } else {
            await executeButton(int, embed);
        }

    }
}