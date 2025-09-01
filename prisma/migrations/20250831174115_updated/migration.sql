/*
  Warnings:

  - You are about to drop the column `availableQuantity` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `colors` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Product` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.

*/
-- DropForeignKey
ALTER TABLE "public"."Cart" DROP CONSTRAINT "Cart_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Cart" DROP CONSTRAINT "Cart_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_reviewerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Wishlist" DROP CONSTRAINT "Wishlist_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Wishlist" DROP CONSTRAINT "Wishlist_userId_fkey";

-- DropIndex
DROP INDEX "public"."Product_availableQuantity_idx";

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "availableQuantity",
DROP COLUMN "colors",
DROP COLUMN "image",
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- CreateTable
CREATE TABLE "public"."ProductVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "stock" SMALLINT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cart" ADD CONSTRAINT "Cart_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Wishlist" ADD CONSTRAINT "Wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Wishlist" ADD CONSTRAINT "Wishlist_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
