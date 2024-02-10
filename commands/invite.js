const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'invite',
    description: 'Invite a user to the guild',
    execute(message, args) {
        const userId = message.author.id;
        const guildName = getGuildName(userId);
        if (!guildName) {
            message.reply('You are not a member of any guild.');
            return;
        }
        const guildDataPath = path.join(__dirname, '..', 'guilddata', `${guildName}.json`);
        if (!fs.existsSync(guildDataPath)) {
            message.reply('Failed to find guild data.');
            return;
        }
        const guildData = JSON.parse(fs.readFileSync(guildDataPath));
        if (guildData.leader !== userId) {
            message.reply('You do not have permission to invite users to the guild.');
            return;
        }
        const targetUserId = args[0];
        const targetUserDataPath = path.join(__dirname, '..', 'userdata', `${targetUserId}.json`);
        if (!fs.existsSync(targetUserDataPath)) {
            message.reply('The user you are trying to invite does not exist.');
            return;
        }
        const targetUserData = JSON.parse(fs.readFileSync(targetUserDataPath));
        if (targetUserData.guild === guildName) {
            message.reply('The user is already a member of the guild.');
            return;
        }
        message.reply(`Invited user ${targetUserId} to the guild.`);
    },
};

function getGuildName(userId) {
    const userDataPath = path.join(__dirname, '..', 'userdata', `${userId}.json`);
    if (!fs.existsSync(userDataPath)) {
        return null;
    }
    const userData = JSON.parse(fs.readFileSync(userDataPath));
    return userData.guild || null;
}