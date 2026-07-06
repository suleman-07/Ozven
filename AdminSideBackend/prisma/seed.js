const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: "admin@example.com" },
  });

  if (existingAdmin) {
    console.log("Default admin already exists. Seed skipped.");
    return;
  }

  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  await prisma.admin.create({
    data: {
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
    },
  });

  console.log("Default admin created successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
