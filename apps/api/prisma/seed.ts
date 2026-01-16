import { PrismaClient, UserRole } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  const superTenant = await prisma.tenant.upsert({
    where: { id: "super-tenant" },
    update: {},
    create: {
      id: "super-tenant",
      name: "Super Tenant",
      status: "ACTIVE",
    },
  });

  const superPassword = await argon2.hash("superadmin123");

  await prisma.user.upsert({
    where: { email: "superadmin@sebelasindonesia.app" },
    update: {},
    create: {
      email: "superadmin@sebelasindonesia.app",
      passwordHash: superPassword,
      role: UserRole.OWNER,
      tenantId: superTenant.id,
    },
  });

  const demoTenant = await prisma.tenant.upsert({
    where: { id: "demo-tenant" },
    update: {},
    create: {
      id: "demo-tenant",
      name: "Demo Tenant",
      status: "ACTIVE",
    },
  });

  const demoPassword = await argon2.hash("demo12345");

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@sebelasindonesia.app" },
    update: {},
    create: {
      email: "demo@sebelasindonesia.app",
      passwordHash: demoPassword,
      role: UserRole.OWNER,
      tenantId: demoTenant.id,
    },
  });

  const store = await prisma.store.upsert({
    where: { slug: "demo-store" },
    update: {},
    create: {
      name: "Demo Store",
      slug: "demo-store",
      tenantId: demoTenant.id,
      timezone: "Asia/Jakarta",
      currency: "IDR",
    },
  });

  const category = await prisma.category.create({
    data: {
      name: "Beverages",
      slug: "beverages",
      tenantId: demoTenant.id,
      storeId: store.id,
    },
  });

  const product = await prisma.product.create({
    data: {
      name: "Es Kopi Susu",
      slug: "es-kopi-susu",
      description: "Kopi susu segar",
      tenantId: demoTenant.id,
      storeId: store.id,
      categoryId: category.id,
    },
  });

  await prisma.price.create({
    data: {
      tenantId: demoTenant.id,
      productId: product.id,
      currency: "IDR",
      amount: 18000,
    },
  });

  await prisma.inventory.create({
    data: {
      tenantId: demoTenant.id,
      productId: product.id,
      sku: "SKU-ESKOPI-001",
      stockQty: 20,
    },
  });

  await prisma.paymentProvider.upsert({
    where: { code: "mock" },
    update: { isEnabled: true },
    create: { code: "mock", isEnabled: true },
  });

  console.log("Seed complete", { superTenant, demoUser, store });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
