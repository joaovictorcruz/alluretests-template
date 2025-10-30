import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import archiver from "archiver";

const ALLURE_MODE = process.env.ALLURE_MODE || "server";
const RESULTS_DIR = path.join(process.cwd(), "allure-results");
const ALLURE_SERVER_URL = process.env.ALLURE_SERVER_URL || "http://localhost:5050";

const PROJECT_IMEDIATO = "testes-imediato";
const PROJECT_HISTORICO = "testes-historico";

export function setupAllure() {
  if (ALLURE_MODE === "server") {
    console.log("🧩 Modo Allure: Servidor remoto (Docker Service)");
  } else {
    console.log("🧩 Modo Allure: Local (repositório)");
    if (!fs.existsSync(RESULTS_DIR)) fs.mkdirSync(RESULTS_DIR);
  }
}

// Cria projeto no Allure se não existir
function criarProjetoSeNaoExistir(projectId) {
  try {
    const output = execSync(`curl -s ${ALLURE_SERVER_URL}/projects`).toString();
    if (!output.includes(`"id":"${projectId}"`)) {
      console.log(`📦 Criando projeto '${projectId}'...`);
      execSync(
        `curl -X POST ${ALLURE_SERVER_URL}/projects -H "Content-Type: application/json" -d "{\\"id\\": \\"${projectId}\\"}"`,
        { stdio: "inherit" }
      );
    } else {
      console.log(`✅ Projeto '${projectId}' já existe.`);
    }
  } catch (err) {
    console.error(`❌ Falha ao criar/verificar projeto '${projectId}':`, err.message);
  }
}

// Compacta a pasta allure-results usando Node + archiver
function zipAllureResults(zipFile = "allure-results.zip", sourceDir = RESULTS_DIR) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipFile);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      console.log(`📦 ZIP gerado (${(archive.pointer() / 1024).toFixed(1)} KB)`);
      resolve();
    });

    archive.on("error", (err) => reject(err));

    archive.pipe(output);

    // Inclui todos os arquivos e subpastas, incluindo arquivos ocultos
    archive.glob("**/*", { cwd: sourceDir, dot: true });

    archive.finalize();
  });
}

export async function enviarResultadosParaServidor() {
  if (ALLURE_MODE !== "server") {
    console.log("Modo local detectado — resultados não serão enviados.");
    return;
  }

  console.log("🚀 Enviando resultados ao Allure Docker Service...");

  const zipFile = path.resolve("allure-results.zip"); // caminho absoluto
  try {
    if (!fs.existsSync(RESULTS_DIR) || fs.readdirSync(RESULTS_DIR).length === 0) {
      console.warn("⚠️ A pasta allure-results está vazia. Nenhum arquivo para enviar.");
      return;
    }

    // Remove ZIP antigo
    if (fs.existsSync(zipFile)) fs.unlinkSync(zipFile);

    console.log("📦 Compactando resultados com Node...");
    await zipAllureResults(zipFile);

    // Cria projetos se necessário
    criarProjetoSeNaoExistir(PROJECT_IMEDIATO);
    criarProjetoSeNaoExistir(PROJECT_HISTORICO);

    // Limpa resultados anteriores
    console.log(`🧹 Limpando resultados anteriores do projeto ${PROJECT_IMEDIATO}...`);
    execSync(`curl -s -X GET ${ALLURE_SERVER_URL}/clean-results?project_id=${PROJECT_IMEDIATO}`, { stdio: "inherit" });

    // Envia para o projeto imediato
    console.log(`📤 Enviando resultados para: ${PROJECT_IMEDIATO}`);
    execSync(
      `curl -X POST -F "results=@${zipFile}" ${ALLURE_SERVER_URL}/send-results?project_id=${PROJECT_IMEDIATO}`,
      { stdio: "inherit" }
    );

    // Envia também para o histórico
    console.log(`📤 Enviando resultados para: ${PROJECT_HISTORICO}`);
    execSync(
      `curl -X POST -F "results=@${zipFile}" ${ALLURE_SERVER_URL}/send-results?project_id=${PROJECT_HISTORICO}`,
      { stdio: "inherit" }
    );

    console.log("✅ Resultados enviados com sucesso!");
  } catch (err) {
    console.error("❌ Falha ao enviar resultados:", err.message);
  } finally {
    if (fs.existsSync(zipFile)) fs.unlinkSync(zipFile);
  }
}
