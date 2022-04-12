const Discord = require("discord.js");

const gameFunctions = require("../game/gameFunctions.js");
const channels = require("../../config/channels.json");
const roles = require("../../config/roles.json");

module.exports.run = async (interaction) => {
    let ign = interaction.options.getString("ign");
    let user = interaction.options.getUser("user");
    let isDb = await gameFunctions.isInDb(user.id);
    if (interaction.member.roles.cache.has(roles.staff)) {
        if (!isDb) {
            const errorEmbed = new Discord.EmbedBuilder()
                .setColor('#a84040')
                .setDescription("<@" + user.id + "> is not in the database.")
                .setTimestamp();
            interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        } else {
            await gameFunctions.updateIGN(user.id, ign);
            await gameFunctions.fixRoles(interaction, user.id);
            await gameFunctions.fixName(interaction, user.id);
            const successEmbed = new Discord.EmbedBuilder()
                .setColor('#36699c')
                .setDescription("<@" + user.id + "> is now renamed as " + ign + ".")
                .setTimestamp();
            interaction.reply({ embeds: [successEmbed] });
        }
    } else {
        const errorEmbed = new Discord.EmbedBuilder()
            .setColor('#a84040')
            .setDescription("You don't have permission to use this command!")
            .setTimestamp();
        interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
}