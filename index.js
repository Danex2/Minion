const TeemoJS = require("teemojs");
const Discord = require("discord.js");
const secret = require("./secret.json");
const client = new Discord.Client();
let api = TeemoJS(secret.RGAPI);
const prefix = "%";

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

function winPC(league) {
  let win = (100 * league[0].wins) / (league[0].wins + league[0].losses);
  return win.toFixed(1);
}

const regions = {
  na: "na1",
  ru: "ru",
  kr: "kr",
  br: "br1",
  oc: "oc1",
  eune: "eun1",
  euw: "euw1",
  tr: "tr1",
  lan: "la1",
  las: "la2"
};

client.on("message", message => {
  messageArray = message.content.split(" ");
  [command, summoner, region] = [...messageArray];
  if (command === `${prefix}rank` && summoner !== "" && region !== "") {
    api
      .get(regions[region], "summoner.getBySummonerName", summoner)
      .then(data =>
        api
          .get(
            regions[region],
            "league.getAllLeaguePositionsForSummoner",
            data.id
          )
          .then(league =>
            message.channel.send({
              embed: {
                color: 3447003,
                author: {
                  name: summoner,
                  icon_url: client.user.avatarURL
                },
                title: `Ranked stats for ${summoner}`,
                fields: [
                  {
                    name: "League name",
                    value: league[0].leagueName
                  },
                  {
                    name: "Tier",
                    value: `${league[0].tier} ${league[0].rank}`
                  },
                  {
                    name: "League points",
                    value: league[0].leaguePoints
                  },
                  {
                    name: "Wins / Losses (%)",
                    value: `${league[0].wins} / ${league[0].losses} %(${winPC(
                      league
                    )})`
                  }
                ],
                timestamp: new Date()
              }
            })
          )
          .catch(err => console.log(err))
      );
  }
});

client.login(secret.TOKEN);
