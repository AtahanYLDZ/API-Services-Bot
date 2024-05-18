const config = require("../../../Settings/config");
const { emojis } = config;
const customerSchema = require('../../../Database/Schemas/customerSchema');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");
const { verify2FA, apiTable, cfAddIpWl } = require("../../../Settings/Functions/functions");
const APIList = require("../../../Settings/apiList.json");

module.exports = {
    customId: "addAuthModal",
    deferReply: true,
    async execute(client, int, embed, values) {

        const auth = int.fields.getTextInputValue("auth");
        const ip = int.fields.getTextInputValue("ip");
        const sorgular = int.fields.getTextInputValue("sorgular");

        let authData = await customerSchema.findOne({ Auth: auth })
        let ipData = await customerSchema.findOne({ IP: ip })
        if(ip !== "195.206.235.178" && authData || ip !== "195.206.235.178" && ipData) return await int.followUp({ embeds:[embed.setDescription(`Girilen Auth veya IP zaten kullaniliyor!`)], ephemeral: true })

        let sorgularListArray = sorgular.split(",").map(sorgu => sorgu.trim().toUpperCase())
        if(sorgularListArray.find(x => x === "HEPSI")) sorgularListArray = APIList.map(x => x.value)
        sorgularListArray = sorgularListArray.filter(x => APIList.some(s => s.value === x))

        let ay = (30 * 24 * 60 * 60 * 1000)

        const sorgularArray = sorgularListArray.map(sorguname => {
            
            let sorgu = {};

            sorgu.name = sorguname;
            sorgu.active = true;
            sorgu.startTimestamp = Date.now();
            sorgu.endTimestamp = Date.now() + ay;
            sorgu.totalLimit = 1000;
            sorgu.usedLimit = 0;

            return sorgu;

        })

        let yeniData = await customerSchema.create({ Auth: auth, IP: ip, sorgular: sorgularArray })
        await cfAddIpWl(ip);

        return await int.followUp({ embeds:[embed.setDescription(`
        Merhaba ${int.user} ${emojis.hello}!

        **${auth}** Auth kodu olusturuldu;

        **Geçici Şifre:** \`${yeniData.Password}\`
        `)], ephemeral: true })

    }
}