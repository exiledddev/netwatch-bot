import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import 'dotenv/config';

const guildIds = [
  "1459537410139357277",
  "1455590157028950222",
  "1233277040837263360"
];

const commands = [
  new SlashCommandBuilder()
    .setName('mocap')
    .setDescription('Set up an embed to ping everyone with information regarding an upcoming mocap session.')
    .addStringOption(option =>
      option.setName('date')
        .setDescription('The date of the mocap session. Use this EXACT format: YYYY-MM-DD HH:MM (24-hour format)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Information to be displayed in the embed.')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Name of the mocap session (optional)')
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName('vc')
        .setDescription('Invite link for the voice channel for the mocap session (optional)')
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName('requirements')
        .setDescription('Requirements to join the Mocap Session (optional)')
        .setRequired(false)
    )
    .toJSON(),

    new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Generate an embed with the provided fields.')
    .addStringOption(option =>
      option.setName('title')
        .setDescription('The title of the embed')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('description')
        .setDescription('Description text for the embed.')
        .setRequired(false)
    )
    .addAttachmentOption(option =>
      option.setName('thumbnail')
        .setDescription('Thumbnail image for the embed (optional)')
        .setRequired(false)
    )
    .addAttachmentOption(option =>
      option.setName('image')
        .setDescription('Main image for the embed (optional)')
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName('footer')
        .setDescription('Footer text for the embed (optional)')
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName('color')
        .setDescription('Hex code for the embed color (optional, include #)')
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName('author')
        .setDescription('Author name for the embed (optional)')
        .setRequired(false)
    )
    .toJSON(),

    new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Sends the NetWatch guide/welcome message in the current channel.')
    .toJSON(),

    new SlashCommandBuilder()
    .setName('vote')
    .setDescription('Sends the voting option for whether members are interested or not in Mocaps.')
    .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

try {
  console.log('Started refreshing application (/) commands.');
  for(const guildId of guildIds) {
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId), { body: commands }
    );
  }

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}