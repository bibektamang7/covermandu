import { PrismaClient, PhoneModel, Category } from "@prisma/client";

const prisma = new PrismaClient();

export { prisma, PhoneModel, Category };
