import { Client, Events, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on(Events.ClientReady, readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}!`);
  client.user.setPresence({
    activities: [{ name: '🟢 NetWatch operational...', ActivityType: 'WATCHING' }],
    status: 'dnd',
  })
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'mocap') {
    const userMessage = interaction.options.getString('message');
    const mocapDateString = interaction.options.getString('date');
    const mocapDate = new Date(mocapDateString);
    const mocapName = interaction.options.getString('name')?.toUpperCase() || 'UPCOMING MOCAP SESSION';
    const vcInfo = interaction.options.getString('vc') || 'No voice channel provided.';
    const requirements = interaction.options.getString('requirements') || 'No specific requirements provided.';
    const unix = Math.floor(mocapDate.getTime() / 1000);

    const embed = {
        title: mocapName,
        description: userMessage,
        thumbnail: { url: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzdvMzQwMTcyY3o3NGluenAyNmcxMmU3dDFjZng1MGR6b3htZXRocyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YO7P8VC7nlQlO/giphy.gif'},
        fields: [
            { name: 'Date', value: `<t:${unix}:R>`, inline: false },
            { name: 'Voice Channel', value: vcInfo, inline: false },
            { name: 'Requirements', value: requirements, inline: false }
        ],
        color: 0xFF0000,
        author: {
            name: interaction.user.tag,
            icon_url: interaction.user.displayAvatarURL()
        },
        image: { url: 'https://cdn.discordapp.com/attachments/1474105204248023060/1474151700200951995/netwatch_banner_2.png?ex=6998ce41&is=69977cc1&hm=1114493375019f732b66df2ac0334195dab073d8c1e3dd366ef3d6fb92808311&' },
        footer: {
            text: 'React to this message if you will be attending the mocap session!',
        }
    }

    const sentMessage = await interaction.reply({
        content: '@here',
        embeds: [embed],
        allowedMentions: { parse: ['everyone'] },
        fetchReply: true 
    });
    await sentMessage.react('✅');
}
if (interaction.commandName === 'embed') {
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description') || '';
    const thumbnail = interaction.options.getAttachment('thumbnail');
    const image = interaction.options.getAttachment('image');
    const footer = interaction.options.getString('footer') || '';
    const color = interaction.options.getString('color') || 0x000000;
    const author = interaction.options.getString('author') || '';

    const embed = {
        title: title,
        description: description,
        thumbnail: thumbnail ? { url: thumbnail.url } : undefined,
        image: image ? { url: image.url } : undefined,
        footer: footer ? { text: footer } : undefined,
        color: typeof color === 'string' ? parseInt(color.replace('#', ''), 16) : color,
        author: author ? { name: author, icon_url: interaction.user.displayAvatarURL() } : undefined
    };

    await interaction.reply({
        embeds: [embed]
    });
    }

    if (interaction.commandName === 'welcome') {
        const embed = {
            title: 'NetWatch Guide',
            description: '👋 Hi there! Thank you for inviting NetWatch. I am a multi purpose bot, but primarily used for easier Mocap/Recording setup. Here is a quick guide:',
            fields: [
                { name: '📢 Mocap Command', value: 'Use the `/mocap` command to set up an embed with all the information regarding an upcoming mocap session. You can include the date, time, voice channel info, requirements, and a custom message. Please do note that the mocap command does ping everyone, so kindly be careful when using it.' },
                { name: '💬 Embed Command', value: 'Use the `/embed` command to create a custom embed with your own title, description, images, and more. Perfect for announcements or sharing information in a visually appealing way.' },
                { name: '☑️ Reactions', value: 'After using the `/mocap` command, react to the message with ✅ if you will be attending the mocap session. This helps organizers keep track of attendees!' }
            ],
            author: {
                name: interaction.user.tag,
                icon_url: interaction.user.displayAvatarURL()
            },
            color:0x5DADE2,
            footer: {
                text: '💌 For contact and support, please reach out to `markedexiled` on discord, or email `business@markedexiled.com`.'
            },
            thumbnail: { url: 'https://cdn.discordapp.com/attachments/1474105204248023060/1474160764829958237/netwatch_pfp.png?ex=6998d6b2&is=69978532&hm=308d1dedaffd5c6244aef8dadf32b69143e8354119ddcd5880eb49b1a619c610&' }
        }

        await interaction.reply({
            embeds: [embed]
        });
    }
});

client.login(process.env.DISCORD_TOKEN);