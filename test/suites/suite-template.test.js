import * as allure from "allure-js-commons";
import { configurarDriver } from "../configuracoes/navegador.config.js";
import { configurarAmbiente } from "../configuracoes/ambiente.js";
import { configurarExecutor } from "../configuracoes/executor.js";
import { abrirSiteCenario } from "../cenarios/abrirSiteCenario.js";

describe("Validação de acesso ao site", function () {
  this.timeout(60000);
  let driver;

  before(async function () {
    console.log("🧩 Iniciando suíte de acesso ao site...");
    configurarAmbiente();
    configurarExecutor();
    driver = await configurarDriver();
  });

  after(async function () {
    console.log("✅ Finalizando suíte de testes...");
    await driver.quit();
  });

  it("Deve abrir o site do Google e validar o título da página", async function () {
    allure.parentSuite("Fluxo Básico");
    allure.suite("Acesso ao Site");
    allure.subSuite("Validação de Página Inicial");
    await abrirSiteCenario(driver);
  });
});
