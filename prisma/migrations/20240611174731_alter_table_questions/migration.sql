/*
  Warnings:

  - You are about to drop the column `alternativeA` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `alternativeB` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `alternativeC` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `alternativeD` on the `questions` table. All the data in the column will be lost.
  - Added the required column `alternative_a` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alternative_b` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alternative_c` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alternative_d` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `answer` to the `questions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "questions" DROP COLUMN "alternativeA",
DROP COLUMN "alternativeB",
DROP COLUMN "alternativeC",
DROP COLUMN "alternativeD",
ADD COLUMN     "alternative_a" TEXT NOT NULL,
ADD COLUMN     "alternative_b" TEXT NOT NULL,
ADD COLUMN     "alternative_c" TEXT NOT NULL,
ADD COLUMN     "alternative_d" TEXT NOT NULL,
ADD COLUMN     "answer" TEXT NOT NULL;
