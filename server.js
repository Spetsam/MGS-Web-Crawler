const axios = require("axios");
const cheerio = require("cheerio");

async function main(maxPages = 1) {
  const individualUrlInput = ["https://scrapeme.live/shop"];
  const traversedDomains = [];

  const uniqueURLs = new Set();

  while (
    individualUrlInput.length !== 0 &&
    traversedDomains.length <= maxPages
  ) {
    const paginationURL = individualUrlInput.pop();
    console.log("Browsing through source:", paginationURL);

    const pageHTML = await axios.get(paginationURL);

    traversedDomains.push(paginationURL);

    const $ = cheerio.load(pageHTML.data);

    $(".page-numbers a").each((index, entity) => {
      const paginationURL = $(entity).attr("href");

      if (
        !traversedDomains.includes(paginationURL) &&
        !individualUrlInput.includes(paginationURL)
      ) {
        individualUrlInput.push(paginationURL);
      }
    });

    $("li.product a.woocommerce-LoopProduct-link").each((index, entity) => {
      const productURL = $(entity).attr("href");
      uniqueURLs.add(productURL);
    });
  }

  console.log([...uniqueURLs]);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);

    process.exit(1);
  });
