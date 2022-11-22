
const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const fs = require('fs/promises');
const JSONdb = require('simple-json-db');
const db = new JSONdb('local.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('locale')
		.setDescription(`Change Quantum's localization.`)
        .addStringOption(option =>
			option.setName('language')
				.setDescription('Choose a specifec language.')
				.setRequired(true)
				.addChoices(
					{ name: 'English', value: 'english' },
					{ name: 'Arabic', value: 'arabic'},
				))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),

	async execute(interaction) {
        let guildLanguages = {};
        const guildLanguage = guildLanguages[interaction.guild.id] || "english";
        const language = require(`../../languages/${guildLanguage}`);
        const newLanguageName = interaction.options.getString('language')
        guildLanguages[interaction.guild.id] = newLanguageName;
        db.set(`${interaction.guild.id}`, `${newLanguageName}`)
        const newLanguage = require(`../../languages/${newLanguageName}`);
        const updated_locale = new EmbedBuilder()
        .setTitle(`${newLanguage("LANGUAGE_UPDATED")}`)
        .setColor("#ff1c4d")
        .setFooter({text: `${newLanguage("FOOTER")}`, iconURL: "https://media.discordapp.net/attachments/1037588833274961920/1037629356677279764/QuantumPFP.png?width=657&height=657"})
        interaction.reply({embeds: [updated_locale], ephemeral: true});
        },
};

