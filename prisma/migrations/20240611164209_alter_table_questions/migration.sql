/*
  Warnings:

  - Added the required column `alternativeA` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alternativeB` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alternativeC` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alternativeD` to the `questions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "alternativeA" TEXT NOT NULL,
ADD COLUMN     "alternativeB" TEXT NOT NULL,
ADD COLUMN     "alternativeC" TEXT NOT NULL,
ADD COLUMN     "alternativeD" TEXT NOT NULL,
ALTER COLUMN "test" DROP NOT NULL;
