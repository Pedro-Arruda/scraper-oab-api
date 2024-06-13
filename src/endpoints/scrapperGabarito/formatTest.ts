import axios from "axios";
import pdf from "pdf-parse";

export const formatAnswerSheet = async (urlTest: string) => {
  const questionsWithAnswers: any = {};

  const response = await axios.get(urlTest, {
    responseType: "arraybuffer",
  });

  const data = await pdf(response.data, { max: 21 });

  const answersTest4 = data.text
    .split("EXAME DE ORDEM UNIFICADO - TIPO 4")[1]
    .split("CONSELHO FEDERAL DA ORDEM DOS ADVOGADOS DO BRASIL")[0];

  const lines = answersTest4
    .split("\n")
    .filter((line) => line != "(*) Questão anulada")
    .filter((line) => line != "(*) Questão anulada ")
    .filter(Boolean)
    .filter((line) => line != "")
    .filter((line) => line != " ");

  const splittedLines = lines.map((line) =>
    line.split(" ").filter((line) => line != ""),
  );

  for (let i = 0; i < splittedLines.length; i += 2) {
    const currentArrayAnswers = splittedLines[i];

    for (let k = 0; k < currentArrayAnswers.length; k++) {
      questionsWithAnswers[currentArrayAnswers[k]] = splittedLines[i + 1][k];
    }
  }

  return questionsWithAnswers;
};
