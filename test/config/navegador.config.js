import { Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import firefox from "selenium-webdriver/firefox.js";
import { obterNavegadorAtual } from "./global.config.js";
import "chromedriver";
import "geckodriver";

export async function configurarDriver() {
  const navegador = obterNavegadorAtual();
  let driver;

  switch (navegador) {
    case "chrome":
      const opcoesChrome = new chrome.Options();
      opcoesChrome.addArguments("--start-maximized");
      driver = await new Builder().forBrowser("chrome").setChromeOptions(opcoesChrome).build();
      break;

    case "firefox":
    default:
      const opcoesFirefox = new firefox.Options();
      opcoesFirefox.setAcceptInsecureCerts(true);
      driver = await new Builder().forBrowser("firefox").setFirefoxOptions(opcoesFirefox).build();
      break;
  }

  return driver;
}
