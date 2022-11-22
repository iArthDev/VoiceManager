const { Events, ReactionUserManager, AttachmentBuilder, EmbedBuilder} = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

 const fs = require('fs/promises');
 const JSONdb = require('simple-json-db');
 const db = new JSONdb('logs.json');

 const Canvas = require('@napi-rs/canvas');
 const { request } = require('undici');
 let cache = require('memory-cache');


 const applyText = (canvas, text) => {
     const context = canvas.getContext('2d');
     let fontSize = 60;

     do {
         context.font = `${fontSize -= 10}px sans-serif`;
     } while (context.measureText(text).width > canvas.width - 100);

     return context.font;
 };

 const applyTextDisc = (canvas, text) => {
     const context = canvas.getContext('2d');

     let fontSize = 50;

     do {
         context.font = `${fontSize -= 10}px sans-serif`;
     } while (context.measureText(text).width > canvas.width - 100);

     return context.font;
 };

 module.exports = {
 	name: Events.MessageDelete,
 	on: true,
 	async execute(interaction) {
         const data = await fs.readFile('./logs.json', { encoding: 'utf8' });
         if(!data) {
             return;

         } else if( db.has(`${interaction.guild.id}`) ) {
            const activeDataboard = await db.get(`${interaction.guild.id}`);
            interaction.client.channels.fetch(activeDataboard).then(async ch => {
                if(interaction.content === null) {
                    return
                } else {

                    const canvas = Canvas.createCanvas(700, 250);
                    const context = canvas.getContext('2d');
                    const background = await Canvas.loadImage('message.png');
                    context.fillStyle = '#ffffff';

                    context.drawImage(background, 0, 0, canvas.width, canvas.height);
                    context.font = applyText(canvas, interaction.author.tag);
                    context.fillText(interaction.author.username, canvas.width / 4.5, canvas.height / 2.5);
                    context.font = applyTextDisc(canvas, interaction.content);
                    context.fillText(interaction.content, canvas.width / 4.5, canvas.height / 1.5);


                    const { body } = await request(interaction.user.displayAvatarURL({ extension: 'jpg'}));
                    const avatar = await Canvas.loadImage(await body.arrayBuffer());
                    context.drawImage(avatar, 25, 25, 100, 100);
                    context.beginPath();
                    context.arc(100, 75, 50, 0, 2 * Math.PI);
                    context.closePath();
                    context.clip();

                    const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'Deleted Message.png' });

                    const data = await fs.readFile('./local.json', { encoding: 'utf8' });
                    const language = JSON.parse(data);
                    const newLanguage = require(`../../languages/${language[interaction.guild.id] || 'english'}`);

                    const control = new ActionRowBuilder()
                    .addComponents(
                            new ButtonBuilder()
                            .setCustomId('user')
                            .setLabel("User ID")
                            .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                            .setCustomId('timeout')
                            .setLabel("Timeout")
                            .setStyle(ButtonStyle.Danger),
                            new ButtonBuilder()
                            .setCustomId('ban')
                            .setLabel("Ban")
                            .setStyle(ButtonStyle.Danger),
                            );

                    const deletedEmbed = new EmbedBuilder()
                    .setTitle(`${interaction.author.tag} ${newLanguage("USER_DELETED_TITLE")}`)
                    .setDescription(`**\`${interaction.author.id}\` / <@${interaction.author.id}> ${newLanguage("USER_DELETED")}**\n${interaction.content}`)
                    .setColor("ff1c4d")
                    .setFooter({text: `${newLanguage("FOOTER")}`, iconURL: "https://media.discordapp.net/attachments/1037588833274961920/1037629356677279764/QuantumPFP.png?width=657&height=657"})
                    .setThumbnail(interaction.author.displayAvatarURL())



                    cache.put('cachedAuthor', `${interaction.author.id}`);
                    ch.send({embeds: [deletedEmbed], files: [attachment], components: [control]})
                }
            }).catch(err => {
                return interaction.channel.send("Databoard not found")
            })
         }

 	},
 };