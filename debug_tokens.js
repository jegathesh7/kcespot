const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const users = await User.find({});
    console.log(`Total users: ${users.length}`);

    console.log("---------------------------------------------------");
    users.forEach((user) => {
      console.log(
        `User: ${user.name} (${user.email}) | Status: ${user.status} | Tokens: ${user.pushTokens ? user.pushTokens.length : 0}`,
      );
      if (user.pushTokens && user.pushTokens.length > 0) {
        console.log(`   Tokens: ${JSON.stringify(user.pushTokens)}`);
      }
    });
    console.log("---------------------------------------------------");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
