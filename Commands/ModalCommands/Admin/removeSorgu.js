const config = require("../../../Settings/config");
const { emojis } = config;
const customerSchema = require('../../../Database/Schemas/customerSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");
const { verify2FA, apiTable } = require("../../../Settings/Functions/functions");
const APIList = require("../../../Settings/apiList.json");

module.exports = {
    customId: "removeSorguModal",
    deferReply: true,
    async execute(client, int, embed, values) {

        const auth = int.fields.getTextInputValue("auth");
        const sorgular = int.fields.getTextInputValue("sorgular");

        let authData = await customerSchema.findOne({ Auth: auth })
        if(!authData) return await int.followUp({ embeds:[embed.setDescription(`Girilen Auth geçersiz!`)], ephemeral: true })

        let sorgularListArray = sorgular.includes(",") ? sorgular.split(",").map(sorgu => sorgu.trim().toUpperCase()) : [sorgular.trim().toUpperCase()]
        if(sorgularListArray.find(x => x === "HEPSI")) sorgularListArray = APIList.map(x => x.value)

        let sorgularArray = authData.sorgular.filter(sorgu => !sorgularListArray.includes(sorgu.name))

        await customerSchema.findOneAndUpdate({ Auth: auth }, { sorgular: sorgularArray })

        return await int.followUp({ embeds:[embed.setDescription(`
        Merhaba ${int.user} ${emojis.hello}!

        **${auth}** Auth kodunun **${sorgularListArray.join(", ")}** API'leri silindi.
        `)], ephemeral: true })

    }
}