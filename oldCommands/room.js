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
      changeCategoryPrivacy(message, false);
      break;
    case "public":
      changeCategoryPrivacy(message, true);
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

  let mentionedUsers = message.mentions.users.filter(
    (user) => user.id != message.author.id
  );

  mentionedUsers.each((user) => {
    category
      .updateOverwrite(user.id, {
        VIEW_CHANNEL: true,
        READ_MESSAGE_HISTORY: true,
      })
      .then((categoryChannel) => {
        categoryChannel.children.each((channel) => {
          channel.lockPermissions().catch(console.error);
        });
      })
      .catch(console.error);
  });

  const notifyEmbed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle("Room status")
    .setDescription(
      `Added \`${message.mentions.users.size}\` user(s) to the room`
    );

  message.reply(notifyEmbed);
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

  let mentionedUsers = message.mentions.users.filter(
    (user) => user.id != message.author.id
  );

  if (mentionedUsers.size <= 0) {
    message.reply("You must remove one user besides yourself...");
    return;
  }

  mentionedUsers.each((user) => {
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

  const notifyEmbed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle("Room status")
    .setDescription(
      `Removed \`${message.mentions.users.size}\` user(s) from the room`
    );

  message.reply(notifyEmbed);
};

const changeCategoryPrivacy = async (message, privacy) => {
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
      VIEW_CHANNEL: privacy,
    })
    .then((categoryChannel) => {
      categoryChannel.children.each((channel) => {
        channel.lockPermissions().catch(console.error);
      });

      notifyStatus(message, privacy);
    })
    .catch(console.error);
};

const notifyStatus = (message, status) => {
  status = status === true ? "public" : "private";

  const notifyEmbed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle("Room status")
    .setDescription(
      `${message.member.displayName}'s room was changed to \`${status}\``
    );

  message.reply(notifyEmbed);
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

  let permissionOverwrites = [
    {
      id: message.guild.roles.everyone,
      deny: ["VIEW_CHANNEL"],
    },
    {
      id: message.author.id,
      allow: [
        "MANAGE_CHANNELS",
        "VIEW_CHANNEL",
        "READ_MESSAGE_HISTORY",
        "MANAGE_MESSAGES",
        "MUTE_MEMBERS",
        "DEAFEN_MEMBERS",
      ],
    },
  ];

  let categoryOptions = {
    type: "category",
    permissionOverwrites,
  };

  let category = await message.guild.channels.create(
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
    userLimit: 99,
  };

  let textChannel = await message.guild.channels.create(
    `text-chat`,
    textChatOptions
  );

  let voiceChannel = await message.guild.channels.create(
    `voice-chat`,
    voiceChatOptions
  );

  await textChannel.lockPermissions();
  await voiceChannel.lockPermissions();

  textChannel.send("Welcome to your new room!").catch(console.error);

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
