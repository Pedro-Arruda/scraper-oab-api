-- CreateTable
CREATE TABLE "questions" (
    "questionId" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subcategory" TEXT NOT NULL,
    "test" TEXT NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("questionId")
);
