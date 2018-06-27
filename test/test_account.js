const expect = require("expect");

const { PlexClient, PlexAccount } = require("../index");

const { startServer, stopServer } = require("../server/index");
before(startServer);
after(stopServer);

describe("account", () => {
  it("logs in", async () => {
    let client = new PlexClient({ plexWebURL: "http://localhost:3000/plex.tv/" });
    let account = await PlexAccount.login(client, "foo@bar.com", "bar");
    expect(account).not.toBeNull();
    expect(account.username).toBe("DTownsend");
    expect(account.name).toBe("Dave Townsend");
    expect(account.email).toBe("foo@bar.com");
  });
});
