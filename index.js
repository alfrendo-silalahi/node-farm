import fs from 'fs';
import http from 'http';
import url from 'url';

import slugify from 'slugify';

import replaceTemplate from './modules/replace-template.js';

/////////////////////////////////
// FILES
const tempOverview = fs.readFileSync(
  './templates/template-overview.html',
  'utf-8'
);
const tempCard = fs.readFileSync('./templates/template-card.html', 'utf-8');
const tempProduct = fs.readFileSync(
  './templates/template-product.html',
  'utf-8'
);

const data = fs.readFileSync('./dev-data/data.json', 'utf-8');
const dataObj = JSON.parse(data);

// 3rd Party Module
/*
dataObj.map((el) =>
  console.log(
    slugify(el.productName, {
      replacement: '-',
      lower: true,
    })
  )
);
*/

/////////////////////////////////
// SERVER
const server = http.createServer((req, res) => {
  const { query, pathname: pathName } = url.parse(req.url, true);

  // Overview Page
  if (pathName === '/' || pathName === '/overview') {
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');

    const overviewHtml = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);

    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    res.end(overviewHtml);
  }
  // Product Page
  else if (pathName === '/product') {
    const product = dataObj.find((el) => el.id === parseInt(query.id));
    const productHtml = replaceTemplate(tempProduct, product);

    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    res.end(productHtml);
  }
  // API
  else if (pathName === '/api') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
    });
    res.end(data);
  }
  // Page Not Found
  else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
      'My-Own-Header': 'hello-world',
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to request on http://127.0.0.1:8000');
});

// Blocking, synchronous way
/*
const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(textIn);

const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync("./txt/output.txt", textOut, "utf-8");
console.log("File written!");
*/

// Non-blocking, asynchronous way
/*
fs.readFile("./txt/start.tx", "utf-8", (err1, data1) => {
  if (err1) return console.log("ERROR! 💥", err1.message);
  fs.readFile(`./txt/${data1}.txt`, "utf-8", (err2, data2) => {
    if (err2) return console.log("ERROR! 💥", err2.message);
    console.log(data2);
    fs.readFile("./txt/append.txt", "utf-8", (err3, data3) => {
      if (err3) return console.log("ERROR! 💥", err3.message);
      console.log(data3);
      fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err4) => {
        if (err4) return console.log("ERROR! 💥", err4.message);
        console.log("Your file has been written 😁");
      });
    });
  });
});

console.log("Will read file!");
*/
