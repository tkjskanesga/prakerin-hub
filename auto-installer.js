import yaml from "yaml";
import chalk from "chalk";
import waitOn from "wait-on";
import { input, select, password } from "@inquirer/prompts";
import { execSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

import { users as usersSchema } from "./src/database/schema/users";
import { institutions as institutionsSchema } from "./src/database/schema/institutions";
import db from "./src/database/db";
import { HashPassword } from "@/lib/bcrypt";

const __filename = url.fileURLToPath(import.meta.url);

function randomPassword(prefix = "") {
  return prefix
    ? prefix + crypto.randomBytes(8).toString("hex")
    : crypto.randomBytes(8).toString("hex");
}
function generateJwtAndSeishiroPasskey() {
  return {
    jwt: `jwt|hex:base64url|${crypto.randomBytes(16).toString("hex")}:${crypto.randomBytes(32).toString("base64url")}`,
    seishiro: `seishiro|hex:base64url|${crypto.randomBytes(12).toString("hex")}:${crypto.randomBytes(24).toString("base64url")}`,
  };
}
function check_docker() {
  try {
    execSync("docker --version", {
      stdio: "ignore",
      shell: true,
    });
    return true;
  } catch (error) {
    return false;
  }
}
function check_podman() {
  try {
    execSync("podman --version", {
      stdio: "ignore",
      shell: true,
    });
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  const isBunRuntime = process.argv[0].match("bun");
  if (process.argv.includes("--need-interactive-io")) {
    execSync(`${isBunRuntime ? "bun" : "node"} ${__filename}`, {
      stdio: "inherit",
      shell: true,
    });
    return;
  }

  console.log(`
 _____         _           _        _____     _   
|  _  |___ ___| |_ ___ ___|_|___   |  |  |_ _| |_ 
|   __|  _| .'| '_| -_|  _| |   |  |     | | | . |
|__|  |_| |__,|_,_|___|_| |_|_|_|  |__|__|___|___|

Sederhanakan Administrasi, Maksimalkan Potensi Praktik!
Repo: ${chalk.underline(chalk.gray("https://github.com/tkjskanesga/prakerin-hub"))}
                                                  `);
  // Generate JWT and Seishiro Passkey
  console.log(chalk.bold(" [Checking] → [Generate JWT & Seishiro Passkey]"));
  const jwt_and_seishiro_passkey = generateJwtAndSeishiroPasskey();
  console.log(
    chalk.green("✓ ") +
      "Seishiro Passkey : " +
      jwt_and_seishiro_passkey.seishiro,
  );
  console.log(
    chalk.green("✓ ") + "Jsonwebtoken     : " + jwt_and_seishiro_passkey.jwt,
  );

  console.log(chalk.bold("\n [Checking] → [Checking Runtime]"));
  console.log(
    chalk.green("✓ ") + "Runtime : " + (isBunRuntime ? "🍞 Bun" : "📦 Node"),
  );

  // Check docker/podman installation
  console.log(chalk.bold("\n [Checking] → [Checking info]"));
  let process_pwd = process.cwd();
  console.log(chalk.green("✓ ") + "Running at " + chalk.bold(process_pwd));
  console.log(chalk.green("✓ ") + "Self script " + chalk.bold(__filename));
  console.log(chalk.blue("? ") + "Checking docker/podman installation...");
  const docker_check = check_docker();
  const podman_check = check_podman();
  let container_type = null;
  if (docker_check) {
    console.log(chalk.green("✓ ") + "Docker is installed");
    container_type = "docker";
  } else if (podman_check) {
    console.log(chalk.green("✓ ") + "Podman is installed");
    container_type = "podman";
  } else {
    console.log(
      chalk.red(
        "✗ Docker/Podman is not installed!, Please install after this setup is complete!",
      ),
    );
  }

  // Setup Database
  console.log(chalk.bold("\n [Setup] → [Setup Database]"));
  const db_username = await input({
    message: "Username database:",
    default: "prakerinhub",
    required: true,
  });
  const db_password = await input({
    message: "Password database:",
    default: randomPassword("servicesdb"),
    required: true,
  });
  const db_database = await input({
    message: "Database name:",
    default: "prakerinhub",
    required: true,
  });
  console.log(
    chalk.gray("Note: Port database need to be exposed for migration process!"),
  );
  const db_port = await input({
    message: "Database port expose (type none to no expose):",
    default: "5432",
    required: true,
  });
  const db_pgadmin = await input({
    message: "Add pgadmin (type none to no add pgadmin, add set port expose):",
    default: "8420",
    required: true,
  });

  // Setup Minio
  console.log(chalk.bold("\n [Setup] → [Setup Minio]"));
  const minio_username = await input({
    message: "Username minio:",
    default: "prakerinhub",
    required: true,
  });
  const minio_password = await input({
    message: "Password minio:",
    default: randomPassword("servicess3"),
    required: true,
  });
  const minio_bucket = await input({
    message: "Bucket name:",
    default: "prakerinhub",
    required: true,
  });
  const minio_port = await input({
    message: "Minio port expose (type none to no expose):",
    default: "9000",
    required: true,
  });
  const minio_console_port = await input({
    message: "Minio console port expose (type none to no expose):",
    default: "9001",
    required: true,
  });

  // Setup Gotenberg
  console.log(chalk.bold("\n [Setup] → [Setup Gotenberg]"));
  const gotenberg_port = await input({
    message: "Gotenberg port expose (type none to no expose):",
    default: "8080",
    required: true,
  });

  // Setup Cloudflare Turnstile
  console.log(chalk.bold("\n [Setup] → [Setup Cloudflare Turnstile]"));
  console.log(
    chalk.gray(
      "Note: This cloudflare turnstile is required for security reasons, if you don't have one, you can get one for free at https://www.cloudflare.com/products/turnstile/",
    ),
  );
  const turnstile_site_key = await input({
    message: "Cloudflare Turnstile site key:",
    default: "",
    required: true,
  });
  const turnstile_secret_key = await input({
    message: "Cloudflare Turnstile secret key:",
    default: "",
    required: true,
  });

  // Setup App
  console.log(chalk.bold("\n [Setup] → [Setup App]"));
  console.log(
    chalk.gray(
      "Note: If you want to use latest version, type 'latest', if you want to use dev version, type 'dev', if you want to use specific version, type 'specific version'\nCheck more info at: https://github.com/tkjskanesga/prakerin-hub/packages",
    ),
  );
  const app_version = await input({
    message: "What version you want? (latest/dev or specific version)",
    default: "latest",
    required: true,
  });
  const app_port = await input({
    message: "App port expose:",
    default: "3000",
    required: true,
  });
  const app_debug = await input({
    message: "Enable debugging? (Y/N):",
    default: "N",
    required: true,
  });
  const app_autosetupfirst = await input({
    message: "Auto setup application without Wizard GUI? (Y/N):",
    default: "N",
    required: true,
  });
  if (app_autosetupfirst === "Y") {
    console.log(
      chalk.gray(
        "An installation prompt will appear after this to set everything up.",
      ),
    );
    if (!container_type) {
      console.log(
        chalk.red(
          "Oh no, you haven't installed Docker/Podman yet, so this option is not available!",
        ),
      );
    }
  }

  // Setup Docker Compose
  console.log(chalk.bold("\n [Setup] → [Setup Docker Compose]"));
  const docker_compose_file = await input({
    message: "Docker Compose file name:",
    default: "docker-compose.yml",
    required: true,
  });

  // Setup Application First!
  let appsetupwizardcase = null;
  if (app_autosetupfirst === "Y" && !!container_type) {
    console.log(chalk.bold("\n [Setup] → [Setup Application First]"));
    console.log(
      chalk.gray(
        "Ensure that the data is entered correctly, no resumes, if you want to change it, you must change it through the database!",
      ),
    );
    console.log(
      chalk.red(
        "Warning: When entering your password, it will not be displayed automatically, so be careful! Make sure you enter it correctly.",
      ),
    );
    console.log(
      chalk.red(
        "Be careful when creating admin and mentor accounts. If they have similarities, it will automatically create a database conflict, so they cannot be the same! Use different emails and usernames for accounts with different purposes!",
      ),
    );
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const appsetupwizard = {
      admin: {
        fullname: await input({
          message: "Admin Fullname (Display Name):",
          default: "",
          required: true,
        }),
        username: await input({
          message: "Admin Username (username only a-z0-9 and _):",
          default: "",
          required: true,
        }),
        email: await input({
          message: "Admin Email (email only a-z0-9 and _ use '@' and '.'):",
          default: "",
          required: true,
        }),
        password: await password({
          message: "Admin Password:",
          default: "",
          required: true,
        }),
      },
      institution: {
        name: await input({
          message: "Institution/School Name:",
          default: "",
          required: true,
        }),
        address: await input({
          message: "Institution/School Address:",
          default: "",
          required: true,
        }),
        regis_number: await input({
          message:
            "Institution/School Registration Number (NPSN/PT.Code/ID Universitas):",
          default: "",
          required: true,
        }),
        postal_code: await input({
          message: "Institution/School Postal Code:",
          default: "",
          required: true,
        }),
        leader_name: await input({
          message: "Institution/School Leader Name:",
          default: "",
          required: true,
        }),
        web: await input({ message: "Institution/School Web:", default: "" }),
        phone: await input({
          message: "Institution/School Phone:",
          default: "",
        }),
        email: await input({
          message: "Institution/School Email:",
          default: "",
        }),
        subdistrict: await input({
          message: "Institution/School Subdistrict:",
          default: "",
          required: true,
        }),
        type: await select({
          message: "Institution/School Type:",
          choices: [
            { name: "SMK", value: "smk" },
            { name: "SMA", value: "sma" },
            { name: "MA", value: "ma" },
            { name: "SMALB", value: "smalb" },
            { name: "Kuliah", value: "kuliah" },
            { name: "Other", value: "other" },
          ],
          required: true,
        }),
        status: await select({
          message: "Institution/School Status:",
          choices: [
            { name: "Negeri", value: "negeri" },
            { name: "Swasta", value: "swasta" },
            { name: "Universitas", value: "universitas" },
            { name: "Other", value: "other" },
          ],
          required: true,
        }),
      },
      class_seed: {
        label: await input({
          message: "Class Name:",
          default: "",
          required: true,
        }),
        academic_year: await input({
          message: "Class Academic Year (e.g: 2024/2025):",
          default: `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
          required: true,
        }),
      },
      mentor: {
        fullname: await input({
          message: "Mentor/Teacher Full Name:",
          default: "",
          required: true,
        }),
        username: await input({
          message: "Mentor/Teacher Username:",
          default: "",
          required: true,
        }),
        email: await input({
          message: "Mentor/Teacher Email:",
          default: "",
          required: true,
        }),
        password: await password({
          message: "Mentor/Teacher Password:",
          default: "",
          required: true,
        }),
        title: await input({
          message: "Mentor/Teacher Title (e.g: S.Pd, M.Pd, etc):",
          default: "-",
        }),
        specialization: await input({
          message:
            "Mentor/Teacher Specialization (e.g: Computer and Network Engineering, etc):",
          default: "-",
        }),
      },
    };
    appsetupwizardcase = appsetupwizard;
  }

  // Create Docker/Podman Compose
  let structureComposeContainer = {
    services: {
      app: {
        image: "ghcr.io/tkjskanesga/prakerin-hub:" + app_version,
        container_name: "prakerin-hub-app",
        restart: "unless-stopped",
        depends_on: {
          database: {
            condition: "service_healthy",
          },
        },
        environment: [
          // App
          `APP_DEBUG=${app_debug === "Y" ? "true" : "false"}`,
          `APP_JWT_SECRET=${jwt_and_seishiro_passkey.jwt}`,
          `APP_SEISHIRO_PASSKEY=${jwt_and_seishiro_passkey.seishiro}`,
          // Database
          `DB_HOST=database`,
          `DB_PORT=5432`,
          `DB_USERNAME=${db_username}`,
          `DB_PASSWORD=${db_password}`,
          `DB_DATABASE=${db_database}`,
          // Minio
          `S3_ENDPOINT=http://minio:9000`,
          `S3_ACCESS_KEY_ID=${minio_username}`,
          `S3_SECRET_ACCESS_KEY=${minio_password}`,
          `S3_BUCKET=${minio_bucket}`,
          `S3_REGION=us-east-1`,
          `S3_USE_PATH_STYLE_ENDPOINT=true`,
          // Cloudflare Turnstile
          `TURNSTILE_SITE_KEY=${turnstile_site_key}`,
          `TURNSTILE_SECRET_KEY=${turnstile_secret_key}`,
          // Gotenberg
          `GOTENBERG_URL=http://gotenberg:3000`,
        ],
        ports: [`${app_port}:3000`],
        networks: ["prakerin-hub-network"],
      },
      database: {
        image: "postgres:18-alpine",
        container_name: "prakerin-hub-database",
        restart: "unless-stopped",
        environment: [
          `POSTGRES_USER=${db_username}`,
          `POSTGRES_PASSWORD=${db_password}`,
          `POSTGRES_DB=${db_database}`,
        ],
        healthcheck: {
          test: ["CMD-SHELL", `pg_isready -U ${db_username} -d ${db_database}`],
          interval: "5s",
          timeout: "5s",
          retries: "5",
        },
        ports: [db_port === "none" ? undefined : `${db_port}:5432`].filter(
          (a) => a !== undefined,
        ),
        volumes: ["prakerin-hub-data-postgres:/var/lib/postgresql/data"],
        networks: ["prakerin-hub-network"],
      },
      minio: {
        image: "minio/minio:latest",
        container_name: "prakerin-hub-minio",
        restart: "unless-stopped",
        environment: [
          `MINIO_ROOT_USER=${minio_username}`,
          `MINIO_ROOT_PASSWORD=${minio_password}`,
          `MINIO_DEFAULT_BUCKETS=${minio_bucket}`,
        ],
        command: `server /data --address ":${minio_port}" --console-address ":${minio_console_port}"`,
        ports: [
          minio_port === "none" ? undefined : `${minio_port}:${minio_port}`,
          minio_console_port === "none"
            ? undefined
            : `${minio_console_port}:${minio_console_port}`,
        ].filter((a) => a !== undefined),
        volumes: ["prakerin-hub-data-minio:/data"],
        networks: ["prakerin-hub-network"],
      },
      gotenberg: {
        image: "gotenberg/gotenberg:8.26.0",
        container_name: "prakerin-hub-gotenberg",
        restart: "unless-stopped",
        ports: [
          gotenberg_port === "none" ? undefined : `${gotenberg_port}:3000`,
        ].filter((a) => a !== undefined),
        networks: ["prakerin-hub-network"],
      },
    },
    networks: {
      "prakerin-hub-network": {
        driver: "bridge",
      },
    },
    volumes: {
      "prakerin-hub-data-postgres": {},
      "prakerin-hub-data-minio": {},
    },
  };
  if (db_pgadmin != "none") {
    structureComposeContainer.services.pgadmin = {
      image: "dpage/pgadmin4:latest",
      container_name: "prakerin-hub-pgadmin",
      restart: "unless-stopped",
      environment: [
        `PGADMIN_DEFAULT_EMAIL=${db_username}@${db_username}.id`,
        `PGADMIN_DEFAULT_PASSWORD=${db_password}`,
      ],
      ports: [db_pgadmin === "none" ? undefined : `${db_pgadmin}:80`],
      networks: ["prakerin-hub-network"],
      volumes: ["prakerin-hub-data-pgadmin:/var/lib/pgadmin"],
    };
    structureComposeContainer.volumes["prakerin-hub-data-pgadmin"] = {};
  }

  // Build Docker Compose
  const buildStructure = yaml.stringify(structureComposeContainer);
  fs.writeFileSync(
    path.join(process.cwd(), docker_compose_file),
    buildStructure,
  );
  const backupEnv = crypto.randomBytes(16).toString("hex");
  if (fs.existsSync("./.env") && fs.lstatSync("./.env").isFile()) {
    fs.renameSync("./.env", `./.env.${backupEnv}`);
    console.log(chalk.gray(`Backup .env to .env.${backupEnv}`));
  }
  const toFileEnv =
    structureComposeContainer.services.app.environment.join("\n");
  fs.writeFileSync(
    "./.env",
    String(`# Don't share this file to public!\n${toFileEnv}`)
      .replace("DB_HOST=database", "DB_HOST=localhost")
      .replace("DB_PORT=5432", `DB_PORT=${db_port}`)
      .replace(
        "S3_ENDPOINT=http://minio:9000",
        `S3_ENDPOINT=http://localhost:${minio_port}`,
      )
      .replace(
        "GOTENBERG_URL=http://gotenberg:3000",
        `GOTENBERG_URL=http://localhost:${gotenberg_port}`,
      ),
  );

  // All installed manually
  if (!container_type) {
    console.log(chalk.bold("\n [Running] → [Installer can't running]"));
    console.log(
      chalk.red(" You need a docker/podman to run this application!"),
    );
    console.log(chalk.red(" Please install docker/podman first!\n"));
    return;
  }

  // Running docker/podman compose
  const executed = `${container_type} compose -f ${docker_compose_file} up -d`;
  console.log(chalk.bold("\n [Running] → [Running Docker/Podman Compose]"));
  console.log(chalk.gray(`~$ ${executed}\n`));
  execSync(executed, { stdio: "inherit" });

  // Waiting for database to be ready
  console.log(chalk.bold("\n [Waiting] → [Waiting for database to be ready]"));

  await waitOn({
    resources: [`tcp:localhost:${db_port}`],
    timeout: 120000, // 2 minutes
    interval: 1000,
  });
  console.log(chalk.gray(`Waiting warm up for 5 seconds...`));
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Running migration
  const executedMigration = isBunRuntime
    ? "bunx drizzle-kit migrate"
    : "npx drizzle-kit migrate";
  console.log(chalk.bold("\n [Running] → [Running Migration]"));
  console.log(chalk.gray(`~$ ${executedMigration}\n`));
  try {
    execSync(executedMigration, {
      env: {
        ...process.env,
        DB_HOST: "localhost",
        DB_PORT: db_port,
        DB_USER: db_username,
        DB_PASSWORD: db_password,
      },
      shell: true,
      stdio: "inherit",
    });
  } catch (error) {
    console.log(chalk.red("Error running migration:", error));
    console.log(chalk.gray("Try again in 5 seconds..."));
    await new Promise((resolve) => setTimeout(resolve, 5000));
    execSync(executedMigration, {
      env: {
        ...process.env,
        DB_HOST: "localhost",
        DB_PORT: db_port,
        DB_USER: db_username,
        DB_PASSWORD: db_password,
      },
      shell: true,
      stdio: "inherit",
    });
  }

  // Running seed
  if (!!appsetupwizardcase) {
    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log(chalk.bold("\n\n [Running] → [Running Seed]"));
    console.log(chalk.gray(`Copy all to seeder.json...`));
    fs.writeFileSync(
      "./seeder.json",
      JSON.stringify(
        {
          ...appsetupwizardcase,
          admin: {
            ...appsetupwizardcase.admin,
            password: await HashPassword(appsetupwizardcase.admin.password),
          },
          mentor: {
            ...appsetupwizardcase.mentor,
            password: await HashPassword(appsetupwizardcase.mentor.password),
          },
        },
        null,
        2,
      ),
    );
    console.log(chalk.gray(`Seeder.json created successfully!`));

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const executedSeeder = isBunRuntime ? "bun seeder.js" : "node seeder.js";
    console.log(chalk.gray(`~$ ${executedSeeder}\n`));
    execSync(executedSeeder, {
      env: {
        ...process.env,
        DB_HOST: "localhost",
        DB_PORT: db_port,
        DB_USER: db_username,
        DB_PASSWORD: db_password,
      },
      shell: true,
      stdio: "inherit",
    });
  }

  console.log(chalk.bold("\n\n\n [Building] → [Success!]\n"));
  console.log("🎊 Horay!, You have successfully installed Prakerin Hub!");
  console.log("You can access the application at:");
  console.log(`http://localhost:${app_port}`);

  console.log(`\n✨ Don't forget support us by giving a star on our github!`);
  console.log(`https://github.com/tkjskanesga/prakerin-hub\n`);
}

main();
