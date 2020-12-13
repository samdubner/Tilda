const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "user", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite",
});

const UserRoles = sequelize.define("userRoles", {
  userId: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  roleName: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
});

let sync = () => UserRoles.sync();

let role = (message, args) => {
    message.reply("Under Construction")
};

module.exports = {
  role,
  sync
};
