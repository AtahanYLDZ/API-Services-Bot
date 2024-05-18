const config = require('../config');
const { emojis } = config;

async function executeModal(int, embed) {

    try {

        let client = int.client;

        let values = int.customId.split("-");
        let customId = values[0];
        let cmd = client.modalCommands.get(customId);
        if(!cmd) return;

        if(cmd.deferReply === true) await int.deferReply({ ephemeral: true });

        if(int.user.id === values[values.length - 1]) {
            await cmd.execute(client, int, embed, values);
        }

    } catch (err) {
        console.log(err);
    }

}

async function executeSelectMenu(int, embed) {

    try {

        let client = int.client;

        let values = int.customId.split("-");
        let customId = values[0];
        let cmd = client.selectCommands.get(customId);
        if(!cmd) return;

        if(cmd.deferReply === true) await int.deferReply({ ephemeral: true });

        if(int.user.id === values[values.length - 1]) {
            await cmd.execute(client, int, embed, values);
        }

    } catch (err) {
        console.log(err);
    }

}

async function executeButton(int, embed) {

    try {

        let client = int.client;

        let values = int.customId.split("-");
        let customId = values[0];
        let cmd = client.buttonCommands.get(customId);
        if(!cmd) return;

        if(cmd.deferReply === true) await int.deferReply({ ephemeral: true });

        if(int.user.id === values[values.length - 1]) {
            await cmd.execute(client, int, embed, values);
        }

    } catch (err) {
        console.log(err);
    }

}

module.exports = {
    executeModal,
    executeSelectMenu,
    executeButton
}