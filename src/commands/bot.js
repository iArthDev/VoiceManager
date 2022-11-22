
const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, PermissionFlagsBits, Embed } = require('discord.js');
const fs = require('fs/promises');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bot')
		.setDescription(`Quantum's information.`),
	async execute(interaction, client) {
        async function user() {
                const data = await fs.readFile('./local.json', { encoding: 'utf8' });
                const language = JSON.parse(data);
                const newLanguage = require(`../../languages/${language[interaction.guild.id] || 'english'}`);

                const bot = new EmbedBuilder()
                .setTitle(`${JSON.stringify(newLanguage("FOOTER")).replace(/[^\w\s]/gi, '')}`, )
                .setColor("ff1c4d")
                .setThumbnail("https://media.discordapp.net/attachments/1037588833274961920/1037629357037994004/Transp.png?width=657&height=657")
                .setFooter({text: `${newLanguage("FOOTER")}`, iconURL: "https://media.discordapp.net/attachments/1037588833274961920/1037629356677279764/QuantumPFP.png?width=657&height=657"})
                .setFields(
                    {name: `<:QuantumDEV:1037606198901481483> ${newLanguage("DEVELOPER")}`, value: `\`852766506756210688\``, inline: true},
                    {name: `<:Quantum:1037603666288459857> ${newLanguage("VERSION_TITLE")}`, value: `\`0.0.1 Open Alpha\``, inline: true},
                    {name: `<:Update:1039241964236841062> ${newLanguage("LU_TITLE")}`, value: `\`2022/6/11\``, inline: true},

                )
                interaction.reply({embeds: [bot]})
          }


        user();
        },
};

