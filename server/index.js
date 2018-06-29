const path = require("path");
const fs = require("fs");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
let server;
let requests = [];

app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(request, response, next) {
  requests.push(request);

  let fullpath = request.path;
  if (fullpath.endsWith("/")) {
    fullpath += "index";
  }

  let file = path.join(__dirname, "files", ...fullpath.split("/"));
  let headersFile = `${file}^headers^`;
  try {
    let headers = JSON.parse(fs.readFileSync(headersFile, { encoding: "utf8" }));
    for (let name of Object.keys(headers)) {
      response.set(name, headers[name]);
    }
  } catch (e) {
    // Ignore file not found errors
  }

  try {
    let data = fs.readFileSync(file, { encoding: "utf8" });
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
  return new Promise(resolve => {
    server.close(resolve);
  });
}

function getLastRequests() {
  let results = requests;
  requests = [];
  return results;
}

module.exports = {
  startServer,
  stopServer,
  getLastRequests,
};
