import open from "open";

const url = "http://localhost:5252";
console.log(`Servidor Allure iniciado. Abrindo o dashboard em: ${url}`);
await open(url);
