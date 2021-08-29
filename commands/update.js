const { execSync } = require("child_process");

module.exports = {
  name: "update",
  description: "updates tilda to the latest version! (authorized users only)",
  async execute(interaction) {
    if (
      !["340002869912666114", "171330866189041665"].includes(
        interaction.user.id
      )
    )
    return;

    interaction.reply({content: "The bot is updating...", ephemeral: true})

    interaction.client.destroy();
    console.log(
      `${interaction.member.displayName} has destroyed the client, updating local repository...`
    );
    execSync("sudo git pull --ff-only");
    console.log("Exiting node process...");
    process.exit(0);
  },
};
