const expect = require("expect");

const { startServer, stopServer, getLastRequests } = require("../../server/index");

global.test = (descr, testfn) => {
  it(descr, async() => {
    await startServer();
    try {
      return await testfn();
    } finally {
      await stopServer();
    }
  });
};

global.getLastRequests = getLastRequests;
global.awaitExpect = async function(func) {
  try {
    let result = await(func());
    return expect(() => result);
  } catch (e) {
    return expect(() => { throw e; });
  }
};
