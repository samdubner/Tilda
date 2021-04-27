const MessageEmbed = require("discord.js").MessageEmbed;
5;

const coin = require("./coin");
const User = require("../models/User");

const channelManager = (message, args) => {
  let primaryArg = args.split(" ")[0].toLowerCase();
  switch (primaryArg) {
    case "start":
      createCategory(message);
      break;
    case "end":
      removeCategory(message);
      break;
    case "private":
      privateCategory(message);
      break;
    case "add":
      addUsersToRoom(message);
      break;
    case "remove":
      removeUsersFromRoom(message);
      break;
    default:
      message.reply("Please provide a valid argument for this command");
  }
};

const addUsersToRoom = async (message) => {
  let user = await User.findOne({ userId: message.author.id });

  if (!user) {
    user = await coin.createUser(message);
  }

  if (!user.categoryId) {
    message.reply("You have to create a room before you can add users!");
    return;
  }

  let category = await message.guild.channels.resolve(user.categoryId);

  message.mentions.users.each((user) => {
    category
      .updateOverwrite(user.id, {
        VIEW_CHANNEL: true,
        READ_MESSAGE_HISTORY: true
      })
      .then((categoryChannel) => {
        categoryChannel.children.each((channel) => {
          channel.lockPermissions().catch(console.error);
        });
      })
      .catch(console.error);
  });
};

const removeUsersFromRoom = async (message) => {
  let user = await User.findOne({ userId: message.author.id });

  if (!user) {
    user = await coin.createUser(message);
  }

  if (!user.categoryId) {
    message.reply(
      "You have to create a room before you can set it as private!"
    );
    return;
  }


  let category = await message.guild.channels.resolve(user.categoryId);

  message.mentions.users.each((user) => {
    category
      .updateOverwrite(user.id, {
        VIEW_CHANNEL: false,
      })
      .then((categoryChannel) => {
        categoryChannel.children.each((channel) => {
          channel.lockPermissions().catch(console.error);
        });
      })
      .catch(console.error);
  });
};

const privateCategory = async (message) => {
  let user = await User.findOne({ userId: message.author.id });

  if (!user) {
    user = await coin.createUser(message);
  }

  if (!user.categoryId) {
    message.reply(
      "You have to create a room before you can set it as private!"
    );
    return;
  }

  let category = await message.guild.channels.resolve(user.categoryId);

  category
    .updateOverwrite(message.guild.roles.everyone, {
      VIEW_CHANNEL: false,
    })
    .then((categoryChannel) => {
      categoryChannel.children.each((channel) => {
        channel.lockPermissions().catch(console.error);
      });
    })
    .catch(console.error);
};

const createCategory = async (message) => {
  let user = await User.findOne({ userId: message.author.id });

  if (!user) {
    user = await coin.createUser(message);
  }

  if (user.categoryId) {
    message.reply(
      "You already have a room started, you may only have one room at a time!"
    );
    return;
  }

  let guild = message.guild;

  let categoryOptions = {
    type: "category",
  };

  let category = await guild.channels.create(
    `${message.member.displayName}'s Room`,
    categoryOptions
  );

  let textChatOptions = {
    type: "text",
    parent: category.id,
  };

  let voiceChatOptions = {
    type: "voice",
    parent: category.id,
    limit: 99,
  };

  let textChannel = await guild.channels.create(`text-chat`, textChatOptions);

  let voiceChannel = await guild.channels.create(
    `voice-chat`,
    voiceChatOptions
  );

  let ownerManageChannels = {
    id: message.author.id,
    allow: ["MANAGE_CHANNELS", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "MANAGE_MESSAGES"],
  };

  let allowEveryone = {
    id: message.guild.roles.everyone,
    allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
  };

  category
    .overwritePermissions([allowEveryone, ownerManageChannels])
    .then(() => {
      textChannel.lockPermissions();
      voiceChannel.lockPermissions();
    });

  user.categoryId = category.id;
  user.save();
};

const removeCategory = async (message) => {
  let user = await User.findOne({ userId: message.author.id });

  if (!user) {
    user = await coin.createUser(message);
  }

  if (!user.categoryId) {
    message.reply("You haven't started a room, there is nothing to close!");
    return;
  }

  let category = await message.guild.channels.resolve(user.categoryId);

  category.children.each((channel) => {
    channel.delete().catch(console.error);
  });

  category
    .delete()
    .then(() => {
      user.categoryId = undefined;
      user.save();
    })
    .catch(console.error);
};

module.exports = { channelManager };
