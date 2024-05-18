const config = require("../Settings/config");
const { emojis } = config;
const { ActivityType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const CronJob = require('cron').CronJob;
const customerSchema = require("../Database/Schemas/customerSchema");
const moment = require("moment");
moment.locale("tr");

module.exports = {
    name: "ready",
    async execute(client) {

        console.log(`(*) ${client.user.tag} is ready!`);
        client.user.setPresence({ activities: [{ name: `Perla API - Auth Yönetim Sistemi`, type: ActivityType.Playing }], status: "dnd" })

        let row = new ActionRowBuilder().addComponents([
            new ButtonBuilder()
            .setCustomId("login")
            .setLabel("Giris Yap")
            .setStyle(ButtonStyle.Primary)
        ])

        const dailyCheck = new CronJob("0 0 * * *", async() => {
          
            let data = await customerSchema.find().lean() || null;
            if(!data) return;
          
            await Promise.all(data.map(async (db) => {
          
              if(!db?.sorgular || !db.sorgular.length > 0 || !db?.Notification || !db.Notification.UserIDS.length > 0) return;
          
              await Promise.all(db.sorgular.map(async(sorgu, i) => {
          
                if(!sorgu?.active) return;

                let day = 24 * 60 * 60 * 1000
          
                if(sorgu.endTimestamp - Date.now() <= 3 * day) {
        
                  await Promise.all(db.Notification.UserIDS.map(async(id) => {
        
                    let user = await client.users.fetch(id);
                    if(!user) return;

                    let dailyRow = new ActionRowBuilder().addComponents([
                        new ButtonBuilder()
                        .setCustomId(`delete-${id}`)
                        .setEmoji(emojis.bin)
                        .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                        .setCustomId(`notifOff-${db.Auth}-${id}`)
                        .setEmoji(emojis.notificationOff)
                        .setLabel("Bildirimleri Kapat")
                        .setStyle(ButtonStyle.Secondary),
                    ])

                    let embed = new EmbedBuilder()
                    .setColor('#2b2d31')
                    .setFooter({ text: `Perla Geliştirici Ekibi © 2023 API Services` })
                    .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
                    .setTitle("Perla API - Auth Yönetim Sistemi")
                    
                    await user.send({ embeds: [embed.setDescription(`
                    Merhaba ${user} ${emojis.hello}!

                    Auth: \`${db.Auth}\`
                    \`${sorgu.name}\` Adlı API'nin süresi <t:${Math.floor(sorgu.endTimestamp / 1000)}:R> sonra bitecek. 
                    Eğer süresini uzatmak istiyorsanız ticket açarak yetkililerimiz ile iletişime geçebilirsiniz.
                    `)], components: [dailyRow] }).catch(() => {});
        
                  }))
          
                }
          
              }));
          
            }));
          
        }, null, true, "Europe/Istanbul")
        dailyCheck.start()

        //client.channels.cache.get("1118628778898358424").send({ embeds: [new EmbedBuilder().setTitle("Giris Yap").setDescription("Alttaki butona tiklayarak yönetim paneline giris yapabilrisin.")], components: [row] })

    }
}