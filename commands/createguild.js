const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'createguild',
    description: 'Create a guild for 100,000 gems',
    execute(message, args) {
        if (args.length !== 1) {
            message.reply('Please provide a guild name.');
            return;
        }
        const userId = message.author.id;
        const userDataPath = path.join(__dirname, '..', 'userdata', `${userId}.json`);
        const userData = getUserData(userId);
        if (userData.guild) {
            message.reply('You are already a member of another guild.');
            return;
        }
        const guildName = args[0];
        const guildDataPath = path.join(__dirname, '..', 'guilddata', `${guildName}.json`);
        if (fs.existsSync(guildDataPath)) {
            message.reply('A guild with that name already exists.');
            return;
        }
        const userGems = getUserGems(userId);
        if (userGems < 100000) {
            message.reply('You do not have enough gems to create a guild.');
            return;
        }
        deductGems(userId, userDataPath, 100000);
        const guildData = {
            name: guildName,
            leader: userId,
            coLeaders: [],
            elders: [],
            members: [userId],
            level: 1,
        };
        fs.writeFileSync(guildDataPath, JSON.stringify(guildData));
        userData.guild = guildName;
        fs.writeFileSync(userDataPath, JSON.stringify(userData));

        message.reply(`Guild "${guildName}" has been created successfully!`);
    },
};
function getUserGems(userId) {
    const userData = getUserData(userId);
    return userData.gems || 0;
}
function deductGems(userId, userDataPath, amount) {
    const userData = getUserData(userId);
    if (userData.gems && userData.gems >= amount) {
        userData.gems -= amount;
        fs.writeFileSync(userDataPath, JSON.stringify(userData));
    }
}
function getUserData(userId) {
    const userDataPath = path.join(__dirname, '..', 'userdata', `${userId}.json`);
    if (!fs.existsSync(userDataPath)) {
        return {};
    }
    return JSON.parse(fs.readFileSync(userDataPath));
}