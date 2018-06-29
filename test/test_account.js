const os = require("os");

const expect = require("expect");

const { test, getLastRequests } = require("./helpers/init");
const { PlexClient, PlexAccount } = require("../index");

describe("account", () => {
  test("logs in", async () => {
    let client = new PlexClient({ plexWebURL: "http://localhost:3000/plex.tv/" });
    let account = await PlexAccount.login(client, "foo@bar.com", "bar");
    expect(account).not.toBeNull();
    expect(account.username).toBe("DTownsend");
    expect(account.name).toBe("Dave Townsend");
    expect(account.email).toBe("foo@bar.com");

    let requests = getLastRequests();
    expect(requests.length).toBe(1);
    expect(requests[0].method).toBe("POST");
    expect(requests[0].body).toEqual({
      login: "foo@bar.com",
      password: "bar",
    });

    expect(requests[0].get("X-Plex-Platform").toLowerCase()).toBe(os.platform());
    expect(requests[0].get("X-Plex-Token")).toBe(undefined);
  });
});
