import db from "@/database/db";
import { users } from "@/database/schema";
import { eq, or } from "drizzle-orm";
import { select, input, password, Separator } from "@inquirer/prompts";
import chalk from "chalk";
import { HashPassword } from "@/lib/bcrypt";

async function main() {
  console.clear();
  const roleSelect = await select({
    message: "Select role user who want to reset password\n",
    choices: [
      {
        name: "Role | Admin",
        value: "admin",
      },
      {
        name: "Role | Mentor",
        value: "mentor",
      },
      {
        name: "Role | Participant",
        value: "participant",
      },
      new Separator(),
      {
        name: "Exit",
        value: "exit",
      },
    ],
  });

  let queryWhere = null;
  if (roleSelect === "admin") {
    queryWhere = or(eq(users.role, "admin"), eq(users.role, "default-admin"));
  } else if (roleSelect === "mentor") {
    queryWhere = or(eq(users.role, "mentor"), eq(users.role, "mentor-high"));
  } else if (roleSelect === "participant") {
    queryWhere = eq(users.role, "participant");
  }
  if (roleSelect === "exit") {
    console.clear();
    console.log(chalk.green("✓ ") + "bye!");
    process.exit(0);
  }

  searchUser(queryWhere);
}

async function searchUser(queryWhere) {
  console.clear();
  console.log(chalk.bold(" [Searching] → [Searching User]"));
  console.log(chalk.gray("\n Fetching database..."));
  const user = await db.query.users.findMany({
    where: queryWhere,
  });
  console.clear();
  console.log(" " + chalk.green("✓ ") + "Success fetching database!");
  const selectUsername = await select({
    message: "Select account who want to reset password\n",
    choices: [
      ...user.map((user) => {
        return {
          name: `${user.fullname} (${user.username}) - ${user.email}`,
          value: user.username,
        };
      }),
      new Separator(),
      {
        name: "Refresh",
        value: "refresh",
      },
      {
        name: "Back",
        value: "back",
      },
    ],
  });
  if (selectUsername === "refresh") {
    searchUser(queryWhere);
  } else if (selectUsername === "back") {
    main();
  } else {
    resetPassword(selectUsername);
  }
}

async function resetPassword(username) {
  console.clear();
  console.log(chalk.bold(" [Reset Password] → [Reset Password]"));
  console.log(chalk.gray("\n Resetting password..."));
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });
  if (!user) {
    console.clear();
    console.log(" " + chalk.red("✗ ") + "User not found!");
    main();
    return;
  }
  const newPassword = await password({
    message: "Enter new password:",
    mask: "*",
    required: true,
  });
  const confirmPassword = await password({
    message: "Confirm new password:",
    mask: "*",
    required: true,
  });
  if (newPassword !== confirmPassword) {
    console.clear();
    console.log(" " + chalk.red("✗ ") + "Password does not match!");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    resetPassword(username);
    return;
  }
  console.clear();
  await db
    .update(users)
    .set({
      password: await HashPassword(newPassword),
      updated_at: new Date(),
    })
    .where(eq(users.username, username));
  console.log(" " + chalk.green("✓ ") + "Success resetting password!");
  await new Promise((resolve) => setTimeout(resolve, 5000));
  main();
}

main();
