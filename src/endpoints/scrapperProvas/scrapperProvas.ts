import { endpoint } from "@ev-fns/endpoint";

import { splitArrayIntoChunks } from "../../functions/splitArrayIntoChunks";
import { prisma } from "../../functions/prisma";
import { categorizeQuestions } from "./functions/categorizeQuestions";
import { getURLTest } from "./functions/getURLTest";
import { formatTest } from "./functions/formatTest";

export const scrapperProvas = endpoint(async (req, res) => {
  const urlTest = await getURLTest();

  let count = 0;

  count++;

  if (!urlTest) {
    res.send("PDF da prova não encontrado");
    return;
  }

  const questions = await formatTest(urlTest);

  const arrayOfQuestions = splitArrayIntoChunks(questions, 10);

  console.log(
    `${questions.length} questoes divididas em ${arrayOfQuestions.length} arrays de 10 questoes`,
  );

  const questionWithCategory = await categorizeQuestions(arrayOfQuestions);

  const createManyQuestions = await prisma.question.createMany({
    data: questionWithCategory,
  });

  res.send(createManyQuestions);
});
