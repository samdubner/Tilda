const MessageEmbed = require("discord.js").MessageEmbed;

const coin = require("./coinHelper");
const User = require("../models/User");

const createCategory = async (interaction) => {
  let user = await coin.checkInteraction(interaction);

  if (user.categoryId) {
    interaction.reply({
      content:
        "You already have a room started, you may only have one room at a time!",
      ephemeral: true,
    });
    return;
  }

  let permissionOverwrites = [
    {
      id: interaction.guild.roles.everyone,
      deny: ["VIEW_CHANNEL"],
    },
    {
      id: interaction.user.id,
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

  let category = await interaction.guild.channels.create(
    `${interaction.member.displayName}'s Room`,
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

  let textChannel = await interaction.guild.channels.create(
    `text-chat`,
    textChatOptions
  );

  let voiceChannel = await interaction.guild.channels.create(
    `voice-chat`,
    voiceChatOptions
  );

  await textChannel.lockPermissions();
  await voiceChannel.lockPermissions();

  textChannel
    .send(`<@${interaction.user.id}> Welcome to your new room!`)
    .catch(console.error);

  user.categoryId = category.id;
  user.save();
};

const removeCategory = async (interaction) => {
  let user = await coin.checkInteraction(interaction);

  if (!user.categoryId) {
    interaction.reply({
      content: "You haven't started a room, there is nothing to close!",
      ephemeral: true,
    });
    return;
  }

  let category = await interaction.guild.channels.resolve(user.categoryId);

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

const changeCategoryPrivacy = async (interaction, privacy) => {
  let user = await coin.checkInteraction(interaction);

  if (!user.categoryId) {
    interaction.reply({
      content: "You have to create a room before you can set it as private!",
      ephemeral: true,
    });
    return;
  }

  let category = await interaction.guild.channels.resolve(user.categoryId);

  category
    .updateOverwrite(interaction.guild.roles.everyone, {
      VIEW_CHANNEL: privacy,
    })
    .then((categoryChannel) => {
      categoryChannel.children.each((channel) => {
        channel.lockPermissions().catch(console.error);
      });

      notifyStatus(interaction, privacy);
    })
    .catch(console.error);
};

const notifyStatus = (interaction, status) => {
  status = status === true ? "public" : "private";

  const notifyEmbed = new MessageEmbed()
    .setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .setTitle("Room status")
    .setDescription(
      `${interaction.member.displayName}'s room was changed to \`${status}\``
    );

  interaction.reply({ embeds: [notifyEmbed] });
};

module.exports = {
  createCategory,
  removeCategory,
  changeCategoryPrivacy,
};
