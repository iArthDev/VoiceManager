const { Events,EmbedBuilder } = require('discord.js');
let cache = require('memory-cache');
const fs = require('fs');

module.exports = {
    name: Events.InteractionCreate,
    on: true,
    async execute(interaction) {
        if (!interaction.isButton()) return;
        async function userActions() {
            if(interaction.customId === 'user') {
                const author = cache.get("cachedAuthor").then(() => {
                }).catch(err => {
                    if(err) return;

                })
                const newLanguage = require(`../../languages/english`);
                const target = await interaction.guild.members.fetch(author);
                const memberRoles = target.roles.cache
                .filter((roles) => roles.id !== interaction.guild.id)
                .map((role) => role.toString())
                .join("\n");


                let Id = JSON.stringify(target.id).replace(/[^\w\s]/gi, '')
                let avatarPng = target.displayAvatarURL({ extension: 'png' })
                let avatarJpg = target.displayAvatarURL({ extension: 'png' })
                let joinedAt = target.joinedTimestamp;
                const userEmbed = new EmbedBuilder()
                .setTitle(`${JSON.stringify(target.displayName).replace(/[^\w\s]/gi, '')}`, )
                .setDescription("A minimal display of this user data, if you need more you can use `/userinfo`.")
                .setColor("ff1c4d")
                .setThumbnail(target.displayAvatarURL({extension: 'png'}))
                .setFooter({text: `${newLanguage("FOOTER")}`, iconURL: "https://media.discordapp.net/attachments/1037588833274961920/1037629356677279764/QuantumPFP.png?width=657&height=657"})
                .setFields(
                        {name: '<:ID:1039241966690504705> ID', value: `\`${Id}\``, inline: true},
                        {name: '<:ID:1039241966690504705> Roles', value: `${memberRoles}`, inline: true},
                        {name: '<:Calendar:1039241983820058755> Joined at', value: `<t:${Math.round( joinedAt/ 1000)}:R>`}
                        )
                interaction.reply({embeds: [userEmbed], ephemeral: true})
            }
        } userActions();
    },
};