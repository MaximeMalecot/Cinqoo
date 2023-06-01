/*
  Warnings:

  - Added the required column `delay` to the `Prestation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Prestation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Prestation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Prestation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner` to the `Prestation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Prestation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeProductId` to the `Prestation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Prestation" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "delay" INTEGER NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "owner" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "revisionNb" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stripeProductId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoriesOnPrestation" (
    "prestationId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CategoriesOnPrestation_pkey" PRIMARY KEY ("categoryId","prestationId")
);

-- AddForeignKey
ALTER TABLE "CategoriesOnPrestation" ADD CONSTRAINT "CategoriesOnPrestation_prestationId_fkey" FOREIGN KEY ("prestationId") REFERENCES "Prestation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnPrestation" ADD CONSTRAINT "CategoriesOnPrestation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
