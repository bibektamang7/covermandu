/*
  Warnings:

  - A unique constraint covering the columns `[userId,productVariantId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productVariantId` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "public"."Cart" DROP CONSTRAINT "Cart_productId_fkey";

-- DropIndex
DROP INDEX "public"."Cart_productId_idx";

-- DropIndex
DROP INDEX "public"."Cart_userId_productId_key";

-- AlterTable
ALTER TABLE "public"."Cart" ADD COLUMN     "productVariantId" TEXT NOT NULL,
ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'USER';

-- CreateIndex
CREATE INDEX "Cart_productVariantId_idx" ON "public"."Cart"("productVariantId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_productVariantId_key" ON "public"."Cart"("userId", "productVariantId");

-- AddForeignKey
ALTER TABLE "public"."Cart" ADD CONSTRAINT "Cart_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "public"."ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cart" ADD CONSTRAINT "Cart_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
