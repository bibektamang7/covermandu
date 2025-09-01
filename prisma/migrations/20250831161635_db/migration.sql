-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT[],
    "price" DOUBLE PRECISION NOT NULL,
    "discount" INTEGER,
    "availableQuantity" INTEGER NOT NULL,
    "colors" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "stars" SMALLINT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cart" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Wishlist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "Product_name_idx" ON "public"."Product"("name");

-- CreateIndex
CREATE INDEX "Product_price_idx" ON "public"."Product"("price");

-- CreateIndex
CREATE INDEX "Product_availableQuantity_idx" ON "public"."Product"("availableQuantity");

-- CreateIndex
CREATE INDEX "Review_productId_idx" ON "public"."Review"("productId");

-- CreateIndex
CREATE INDEX "Review_reviewerId_idx" ON "public"."Review"("reviewerId");

-- CreateIndex
CREATE INDEX "Cart_userId_idx" ON "public"."Cart"("userId");

-- CreateIndex
CREATE INDEX "Cart_productId_idx" ON "public"."Cart"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_productId_key" ON "public"."Cart"("userId", "productId");

-- CreateIndex
CREATE INDEX "Wishlist_userId_idx" ON "public"."Wishlist"("userId");

-- CreateIndex
CREATE INDEX "Wishlist_productId_idx" ON "public"."Wishlist"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_userId_productId_key" ON "public"."Wishlist"("userId", "productId");

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cart" ADD CONSTRAINT "Cart_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Wishlist" ADD CONSTRAINT "Wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Wishlist" ADD CONSTRAINT "Wishlist_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
