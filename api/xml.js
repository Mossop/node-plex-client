const sax = require("sax");

/**
 * Parses some XML string into a JS object in a similar style to that used by
 * Plex elsewhere.
 * 
 * @param {String} str the XML string to parse.
 * @returns {Promise<Object>} a JS object on success.
 */
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
