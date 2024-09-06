import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Créer des utilisateurs
  const user1 = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
      role: "buyer",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      password: "password123",
      role: "seller",
    },
  });

  // Créer un garage
  const garage = await prisma.garage.create({
    data: {
      name: "Super Garage",
      address: "123 Main St",
      phone: "123-456-7890",
      ownerId: user2.id,
    },
  });

  // Créer une voiture
  const car = await prisma.car.create({
    data: {
      make: "Toyota",
      model: "Corolla",
      year: 2020,
      vin: "1HGCM82633A123456",
    },
  });

  // Créer une annonce
  const ad = await prisma.ad.create({
    data: {
      carId: car.id,
      garageId: garage.id,
      price: 15000.0,
      description: "A great car in excellent condition.",
    },
  });

  // Créer une offre
  const offer = await prisma.offer.create({
    data: {
      adId: ad.id,
      userId: user1.id,
      offerAmount: 14000.0,
      status: "pending",
    },
  });

  // Créer une transaction
  const transaction = await prisma.transaction.create({
    data: {
      carId: car.id,
      buyerId: user1.id,
      sellerId: user2.id,
      price: 14000.0,
    },
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
