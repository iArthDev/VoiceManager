
const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, PermissionFlagsBits, Embed } = require('discord.js');
const fs = require('fs/promises');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription(`User informations.`)
        .addUserOption(option =>
			option.setName('user')
            .setRequired(true)
            .setDescription("Target"),
            )
        .setDMPermission(false),

	async execute(interaction) {
        async function user() {
                const data = await fs.readFile('./local.json', { encoding: 'utf8' });
                const language = JSON.parse(data);
                const newLanguage = require(`../../languages/${language[interaction.guild.id] || 'english'}`);
                const target = interaction.options.getUser('user') || interaction.member.user;
                const memberTarget = await interaction.guild.members.fetch(target);
                const memberRoles = memberTarget.roles.cache
                .filter((roles) => roles.id !== interaction.guild.id)
                .map((role) => role.toString())
                .join("\n");

                const userEmbed = new EmbedBuilder()
                .setTitle(`${JSON.stringify(target.username).replace(/[^\w\s]/gi, '')}`, )
                .setColor("ff1c4d")
                .setThumbnail(target.avatarURL({extension: 'png'}))
                .setFooter({text: `${newLanguage("FOOTER")}`, iconURL: "https://media.discordapp.net/attachments/1037588833274961920/1037629356677279764/QuantumPFP.png?width=657&height=657"})
                .setFields(
                        {name: '<:ID:1039241966690504705> ID', value: `\`${JSON.stringify(target.id).replace(/[^\w\s]/gi, '')}\``, inline: true},
                        {name: '<:ID:1039241966690504705> Discriminator', value: `\`${JSON.stringify(target.discriminator).replace(/[^\w\s]/gi, '')}\``, inline: true},
                        {name: '<:Type:1039241961095319612> isBot?', value: `\`${JSON.stringify(target.bot).replace(/[^\w\s]/gi, '')}\``, inline: true},
                        {name: '<:ID:1039241966690504705> Avatar', value: `[[png]](${target.avatarURL({ extension: 'png' })}) | [[jpg]](${target.avatarURL({ extension: 'jpg' })})`, inline: true},
                        {name: '<:ID:1039241966690504705> Public Flags', value: `\`${JSON.stringify(target.flags).replace(/[^\w\s]/gi, '')}\``, inline: true},
                        {name: '<:ID:1039241966690504705> Created at', value: `<t:${Math.round(target.createdTimestamp / 1000) }:R>`, inline: true},
                        {name: '<:ID:1039241966690504705> Roles', value: `${memberRoles}`, inline: true},
                    { name: '\u200b', value: '\u200b', inline: true},
                        {name: '<:Calendar:1039241983820058755> Joined at', value: `<t:${Math.round(memberTarget.joinedTimestamp / 1000)}:R>`, inline: true},


                )
                interaction.reply({embeds: [userEmbed]})
          }
        user();
        },
};

