const config = require('../../Settings/config');
const { emojis } = config;
const customerSchema = require('../../Database/Schemas/customerSchema');
const APIList = require('../../Settings/apiList.json');
const { codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require("discord.js");
const { apiTable, toplamAylikKazanç } = require('../../Settings/Functions/functions');

module.exports = {
    customId: "back",
    deferReply: false,
    async execute(client, int, embed, values) {

        const auth = values[1];

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

        let sorgular = authData.sorgular.slice(0, 25)

        let SelectMenu = new StringSelectMenuBuilder()
        .setCustomId(`aktifApiler-${auth}-${int.user.id}`)
        .setPlaceholder("Mevcut API'lerinizi görüntülemek için tıklayın.")
        .addOptions(sorgular.map((sorgu) => new StringSelectMenuOptionBuilder().setLabel(`${sorgu.name} API'si`).setValue(sorgu.name).setDescription(`Buraya tıklayarak ${sorgu.name} API'sini yönetebilirsiniz.`).setEmoji(emojis.api)))

        let selectRow = new ActionRowBuilder().addComponents(SelectMenu)
        
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
            .setCustomId(`settings-${auth}-${int.user.id}`)
            .setEmoji(emojis.settings)
            .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
            .setCustomId(`adminPanel-${auth}-${int.user.id}`)
            .setEmoji(emojis.panel)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(!config.adminAuths.includes(auth)),
        ])
        
        await int.update({ ephemeral: true, embeds: [embed.setDescription(`
        Merhaba ${int.user} ${emojis.hello}!
        
        Bu bot üzerinden **Bizlerden** almış olduğunuz **__Auth__** sisteminizi özelleştirebilirsiniz, bunun hariçinde kendi kullanıcı bilgilerinizide değiştirme imkanı sağlamış oluyoruz siz değerli kullanıcılarımıza.
        
        İade Politakası: **3 Gün** ve üzeri kullandığınız API'ler için herhangi bir geri ödeme talep edemezsiniz, 3 gün ve altında kullandıysanız bize gerekli bir açıklama yapmak __zorundasınız__.
        Not: İadeler **5 İş Günü** içerişinde yapılıyor, ısrar etmeyin ve diğer kullanıcılar gibi sabır ile bekleyin. (Israr halinde Perla İade Koşullarına Aykırı Hareketten dolayı ödemeyi reddetme hakkına sahiptir. 🙂 )

        Gizlilik Politakası: Perla API Servis Sağlayıcısı olarak gizliliğinize önem verip hiç bir bilginizi üçüncü parti yazılım ve "aynasızlara" vermiyoruz çünkü unutma biz bir aileyiz 🙂
        Not: Sizde bize karşı aynı şekilde davranırsanız seviniriz, aksi takdirde "Perla API Servis Sağlayıcısı" olarak sizinle ilişkimizi kesmek zorunda kalırız.
        
        Sorumluluk Reddi: Perla API Servis Sağlayıcısı olarak ünlü oyunlarını yapmanızı önermiyor ve tavsiye etmiyoruz, yapmanız durumunda başınıza açılacak herhangi bir suçtan "Perla API Servis Sağlayıcısı" sorumlu değildir. (Kendi aptallığınız amına koyim ne yapalım bizde 🙂)

        \`1.\` Ödeme geçmişinizi görmek için \`${emojis.payment}\` emojisine tıklayın.
        \`2.\` Ayarlarınızı değiştirmek için \`${emojis.settings}\` emojisine tıklayın.
        \`3.\` Aşağıdaki \`Seçmeli menüden\` sizde olan mevcut API'leri açıp kapatabilirsiniz.
        `)], components: [row, selectRow] })

    }
}