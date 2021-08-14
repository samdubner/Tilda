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

    client.destroy();
    console.log(
      `${interaction.member.displayName} has destroyed the client, updating local repository...`
    );
    execSync("git pull --ff-only");
    console.log("Exiting node process...");
    process.exit(0);
  },
};
