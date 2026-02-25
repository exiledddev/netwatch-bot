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
  const isAdmin = interaction.member.permissions.has('Administrator') || interaction.member.id === '1273910593539014680';
  if (!isAdmin) {
    await interaction.reply({ content: 'This bot requires administrator permissions to be used.', ephemeral: true });
    return;
  }

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

    if (interaction.commandName === 'vote') {
        const embed = {
            title: 'Vote for Mocap Session Interest',
            description: 'Please vote on whether you are interested in attending future mocap sessions. Mocaps are recording events that are scripted.',
            fields: [
                { name: '✅ Yes', value: 'I am interested in attending mocap sessions.', inline: false },
                { name: '❌ No', value: 'I am not interested in attending mocap sessions.', inline: false }
            ],
            author: {
                name: 'NetWatch Team',
                icon_url: 'https://cdn.discordapp.com/attachments/1474105204248023060/1474160764829958237/netwatch_pfp.png?ex=6998d6b2&is=69978532&hm=308d1dedaffd5c6244aef8dadf32b69143e8354119ddcd5880eb49b1a619c610&'
            },
            color: 0xFF0000,
            footer: {
                text: 'React to this message with your vote!'
            },
            image: { url: 'https://cdn.discordapp.com/attachments/1474105204248023060/1474105242420383928/netwatch_banner.png?ex=69994bbd&is=6997fa3d&hm=a50615847f533ab8b3f4ba171784413a6fcaf3567826855520f388158b2f4503&' }
        };

        const sentMessage = await interaction.reply({
            content: '@everyone',
            embeds: [embed],
            allowedMentions: { parse: ['everyone'] },
            fetchReply: true 
        });
        await sentMessage.react('✅');
        await sentMessage.react('❌');
        }

        if (interaction.commandName === 'form') {
            const formType = interaction.options.getString('form');
            
            if (formType === 'main_actor') {
                const embed = {
                    author: {
                        name: 'Island SMP Team',
                        icon_url: 'https://cdn.discordapp.com/attachments/1474105204248023060/1474160764829958237/netwatch_pfp.png?ex=6998d6b2&is=69978532&hm=308d1dedaffd5c6244aef8dadf32b69143e8354119ddcd5880eb49b1a619c610&'
                    },
                    title: 'Apply for Main Actor Role',
                    description: 'If you are interested in being a main actor for our mocap sessions, please fill out the form linked below. Main actors are featured prominently in our mocap sessions and often have speaking roles.',
                    fields: [
                        { name: 'Form Link', value: '[Main Actor Application Form](https://forms.gle/TAXWJ3FhWmQsNLxt7)' }
                    ],
                    color: 0x00FF00,
                    footer: { text: 'Please note that filling out the form does not guarantee a role. We will review all applications and reach out to selected candidates.' }
                }
                await interaction.reply({
                    embeds: [embed],
                    ephemeral: false
                });
            }

            else if (formType === 'builder_form') {
                const embed = {
                    author: {
                        name: 'Island SMP Team',
                        icon_url: 'https://cdn.discordapp.com/attachments/1474105204248023060/1474160764829958237/netwatch_pfp.png?ex=6998d6b2&is=69978532&hm=308d1dedaffd5c6244aef8dadf32b69143e8354119ddcd5880eb49b1a619c610&'
                    },
                    title: 'Apply for Builder Role',
                    description: 'If you are interested in being a builder for our mocap sessions, please fill out the form linked below. Builders help create the sets and environments for our mocap sessions.',
                    fields: [
                        { name: 'Form Link', value: '[Builder Application Form](https://forms.gle/bEqpLkRzkcZgHr1e9)' }
                    ],
                    color: 0x0000FF,
                    footer: { text: 'Please note that filling out the form does not guarantee a role. We will review all applications and reach out to selected candidates.' }
                }
                await interaction.reply({
                    embeds: [embed],
                    ephemeral: false
                });
            }
        }

});

client.login(process.env.DISCORD_TOKEN);