/*
  Warnings:

  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the column `productId` on the `Wishlist` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,productVariantId]` on the table `Wishlist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productVariantId` to the `Wishlist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Wishlist" DROP CONSTRAINT "Wishlist_productId_fkey";

-- DropIndex
DROP INDEX "public"."Wishlist_productId_idx";

-- DropIndex
DROP INDEX "public"."Wishlist_userId_productId_key";

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "email" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "public"."Wishlist" DROP COLUMN "productId",
ADD COLUMN     "productVariantId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Wishlist_productVariantId_idx" ON "public"."Wishlist"("productVariantId");

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_userId_productVariantId_key" ON "public"."Wishlist"("userId", "productVariantId");

-- AddForeignKey
ALTER TABLE "public"."Wishlist" ADD CONSTRAINT "Wishlist_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "public"."ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
