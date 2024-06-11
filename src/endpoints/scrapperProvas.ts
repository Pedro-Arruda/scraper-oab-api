import { endpoint } from "@ev-fns/endpoint";
import puppeteer from "puppeteer";
import pdf from "pdf-parse";
import axios from "axios";
import { getAIResponse } from "../functions/getAIResponse";
import { ufsSelect } from "../utils/ufsSelect";
import { sleep } from "../functions/sleep";
import { splitArrayIntoChunks } from "../functions/splitArrayIntoChunks";

export const scrapperProvas = endpoint(async (req, res) => {
  let urlsProvas: any[] = [];
  let questionWithCategory: any = [];

  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto("https://oab.fgv.br/");

  const links = await page.$$("li");

  // link 40 exame
  const linkTeste = links[1];

  await linkTeste.click();

  await page.waitForNavigation();

  for (const uf of ufsSelect) {
    console.log("BUSCANDO PROVAS DA PROVA - ", uf.key);

    await page.select("#ContentPlaceHolder1_listSeccional", uf.value);

    await page.waitForNavigation();

    for (let i = 1; i <= 4; i++) {
      console.log("PROVA ", i);

      await page.waitForSelector(
        `#ContentPlaceHolder1_gvProva1_linkTeste_${i}`,
      );
      const prova = await page.$(
        `#ContentPlaceHolder1_gvProva1_linkTeste_${i}`,
      );

      if (prova) {
        const pageTarget = page.target();

        await prova.click();

        const newTarget = await browser.waitForTarget(
          (target) => target.opener() === pageTarget,
        );

        const newPage = await newTarget.page();
        const url = await newPage?.url();

        urlsProvas.push({ url: url!, uf: uf.key });

        await newPage?.close();
      }
    }

    await page.goBack();
  }

  await browser.close();
  const allQuestions = [];

  let count = 0;

  for (const url of urlsProvas) {
    console.log(`PDF NUMERO ${count} de ${urlsProvas.length}`);

    count++;

    // Baixar o PDF
    const response = await axios.get(url.url, {
      responseType: "arraybuffer",
    });

    // Extrair o texto do PDF
    const data = await pdf(response.data, { max: 21 });

    // Limpa textos, deixando so as questoes

    const formatedString = data.text
      .slice(4231)
      .replaceAll(/TIPO\s+AZUL\s+–\s+PÁGINA\s+\d+/g, "")
      .replaceAll(/TIPO\s+AMARELA\s+–\s+PÁGINA\s+\d+/g, "")
      .replaceAll(/TIPO\s\s+AMARELA\s+–\s+PÁGINA\s+\d+/g, "")
      .replaceAll(/TIPO\s+VERDE\s+–\s+PÁGINA\s+\d+/g, "")
      .replaceAll(/TIPO\s+BRANCA\s+–\s+PÁGINA\s+\d+/g, "")
      .replaceAll("EXAME DO ORDEM UNIFICADO", "")
      .replaceAll(/\d+º EXAME DE ORDEM UNIFICADO /g, "");

    // Separa as questôes
    let questions = formatedString
      .split(/.\n\d+\s*\n/)
      .filter((item) => item.trim() !== "");

    allQuestions.push(...questions);

    const arrayOfQuestions = splitArrayIntoChunks(questions, 10);
    console.log(
      `${questions.length} questoes divididas em ${arrayOfQuestions.length} arrays de 10 questoes`,
    );

    for (let i = 0; i < arrayOfQuestions.length; i += 1) {
      const questions = arrayOfQuestions[i];
      console.log(
        `Array de questoes ${i} de ${arrayOfQuestions.length} do PDF ${count}`,
      );

      questions.forEach(async (question) => {
        const AIResponse = await getAIResponse(
          `${question}
          Diga a que tema pertence essa questao da prova de direito. As opções são:
          Direito Civil
          Direito Administrativo
          Direito Constitucional
          Direito do Trabalho
          Direito Empresarial
          Direito Penal
          Direito Tributário

          Diga também a subcategoria, responda no formato:
          Categoria: x
          Subcategoria: y
          `,
        );

        // await sleep(10 * 1000);

        const obj = {
          question: question,
          category: AIResponse.split("Subcategoria:")[0]
            .replaceAll("*", "")
            .replaceAll("\n", "")
            .replaceAll("Categoria: ", ""),
          subCategory: AIResponse.split("Subcategoria:")[1]
            .replaceAll("*", "")
            .replaceAll("\n", ""),
          state: url.uf,
          test: "41º EXAME DE ORDEM UNIFICADO",
        };
        questionWithCategory = [...questionWithCategory, obj];
      });

      console.log("Esperando tempo da requisicao da IA");

      await sleep(90 * 1000);
    }
  }

  console.log(questionWithCategory.length);

  res.send(questionWithCategory);
});
