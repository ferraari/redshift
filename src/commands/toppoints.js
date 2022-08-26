import { MessageEmbed } from 'discord.js'

module.exports.run = async (redshift, message, args, prefix) => {
  const nowTime = Date.now()
  const { author } = message;
  const allPoints = redshift.getScore.all()
  const sortedPoints = allPoints.sort((a, b) => b.score - a.score).map((data, index) => {
    return { user: data.user, score: data.score, id: data.id, rankPosition: index + 1 }
  })
  const executerPoints = sortedPoints.find(data => data.user === author.id)
  const topPoints = sortedPoints.slice(0, 10).map(data => {
    return `**#${data.rankPosition}** <@${data.user}> - **${data.score} pontos**`
  })

  const embed = new MessageEmbed()
  .setColor('#8257E5')
  .setTimestamp(nowTime)
  .setAuthor({name: 'Top Pontos', icon_url: 'https://i.imgur.com/joNSV1d.png'})
  .setThumbnail('https://i.imgur.com/joNSV1d.png')
  .setFooter({text: `Executado por ${author.tag}`, icon_url: author.displayAvatarURL({dynamic: true})});

  if (topPoints.length === 0) {
    embed.setDescription('Ninguém pontuou ainda.');
  } else { 
    embed.setDescription(topPoints.join('\n'));
    if (executerPoints.rankPosition > 10) {
      embed.addField(`Seu rank (${author.username})`, `**#${executerPoints.rankPosition}** - **${executerPoints.score} pontos**`);
    }
  }

  message.channel.send({ embeds: [embed] });
}

module.exports.help = {
    name: "toppoints",
    usage: "Mostra o Top 10 dos maiores pontuadores",
    type: "normal"
}