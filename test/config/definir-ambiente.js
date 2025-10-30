import { definirAmbiente } from "./ambiente.config.js";

const ambiente = process.argv[2]?.toLowerCase();

if (!ambiente || (ambiente !== "local" && ambiente !== "prod")) {
  console.log("❗ Uso correto: npm run definir:ambiente:local ou npm run definir:ambiente:prod");
  process.exit(1);
}

definirAmbiente(ambiente);