const TelegramBot = require("node-telegram-bot-api");

// replace the value below with the Telegram token you receive from @BotFather
const master_token = process.env.TELEGRAM_MASTER_TOKEN;
const error_token = process.env.TELEGRAM_ERROR_TOKEN;

// Create a bot that uses 'polling' to fetch new updates

export async function sendTelegramMaster(message) {
  const bot = new TelegramBot(master_token, { polling: false });

  bot.sendMessage(process.env.TELEGRAM_MASTER_CHANNEL, message);
}

export async function sendTelegramError(message) {
  const bot = new TelegramBot(error_token, { polling: false });

  bot.sendMessage(process.env.TELEGRAM_ERROR_TOKEN, message);
}
