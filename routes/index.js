var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

const puppeteer = require("puppeteer");

async function printPDF(url = "https://www.google.com/") {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--disable-dev-shm-usage"],
  });
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle0",
  });
  const pdf = await page.pdf({ format: "A4" }); // FIXME: we need an format for exporting documents

  await browser.close();
  return pdf;
}

router.get("/pdf", async (req, res, next) => {
  const pdf = await printPDF(req.query.url);

  res.set({ "Content-Type": "application/pdf", "Content-Length": pdf.length });
  res.send(pdf);
});

module.exports = router;
