import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const ALLURE_MODE = process.env.ALLURE_MODE || "server";
const RESULTS_DIR = path.join(process.cwd(), "allure-results");
const PROJECT_ID = "default";
const ALLURE_SERVER_URL = "http://localhost:5050";

export function setupAllure() {
  if (ALLURE_MODE === "server") {
    console.log("Modo Allure: Servidor remoto (Docker Service)");
  } else {
    console.log("Modo Allure: Local (repositório)");
    if (!fs.existsSync(RESULTS_DIR)) {
      fs.mkdirSync(RESULTS_DIR);
    }
  }
}

export async function enviarResultadosParaServidor() {
  if (ALLURE_MODE !== "server") {
    console.log("Modo local detectado — resultados não serão enviados.");
    return;
  }

  console.log("Enviando resultados ao Allure Docker Service...");

  try {
    if (process.platform === "win32") {
      execSync(`powershell Compress-Archive -Path allure-results/* -DestinationPath allure-results.zip -Force`, { stdio: "inherit" });
    } else {
      execSync(`zip -r allure-results.zip allure-results`, { stdio: "inherit" });
    }

    execSync(
      `curl -X POST -F "results=@allure-results.zip" ${ALLURE_SERVER_URL}/send-results?project_id=${PROJECT_ID}`,
      { stdio: "inherit" }
    );

    console.log(`Resultados enviados com sucesso para o projeto: ${PROJECT_ID}`);
  } catch (error) {
    console.error("Falha ao enviar resultados:", error.message);
  } finally {
    if (fs.existsSync("allure-results.zip")) fs.unlinkSync("allure-results.zip");
  }
}
