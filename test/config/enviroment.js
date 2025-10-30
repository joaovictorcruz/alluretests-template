import fs from "fs";
import path from "path";

export function configurarAmbiente() {
  const ambiente = {
    "Navegador": process.env.BROWSER || "Chrome",
    "Versão do Node": process.version || "Node",
    "Sistema Operacional": process.platform || "Windows",
    "URL Base": "https://www.google.com"
  };

  const pasta = "allure-results";
  if (!fs.existsSync(pasta)) fs.mkdirSync(pasta, { recursive: true });

  fs.writeFileSync(
    path.join(pasta, "environment.properties"),
    Object.entries(ambiente)
      .map(([chave, valor]) => `${chave}=${valor}`)
      .join("\n")
  );
}
