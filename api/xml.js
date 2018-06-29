const sax = require("sax");

function parseXML(str) {
  return new Promise((resolve, reject) => {
    let root = { };
    let nodes = [root];
    let node = root;

    let stream = sax.createStream(true, {});
    stream.on("opentag", ({ name, attributes }) => {
      let newNode = Object.assign({}, attributes);

      if (node == root) {
        node[name] = newNode;
      } else if (name in node) {
        node[name].push(newNode);
      } else {
        node[name] = [newNode];
      }

      nodes.push(newNode);
      node = newNode;
    });
    stream.on("closetag", () => {
      nodes.pop();
      node = nodes[nodes.length - 1];
    });
    stream.on("error", (err) => {
      reject(err);
    });

    stream.write(str);
    resolve(root);
  });
}

module.exports = parseXML;
