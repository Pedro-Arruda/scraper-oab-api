import axios from "axios";
import pdf from "pdf-parse";

export const formatTest = async (urlTest: string) => {
  const response = await axios.get(urlTest, {
    responseType: "arraybuffer",
  });

  const data = await pdf(response.data, { max: 21 });

  const formatedString = data.text
    .slice(4231)
    .replaceAll(/TIPO\s+AZUL\s+–\s+PÁGINA\s+\d+/g, "")
    .replaceAll(/TIPO\s+AMARELA\s+–\s+PÁGINA\s+\d+/g, "")
    .replaceAll(/TIPO\s\s+AMARELA\s+–\s+PÁGINA\s+\d+/g, "")
    .replaceAll(/TIPO\s+VERDE\s+–\s+PÁGINA\s+\d+/g, "")
    .replaceAll(/TIPO\s+BRANCA\s+–\s+PÁGINA\s+\d+/g, "")
    .replaceAll("EXAME DO ORDEM UNIFICADO", "")
    .replaceAll(/\d+º EXAME DE ORDEM UNIFICADO /g, "");

  let questions = formatedString
    .split(/.\n\d+\s*\n/)
    .filter((item) => item.trim() !== "");

  questions.shift();

  return questions;
};
