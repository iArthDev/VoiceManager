
const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, PermissionFlagsBits, ChannelType } = require('discord.js');
const fs = require('fs/promises');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('channel')
		.setDescription(`Channel informations.`)
        .setDMPermission(false)
        .addChannelOption(option =>
			option.setName('channel')
            .setRequired(true)
            .setDescription("Target")
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildVoice)),

	async execute(interaction) {
        async function channel() {
                const data = await fs.readFile('./local.json', { encoding: 'utf8' });
                const language = JSON.parse(data);
                const newLanguage = require(`../../languages/${language[interaction.guild.id] || 'english'}`);
                const target = interaction.options.getChannel('channel');


                const userEmbed = new EmbedBuilder()
                .setTitle(`<:Text:1039241974626140240> #${JSON.stringify(target.name).replace(/[^\w\s]/gi, '')}`)
                .setColor("ff1c4d")
                .setThumbnail(interaction.guild.iconURL({dynamic: true}))
                .setFooter({text: `${newLanguage("FOOTER")}`, iconURL: "https://media.discordapp.net/attachments/1037588833274961920/1037629356677279764/QuantumPFP.png?width=657&height=657"})

                .setFields(
                    {name: '<:Type:1039241961095319612> Type', value: `\`${JSON.stringify(target.type).replace(/[^\w\s]/gi, '')}\``, inline: true},
                    {name: '<:ID:1039241966690504705> ID', value: `<#${JSON.stringify(target.id).replace(/[^\w\s]/gi, '')}>\n\`${JSON.stringify(target.id).replace(/[^\w\s]/gi, '')}\``, inline: true},
                    {name: '<:Menu:1039241969043513374> Category', value: `<#${JSON.stringify(target.parentId).replace(/[^\w\s]/gi, '')}>`, inline: true},
                    {name: '<:Text:1039241974626140240> Position', value: `\`${JSON.stringify(target.rawPosition)}\``, inline: true},
                    {name: '<:Text:1039241974626140240> Topic', value: `\`${JSON.stringify(target.topic).replace(/[^\w\s]/gi, '')}\``, inline: true},
                    {name: '<:NSFW:1039241977813807236> isNSFW?', value: `\`${JSON.stringify(target.nsfw).replace(/[^\w\s]/gi, '')}\``, inline: true},
                    {name: '<:Link:1039241981475434516> Link to last message', value: `[[link]](https://discord.com/channels/${interaction.guild.id}/${JSON.stringify(target.id).replace(/[^\w\s]/gi, '')}/${JSON.stringify(target.lastMessageId).replace(/[^\w\s]/gi, '')})`, inline: true},
                    { name: '\u200b', value: '\u200b', inline: true},
                    {name: '<:Calendar:1039241983820058755> Created at', value: `<t:${Math.round(JSON.stringify(target.createdTimestamp).replace(/[^\w\s]/gi, '') / 1000)}:R>`, inline: true},

                )
                interaction.reply({embeds: [userEmbed]})

      }
      channel();
        },
};

