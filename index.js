const Eris = require("eris");
const axios = require("axios")
const config = require("./config.json")
const {token, vote_channel} = config
const client = new Eris(token);

console.log(token, vote_channel)
client.on("messageCreate", async message => {
    if(message.author.id === "504672489016918016") {
        const text = `<@${client.user.id}>, formata uygun şekilde resimde verilen kodun bulunduğu butona basarak bu sunucuya oy verebilirsiniz. İşlem **60 saniye** sonra otomatik olarak iptal edilecek.`;
        if(!message.content.includes(text)) return;
        const components_data = message.components[0];
        if (!components_data) return
        //console.log(message.components[0]);
        checkRealCode(components_data, message);

    }
});

function checkRealCode(data, message) {
    if(data.components == undefined || typeof data.components !== "object") return null
    let real_button = null
    
    for (let index = 0; index < data.components.length; index++) {
        const button = data.components[index];
        if(button.custom_id.endsWith("true")) {
            real_button = button
            sendCaptchaCode(real_button.custom_id, message)
        }

    }
    if(real_button == null) return null
    return real_button
}

function sendCaptchaCode(button_id, message) {
    console.log("Button ID:",button_id);

    axios({
        url: "https://discord.com/api/v9/interactions",
        method: "POST",
        headers: {authorization: token},
        data: {
            "application_id": "504672489016918016",
            "message_id": message.id,
            "message_flags": 0,
            "channel_id": message.channel.id,
            "guild_id": message.guildID,
            "data": {
                "component_type": 2,
                "custom_id": button_id
            },
            "session_id": "e8de4493d638cd3eb217378978aa9cf9",
            "type": 3
        }
    }).catch(err => console.log(err))
}

async function start() {
    client.createMessage(vote_channel,'!oy');

    setTimeout(start, 3600000*2);
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) };


client.connect().then(()=> {
    const loop = setInterval(() =>{
        if(client.guilds.size > 0) {
            clearInterval(loop)
            console.log("Ready!")
            start()
        }
    })
})





















