const expect = require("expect");

const { test, getLastRequests, awaitExpect } = require("./helpers/init");
const { PlexClient, PlexAccount } = require("../index");

describe("server", () => {
  test("list servers", async () => {
    let client = new PlexClient({ plexWebURL: "http://localhost:3000/plex.tv/" });
    let account = await PlexAccount.login(client, "foo@bar.com", "bar");
    let requests = getLastRequests();

    let resources = await account.getResources(["server"]);
    expect(resources.length).toBe(2);
    expect(resources[0].name).toBe("Main Server");

    requests = getLastRequests();
    expect(requests.length).toBe(3);
    expect(requests[0].get("X-Plex-Token")).toBe("g2J4yh9G1qwdf292gZdE");
    for (let i = 1; i < requests.length; i++) {
      if (requests[i].path.startsWith("/mainserver/")) {
        expect(requests[i].get("X-Plex-Token")).toBe("HU4XNX3ggszgvyy4s4o");
      } else {
        expect(requests[i].get("X-Plex-Token")).toBe("r4FfXdgggsgsyyeswo");
      }
    }

    resources = await account.getResources();
    expect(resources.length).toBe(2);

    let server = await account.getResource("Second Server");
    expect(server.name).toBe("Second Server");

    (await awaitExpect(async() => {
      await account.getResource("Phone");
    })).toThrow(/Unable to connect to device/);

    let servers = await account.getServers();
    expect(servers.length).toBe(2);
  });
});
