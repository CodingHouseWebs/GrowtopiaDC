module.exports = {
    name: 'help',
    description: 'List all available commands or get help for a specific command',
    execute(message, args) {
        const prefix = '!';    
        if (!args.length) {
            message.channel.send('Available categories:\n- Guild\n- Daily\n- World');
            return;
        }
        const category = args[0].toLowerCase();
        switch (category) {
            case 'guild':
                message.channel.send(`Guild commands:\n${prefix}createguild <guildname> - Create a guild\n${prefix}invite <user> - Invite a user to the guild\n${prefix}promote <user> <role> - Promote a user in the guild`);
                break;
            case 'daily':
                message.channel.send(`Daily commands:\n${prefix}daily - Claim daily gems\n${prefix}trivia - Answer a daily Growtopia trivia question`);
                break;
            case 'world':
                message.channel.send(`World commands:\n${prefix}joinworld <worldname> - Join a world\n${prefix}lock <worldname> - Lock a world\n${prefix}give <item> <count> <user> - Give items to a user`);
                break;
            default:
                message.channel.send('Invalid category. Available categories are: Guild, Daily, World');
        }
    },
};