
const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, PermissionFlagsBits, ChannelType, Embed } = require('discord.js');
const fs = require('fs/promises');
const JSONdb = require('simple-json-db');
const db = new JSONdb('logs.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription(`Setup Quantum's databoard.`)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addChannelOption(option =>
            option.setName('channel')
                .setRequired(true)
                .setDescription(`Quantum's Databoard`)
                .addChannelTypes(ChannelType.GuildText)),

	async execute(interaction) {
        async function setup() {

            const data = await fs.readFile('./local.json', { encoding: 'utf8' });
            const language = JSON.parse(data);
            let parrentArray = [];
            let setupChannel = {};
            
            const newLanguage = require(`../../languages/${language[interaction.guild.id] || 'english'}`);
            const newSetupChannel = interaction.options.getChannel('channel').id;

            const alreadySat = new EmbedBuilder()
            .setTitle(`${newLanguage("ALREADY_ERROR")}`)
            .setDescription(`${newLanguage("ALREADY_DISC_ERROR")}`)
            .setColor("#ff1c4d")
            .setFooter({text: `${newLanguage("FOOTER")}`, iconURL: "https://media.discordapp.net/attachments/1037588833274961920/1037629356677279764/QuantumPFP.png?width=657&height=657"})

            if(db.has(`${interaction.guild.id}`)) {
                interaction.reply({embeds: [alreadySat]})
            } else {
                setupChannel[interaction.guild.id] = newSetupChannel;
                db.set(`${interaction.guild.id}`, `${newSetupChannel}`)
                const setupSet = new EmbedBuilder()
                .setTitle(`${newLanguage("SETUP")}`)
                .setColor("#ff1c4d")
                .setFooter({text: `${newLanguage("FOOTER")}`, iconURL: "https://media.discordapp.net/attachments/1037588833274961920/1037629356677279764/QuantumPFP.png?width=657&height=657"})
                interaction.reply({embeds: [setupSet]})
            }

            }

          setup();
      },
};

