const config = require("../Settings/config");
const { emojis } = config;
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");
const { executeModal, executeSelectMenu } = require("../Settings/Functions/executor");

module.exports = {
    name: "interactionCreate",
    async execute(int) {

        if(!int.isModalSubmit()) return;

        let embed = new EmbedBuilder()
        .setColor('#2b2d31')
        .setFooter({ text: `Perla Geliştirici Ekibi © 2023 API Services` })
        .setThumbnail(int.user.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setTitle("Perla API - Auth Yönetim Sistemi")

        await executeModal(int, embed);

    }
}