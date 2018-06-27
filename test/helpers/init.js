const { startServer, stopServer, getLastRequest } = require("../../server/index");

global.test = (descr, testfn) => {
  it(descr, async() => {
    await startServer();
    try {
      return await testfn;
    } finally {
      await stopServer();
    }
  });
};

global.getLastRequest = getLastRequest;
