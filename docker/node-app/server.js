const http = require("node:http");

const port = Number(process.env.PORT || 3000);

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  if (req.url === "/" && req.method === "GET") {
    sendJson(res, 200, { service: "nodejs-app", status: "ok" });
    return;
  }

  if (req.url === "/health" && req.method === "GET") {
    sendJson(res, 200, { status: "healthy" });
    return;
  }

  sendJson(res, 404, { error: "not_found" });
});

server.listen(port, () => {
  console.log(`Node.js app listening on port ${port}`);
});
