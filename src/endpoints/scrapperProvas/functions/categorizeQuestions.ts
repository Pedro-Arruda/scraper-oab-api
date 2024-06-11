import { getAIResponse } from "../../../functions/getAIResponse";
import { sleep } from "../../../functions/sleep";
import { splitQuestion } from "../../../functions/splitQuestion";

const defaultPrompt = `Imagine que você é um advogado com muitos anos de experiência. 
Vou te passar uma questão de direito, não responda a questão, apenas categorize dentro das opções abaixo:
    - Direito Civil
    - Processo Civil
    - Direito Administrativo
    - Direito Constitucional
    - Direito do Trabalho
    - Processo do Trabalho
    - Direito Empresarial
    - Direito Penal
    - Processo Penal
    - Direito Tributário
    - Ética e Estatuto da OAB
    - Direitos Humanos
    - Direito Ambiental
    - Estatuto da Criança e do Adolescente
    - Direito do Consumidor
    - Direito Internacional
    - Filosofia

    Diga também a subcategoria, responda no formato:
              Categoria: x
              Subcategoria: y
    A questão é: \n

`;

const splitAIAnswer = (AIResponse: string, question: string) => {
  return {
    question,
    category: AIResponse.split("Subcategoria:")[0]
      .replaceAll("*", "")
      .replaceAll("\n", "")
      .replaceAll("Categoria: ", "")
      .trim(),
    subcategory: AIResponse.split("Subcategoria:")[1]
      .replaceAll("*", "")
      .replaceAll("\n", "")
      .trim(),
    test: "41º EXAME DE ORDEM UNIFICADO",
  };
};

export const categorizeQuestions = async (arrayOfQuestions: any[]) => {
  let questionWithCategory: any = [];

  for (let i = 0; i < arrayOfQuestions.length; i += 1) {
    console.log(`${i + 1} de ${arrayOfQuestions.length} array de questoes`);

    const questions = arrayOfQuestions[i];

    questions.forEach(async (item: string) => {
      const {
        question,
        alternativeA,
        alternativeB,
        alternativeC,
        alternativeD,
      } = splitQuestion(item);

      const AIResponse = await getAIResponse(`${defaultPrompt} ${question}`);

      const obj = {
        ...splitAIAnswer(AIResponse, question),
        alternativeA,
        alternativeB,
        alternativeC,
        alternativeD,
      };

      questionWithCategory = [...questionWithCategory, obj];
    });

    console.log("Esperando tempo da requisicao da IA");

    await sleep(90 * 1000);
  }

  return questionWithCategory;
};
