import puppeteer from "puppeteer";

export const getURLAnswerSheet = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto("https://oab.fgv.br/");

  const links = await page.$$("li");

  const linkTeste = links[1];

  await linkTeste.click();

  await page.waitForNavigation();

  await page.select("#ContentPlaceHolder1_listSeccional", "5124");

  await page.waitForNavigation();

  await page.waitForSelector(`#ContentPlaceHolder1_gvProva1_linkTeste_0`);
  const prova = await page.$(`#ContentPlaceHolder1_gvProva1_linkTeste_0`);

  const pageTarget = page.target();

  await prova!.click();

  const newTarget = await browser.waitForTarget(
    (target) => target.opener() === pageTarget,
  );

  const newPage = await newTarget.page();
  const url = await newPage?.url();

  await newPage?.close();
  await page.close();
  return url;
};
