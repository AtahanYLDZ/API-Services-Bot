const config = require('../config');
const axios = require('axios');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const customerSchema = require('../../Database/Schemas/customerSchema');
const APIList = require('../apiList.json');
const table = require('table')
const moment = require('moment')
moment.locale('tr')

async function verify2FA(authData, token) {

    try {

        if(!authData || !authData.TwoFactor.active || !authData.TwoFactor.secret || !token) return false;

        const verified = speakeasy.totp.verify({
            secret: authData.TwoFactor.secret,
            encoding: 'base32',
            token: token
        });

        return verified;

    } catch (err) {
        console.log(err);
        return false;
    }

}

async function generate2FA(auth) {

    try {

        const secret = speakeasy.generateSecret({ length: 20 });
        const otpAuthUrl = speakeasy.otpauthURL({
          secret: secret.ascii,
          label: `${auth} - Perla API Servisi`,
          algorithm: 'sha1',
          window: 1,
        });

        const qrCode = await QRCode.toDataURL(otpAuthUrl);

        return { qrCode: qrCode, secret: secret.base32 };

    } catch (err) {
        console.log(err);
        return false;
    }

}

async function apiTable(authData) {

    let mevcutApiler = authData.sorgular
    let mevcutApiler2 = [];
    let toplamFiyat = 0
    await Promise.all(mevcutApiler.map(async (sorgu) => {

        let api = APIList.find(x => x.value === sorgu.name)
        if(!api) return;

        sorgu.price = api.price
        toplamFiyat = toplamFiyat + Number(api.price)

        mevcutApiler2.push(sorgu)

    }))
    mevcutApiler2.push({ name: "TOPLAM", price: toplamFiyat })
    let topBar = [["INDEX", "API", "BITIS TARIHI", "API FIYATI", "DURUM"]]
    topBar = topBar.concat(mevcutApiler2.map(x => {
        return [`${x.name !== "TOPLAM" ? mevcutApiler2.indexOf(x) + 1 : "TOPLAM"}`, `${x.name === "TOPLAM" ? "" : x.name}`, `${x.name === "TOPLAM" ? "" : moment(x.endTimestamp).format("DD/MM/YYYY")}`, `${x.price.toLocaleString("tr-TR")} ₺`, `${x.name === "TOPLAM" ? "" : x.active ? "AKTIF" : "DONDURULDU"}`]
    }))
    
    const tableContent = table.table(topBar, {
        border: table.getBorderCharacters(`void`),
    });

    return tableContent;

}

async function toplamAylikKazanç() {

    try {

        let allData = await customerSchema.find();
        allData = allData.filter(x => x.sorgular.length > 0 && !["hoster","perla","servis"].includes(x.Auth))

        let totalPrice = 0;

        await Promise.all(allData.map(async (data) => {

            let sorgular = data.sorgular

            await Promise.all(sorgular.map(async (sorgu) => {

                let api = APIList.find(x => x.value === sorgu.name)
                if(!api) return;

                totalPrice = totalPrice + Number(api.price)

            }))

        }))

        return `${totalPrice.toLocaleString("tr-TR")} ₺`;

    } catch (err) {
        console.log(err);
        return 0;
    }

}

async function cfAddIpWl(ip) {

  try {

    const response = await axios.post(`https://api.cloudflare.com/client/v4/zones/${config.cloudflare.zoneId}/firewall/access_rules/rules`, {
      mode: 'whitelist',
      configuration: {
        target: 'ip',
        value: ip
      }
    }, {
      headers: {
        'Authorization': config.cloudflare.token,
        'Content-Type': 'application/json'
      }
    });

    return response.data.success;

  } catch (error) {
    return false;
  }

}

async function cfRemoveIpWl(ip) {

  try {

    const response = await axios.get(
      `https://api.cloudflare.com/client/v4/zones/${config.cloudflare.zoneId}/firewall/access_rules/rules`,
      {
        headers: {
          'Authorization': config.cloudflare.token,
          'Content-Type': 'application/json',
        },
      }
    );

    const ipRule = response.data.result.find(rule => rule.configuration.target.includes("ip") && rule.configuration.value === ip);
    if(!ipRule) return false;

    const deleteResponse = await axios.delete(`https://api.cloudflare.com/client/v4/zones/${config.cloudflare.zoneId}/firewall/access_rules/rules/${ipRule.id}`, {
      headers: {
        'Authorization': config.cloudflare.token,
        'Content-Type': 'application/json'
      }
    });

    return deleteResponse.data.success;

  } catch (error) {
    return false;
  }

}

module.exports = {
    verify2FA,
    generate2FA,
    apiTable,
    toplamAylikKazanç,
    cfAddIpWl,
    cfRemoveIpWl,
}