module.exports = async ({ message, context, next }) => {
  if (context.botUserId === undefined) {
    throw new ContextMissingPropertyError(
      'botUserId',
      'Cannot match direct mentions of the app without a bot user ID. Ensure authorize callback returns a botUserId.',
    );
  }

  if (message.text === undefined) {
    await next();
  }

  const botMention = `<@${context.botUserId}>`
  const text = message.text.trim();
  if (text.startsWith(botMention)) {
    return;
  }

  await next();
};
