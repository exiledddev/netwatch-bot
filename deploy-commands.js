import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import 'dotenv/config';

const commands = [
  new SlashCommandBuilder()
    .setName('mocap')
    .setDescription('Set up an embed to ping everyone with information regarding an upcoming mocap session.')
    .addStringOption(option =>
      option.setName('date')
        .setDescription('The date of the mocap session (DD/MM/YYYY)')
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
    .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}