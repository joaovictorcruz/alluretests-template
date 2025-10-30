import * as allure from "allure-js-commons";
import { configurarDriver } from "../config/navegador.config.js";
import { configurarAmbiente } from "../config/enviroment.js";
import { setupExecutor } from "../config/executor.js";
import { abrirSiteCenario } from "../happyPath/cenario-base.js";

describe("Validação de acesso ao site", function () {
  this.timeout(60000);
  let driver;

  before(async function () {
    console.log("🧩 Iniciando suíte de acesso ao site...");
    configurarAmbiente();
    setupExecutor();
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
