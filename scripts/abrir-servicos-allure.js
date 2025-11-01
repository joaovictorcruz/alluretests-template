import open from "open";

const arg = process.argv[2]; 

let url;

switch (arg) {
    case "imediato":
        url = "https://allure-api-hrbd.onrender.com/allure-docker-service/projects/testes-imediato/reports/latest/index.html";
        break;
    case "historico":
        url = "https://allure-api-hrbd.onrender.com/allure-docker-service/projects/testes-historico/reports/latest/index.html";
        break;
    case "dash":
    case undefined: 
        url = "https://allure-docker-service-ui.onrender.com/";
        break;
    case "api":
        url = "https://allure-api-hrbd.onrender.com/";
        break;
    default:
        console.error("Parâmetro inválido! Use: dash | imediato | historico");
        process.exit(1);
}

console.log(`Abrindo o Allure em: ${url}`);
await open(url);
