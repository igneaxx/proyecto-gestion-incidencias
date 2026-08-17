const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 5500;

const mimeTypes = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css"
};

const server = http.createServer((req, res) => {
  let filePath = req.url === "/" ? "/index.html" : req.url;
  filePath = path.join(__dirname, decodeURIComponent(filePath.split("?")[0]));

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end("No encontrado");
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "text/plain" });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`Frontend disponible en http://localhost:${PORT}`);
});
