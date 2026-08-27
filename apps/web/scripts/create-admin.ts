import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

const SALT_ROUNDS = 12;

const ADMIN = {
  name: "EmsiFoods Admin",
  email: "admin@emsifoods.com",
  password: "Admin@123456",
};

async function main() {
  const email = ADMIN.email.trim().toLowerCase();

  const hashedPassword = await bcrypt.hash(
    ADMIN.password,
    SALT_ROUNDS
  );

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    const user = await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        name: ADMIN.name,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("Existing user updated as ADMIN:");
    console.log({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return;
  }

  const user = await prisma.user.create({
    data: {
      name: ADMIN.name,
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin user created successfully:");
  console.log({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
}

main()
  .catch((error) => {
    console.error("Failed to create admin:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });