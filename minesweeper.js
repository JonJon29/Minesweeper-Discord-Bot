const miner = require('./generator');
const Discord = require('discord.js');
const client = new Discord.Client;

//Permission: 10320
//link: https://discord.com/api/oauth2/authorize?client_id=853721396110819358&permissions=10320&scope=bot

let games = {};
let g;

var x = 10;
var y = 10;
var bombs = 20;

client.login('ODUzNzIxMzk2MTEwODE5MzU4.YMZgAg.qYjGjMlex777IhAC5fTPDbgp5dA');

client.on("ready", () => {
    client.user.setActivity("Minesweeper", { type: 'PLAYING'});
    console.log("Ready to play?");
})

client.on('message', msg =>{
    let delay = 0;
    if(!msg.author.bot && msg.content === 'minesweeper.start'){
        msg.guild.channels.create("minesweeper for " + msg.author.username, {
            type: 'text',
            permissionOverwrites: [
               {
                 id: msg.author.id,
                 allow: ['VIEW_CHANNEL'],
              },
              {
                  id: msg.guild.roles.everyone.id,
                  deny: 'VIEW_CHANNEL',
              },
              {
                  id: client.user.id,
                  allow: ['VIEW_CHANNEL'],
              }
            ],
          }).then(result =>{
            var map = miner.generate(x, y, bombs);
            result.send(miner.generate_string(map)).then(field => games[msg.author.id] = {"map": map, "current": miner.generate_empty(x, y), "field_id": field.id});
            });
        
    }else if(!msg.author.bot && msg.channel.name.includes('minesweeper')){
        if(msg.content === '.delete'){
            msg.channel.delete();
        }else if(msg.content === '.repeate'){
            g = games[msg.author.id];
            msg.channel.send(miner.generate_string(g.current));
        }else{
            g = games[msg.author.id];
            var input = msg.content;
            input = input.split('.');
            if(input[2]){
                if(input[2] === 'f' && g.current[input[1] - 1][input[0] - 1] === 'e'){
                    g.current[input[1] - 1][input[0] - 1] = 'f';
                }
            }else if(!isNaN(parseInt(input[0]))){
                if(!isNaN(parseInt(input[1]))){
                    g.current[input[1] - 1][input[0] - 1] = g.map[input[1] - 1][input[0] - 1];
                    if(g.map[input[1] - 1][input[0] - 1] === 0){
                        let zero = miner.detect_zero(g.map, input[1], input[0]);
                        for(var i = 0; i < zero.length; i++){
                            g.current[zero[i][0]][zero[i][1]] = g.map[zero[i][0]][zero[i][1]];
                        }
                    }else if(g.map[input[1] - 1][input[0] - 1] === 'x'){
                        msg.channel.send('GAME OVER');
                        delay = 3000;
                    }
                }
            }
            msg.channel.messages.fetch({around: g.field_id, limit: 1})
            .then(field => {
                const fetchedMsg = field.first();
                fetchedMsg.edit(miner.generate_string(g.current));
            });
           
        }
     msg.delete({ timeout: delay });
    }
});