import * as allure from "allure-js-commons";
import { configurarDriver } from "../config/navegador.config.js";
import { configurarAmbiente } from "../config/ambienteAllure.js";
import { setupExecutor } from "../config/executor.js";
import { setupAllure, enviarResultadosParaServidor, limparAllureResults } from "../../scripts/servicos-allure.js";

import { abrirGoogle } from '../caminhoFeliz/cenarioFelizBase.js';

const isRegressivo = global.__EXECUCAO_REGRESSIVA__ === true;

describe('Testes Caminho Triste', function() {
    this.timeout(60000); 
    let driver;

    before(async function () {
        console.log("Iniciando suíte de acesso ao site");
        setupAllure();
        configurarAmbiente();
        setupExecutor();
        if (!isRegressivo) {
            console.log("Execução MODULAR → limpando allure-results");
            limparAllureResults();
        }

        driver = await configurarDriver();
    });

    after(async function () {
        console.log("Finalizando suíte de testes...");
        if (driver) await driver.quit();
        
        if (!isRegressivo) {
            console.log("Execução MODULAR → enviando resultados");
            await enviarResultadosParaServidor();
        }
    });


    it('Deve dar erro ao verificar nome do site', async function() {
        allure.parentSuite("CaminhoTriste");
        allure.suite("Google");
        allure.subSuite("DeveDarErroAoAbrirGoogle");
        await abrirGoogle(driver);
    });
});