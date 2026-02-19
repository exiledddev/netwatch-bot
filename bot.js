import { Client, Events, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on(Events.ClientReady, readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}!`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'mocap') {
    const userMessage = interaction.options.getString('message');
    const mocapDate = interaction.options.getString('date');
    const mocapName = interaction.options.getString('name')?.toUpperCase() || 'UPCOMING MOCAP SESSION';
    const vcInfo = interaction.options.getString('vc') || 'No voice channel provided.';
    const requirements = interaction.options.getString('requirements') || 'No specific requirements provided.';

    const embed = {
        title: mocapName,
        description: userMessage,
        thumbnail: { url: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzdvMzQwMTcyY3o3NGluenAyNmcxMmU3dDFjZng1MGR6b3htZXRocyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YO7P8VC7nlQlO/giphy.gif'},
        fields: [
            { name: 'Date', value: mocapDate, inline: false },
            { name: 'Voice Channel', value: vcInfo, inline: false },
            { name: 'Requirements', value: requirements, inline: false }
        ],
        color: 0xFF0000,
        author: {
            name: interaction.user.tag,
            icon_url: interaction.user.displayAvatarURL()
        },
        image: { url: 'https://cdn.discordapp.com/attachments/1474105204248023060/1474105242420383928/netwatch_banner.png?ex=6998a2fd&is=6997517d&hm=fe7a3620eab62b754d39379d2b107e2b8a7346219acebcb6445a5297303280d5&' },
        footer: {
            text: 'React to this message if you will be attending the mocap session!',
        }
    }

    const sentMessage = await interaction.reply({
        content: '@everyone',
        embeds: [embed],
        allowedMentions: { parse: ['everyone'] },
        fetchReply: true 
    });
    await sentMessage.react('✅');
}

});

client.login(process.env.DISCORD_TOKEN);