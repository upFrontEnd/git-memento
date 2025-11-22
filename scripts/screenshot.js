import { chromium } from "playwright";

const URL = "http://localhost:3000";
const OUTPUT_PATH = "public/img/screen.jpg";

(async () => {
  console.log("🚀 Lancement de la création du screenshot pour", URL);
  let browser;
  try {
    console.log("👉 Lancement de Chromium…");
    browser = await chromium.launch(); // headless par défaut

    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    });

    console.log("👉 Navigation vers la page…");
    await page.goto(URL, {
      waitUntil: "networkidle",
      timeout: 15000,
    });

    console.log("👉 Attente pour les fonts/animations…");
    await page.waitForTimeout(2000);

    console.log("👉 Capture de l'écran…");
    await page.screenshot({
      path: OUTPUT_PATH,
      fullPage: true,
      type: "png",
    });

    console.log("✅ Screenshot mis à jour :", OUTPUT_PATH);
  } catch (error) {
    console.error("❌ Erreur pendant la génération du screenshot :", error);
  } finally {
    if (browser) {
      console.log("👉 Fermeture du navigateur…");
      await browser.close();
    }
  }
})();
