const expect = require("expect");

const { PlexClient, PlexAccount } = require("../index");

describe("server", () => {
  test("list servers", async () => {
    let client = new PlexClient({ plexWebURL: "http://localhost:3000/plex.tv/" });
    let account = await PlexAccount.login(client, "foo@bar.com", "bar");

    let resources = await account.getResources(["server"]);
    expect(resources.length).toBe(1);
    expect(resources[0].name).toBe("Main Server");

    let request = getLastRequest();
    expect(request.get("X-Plex-Token")).toBe("g2J4yh9G1qwdf292gZdE");

    resources = await account.getResources();
    expect(resources.length).toBe(2);

    let phone = await account.getResource("Phone");
    expect(phone.name).toBe("Phone");
  });
});
