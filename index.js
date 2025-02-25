const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Go to Hacker News newest page
  await page.goto("https://news.ycombinator.com/newest");

  // Get the first 100 articles (title and timestamp)
  const articles = await page.$$eval(".itemlist .athing", (nodes) =>
    nodes.slice(0, 100).map((node) => {
      const title = node.querySelector(".titleline a")?.innerText || "";
      const ageElement = node.nextElementSibling.querySelector(".age a");
      const ageText = ageElement ? ageElement.title : "";
      return { title, ageText };
    })
  );


  // Check if the articles are sorted from newest to oldest
  const isSorted = articles.every((_, i, arr) => {
    if (i === 0) return true; // Skip the first element
    return new Date(arr[i - 1].ageText) >= new Date(arr[i].ageText);
  });

  // Log the result
  if (isSorted) {
    console.log("The first 100 articles are sorted correctly (newest to oldest).");
  } else {
    console.log("The articles are NOT sorted correctly.");
  }

  // Pause the page for debugging
await page.pause();


  // Close browser
  await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();
