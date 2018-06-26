class PlexSyncItem {
  constructor(connection, server, data) {
    this.connection = connection;
    this.server = server;
    this.data = data;
  }

  // http://10.10.12.204:32400/photo/:/transcode?width=0&url=%2Fsync%2Fitems%2F28220108%2Fcomposite%2F1529987615808&height=0&X-Plex-Token=BwPyamkh5moxuX2redJw
}

module.exports = {
  PlexSyncItem,
};
