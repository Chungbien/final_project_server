var axios = require('axios').default;
const userService = require('./user');
const errorCodes = require('../constants/errors');
const CustomError = require('../common/CustomError');
const BotModel = require('../models/bot');
const messageService = require('./message');

const replyMessage = async (data) => {
    const { appId, senderId, eventName, message, msgId } = data;
    const bot = await BotModel.findOne({ app_id: appId, deleteFlag: false });
    if (!bot) throw new CustomError(errorCodes.BOT_NOT_EXISTS);
    const user = await userService.findOrCreateUser({
        userAppId: senderId,
        botId: bot._id,
        tokenApp: bot.tokenApp,
    });
    // có thể là có hoặc chưa có session
    // nếu là user mới hoàn toàn thì chắc chắn là chưa có
    const replyMessage = messageService.sendMessage({
        event_name: eventName,
        messageText: message,
        bot,
        user,
        msgId
    });
};
module.exports = { replyMessage };