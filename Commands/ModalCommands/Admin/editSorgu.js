const config = require("../../../Settings/config");
const { emojis } = config;
const customerSchema = require('../../../Database/Schemas/customerSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");
const { verify2FA, apiTable } = require("../../../Settings/Functions/functions");

module.exports = {
    customId: "editSorguModal",
    deferReply: true,
    async execute(client, int, embed, values) {

        const auth = int.fields.getTextInputValue("auth");
        const sorgular = int.fields.getTextInputValue("sorgular");
        const sure = int.fields.getTextInputValue("sure");

        if(!Number(sure)) return await int.followUp({ embeds:[embed.setDescription(`Girilen süre geçersiz!`)], ephemeral: true });

        let gun = Number(sure) * (24 * 60 * 60 * 1000)

        let authData = await customerSchema.findOne({ Auth: auth })
        if(!authData) return await int.followUp({ embeds:[embed.setDescription(`Girilen Auth geçersiz!`)], ephemeral: true })

        let sorgularListArray = sorgular.includes(",") ? sorgular.split(",").map(sorgu => sorgu.trim().toUpperCase()) : [sorgular.trim().toUpperCase()]
        if(sorgularListArray.find(x => x === "HEPSI")) sorgularListArray = authData.sorgular.map(x => x.name)

        let sorgularArray = authData.sorgular.filter(sorgu => !sorgularListArray.includes(sorgu.name))
        await Promise.all(sorgularListArray.map(async sorguname => {

            if(!authData.sorgular.find(sorgu => sorgu.name === sorguname)) return

            let sorgu = authData.sorgular.find(sorgu => sorgu.name === sorguname)

            sorgu.endTimestamp = sorgu.endTimestamp + gun

            sorgularArray.push(sorgu)

        }));

        await customerSchema.findOneAndUpdate({ Auth: auth }, { sorgular: sorgularArray })

        return await int.followUp({ embeds:[embed.setDescription(`
        Merhaba ${int.user} ${emojis.hello}!

        **${auth}** Auth kodunun sorgulari güncellendi.
        `)], ephemeral: true })

    }
}