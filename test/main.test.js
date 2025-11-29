import { limparAllureResults, enviarResultadosParaServidor } from "../scripts/servicos-allure.js";

global.__EXECUCAO_REGRESSIVA__ = true;

before(async () => {
  console.log("Execução Regressiva → limpando allure-results");
  await limparAllureResults();
});

await import("./suites/template.feliz.test.js");
await import("./suites/template.triste.test.js");

after(async () => {
  try {
    console.log("Execução Regressiva → enviando resultados");
    enviarResultadosParaServidor();
  } catch (e) {
    console.log("Erro ao enviar resultados para o servidor.");
  }
});