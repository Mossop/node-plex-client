const sax = require("sax");

function parseXML(str) {
  return new Promise((resolve, reject) => {
    let root = { elements: [] };
    let nodes = [root];
    let node = root;

    let stream = sax.createStream(true);
    stream.on("opentag", ({ name, attributes }) => {
      let newNode = {
        name,
        attributes,
        elements: [],
      };

      node.elements.push(newNode);

      if (name in node.elements) {
        node.elements[name].push(newNode);
      } else{
        node.elements[name] = [newNode];
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
    if (root.elements.length != 1) {
      reject(new Error("Unexpected number of root elements."));
    }

    resolve(root.elements[0]);
  });
}

module.exports = parseXML;
