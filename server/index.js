const path = require("path");
const fs = require("fs");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
let server;
let lastRequest = null;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(request, response, next) {
  lastRequest = request;

  let file = path.join(__dirname, "files", ...request.path.split("/"));
  try {
    let data = fs.readFileSync(file);
    response.status(200).send(data);
  } catch (e) {
    next();
  }
});

function startServer() {
  return new Promise(resolve => {
    server = app.listen(3000, resolve);
  });
}

function stopServer() {
  server.close();
}

function getLastRequest() {
  return lastRequest;
}

module.exports = {
  startServer,
  stopServer,
  getLastRequest,
};
