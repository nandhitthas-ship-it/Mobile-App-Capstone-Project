const http = require("http");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const root = __dirname;
const port = 4173;
const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg"
};

const server = http.createServer((request, response) => {
  const requestPath = decodeURIComponent(request.url.split("?")[0]);
  const relativePath = requestPath === "/" ? "index.html" : requestPath.slice(1);
  const filePath = path.join(root, relativePath);

  if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    response.statusCode = 404;
    response.end("Not found");
    return;
  }

  response.setHeader("Content-Type", mimeTypes[path.extname(filePath)] || "application/octet-stream");
  response.end(fs.readFileSync(filePath));
});

const url = `http://localhost:${port}`;

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.log(`SpendWise is already running at ${url}`);
    exec(`start "" "${url}"`);
    return;
  }
  throw error;
});

server.listen(port, () => {
  console.log(`SpendWise running at ${url}`);
  exec(`start "" "${url}"`);
});
