import { endpoint } from "@ev-fns/endpoint";

import { getURLAnswerSheet } from "./getAnswerSheet";
import { formatAnswerSheet } from "./formatTest";
import { prisma } from "../../functions/prisma";

export const scrapperGabarito = endpoint(async (req, res) => {
  const updatedQuestions = [];
  const test = "41º EXAME DE ORDEM UNIFICADO";

  const urlAnswerSheet = await getURLAnswerSheet();

  if (!urlAnswerSheet) {
    res.send("Answer Sheet not found");
    return;
  }

  const answers = await formatAnswerSheet(urlAnswerSheet);

  for (const [key, value] of Object.entries(answers)) {
    const question = await prisma.question.findFirst({
      where: { test, questionNumber: Number(key) },
    });

    if (question) {
      await prisma.question.update({
        data: { answer: `alternative${value}` },
        where: { questionId: question.questionId },
      });

      updatedQuestions.push(question);
    }
  }

  res.send(updatedQuestions);
});
