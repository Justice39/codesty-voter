const Eris = require("eris");
const axios = require("axios")
const {token, channel_id} = require("./config.json")
const client = new Eris(token, { restMode: true });
let guildID;

async function start() {
    const payload_json = {
        "type": 2,
        "application_id": "504672489016918016",
        "guild_id": guildID,
        "channel_id": channel_id,
        "session_id": "Justice39",
        "data": {"version":"954369276008095777","id":"954369276008095774","name":"oy","type":1,"options":[],"application_command":{"application_id":"504672489016918016","default_member_permissions":null,"default_permission":true,"description":"Bu komut sayesinde sunucuya oy vererek destekte bulunabilirsiniz!","dm_permission":null,"id":"954369276008095774","name":"oy","permissions":[],"type":1,"version":"954369276008095777"},"attachments":[]}
    };
    
    axios({
        url: "https://discord.com/api/v9/interactions",
        method: "POST",
        headers: { authorization: token },
        data: payload_json
    }).catch(err=> console.log(err));

    setTimeout(start, 7240000);
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) };


client.connect().then(()=> {
    const loop = setInterval(async () =>{
        if(client.guilds.size > 0) {
            clearInterval(loop);
            console.log("Ready!");
            const rest_channel = await client.getRESTChannel(channel_id);
            guildID = rest_channel.guild.id 
            start();
        }
    })
})
