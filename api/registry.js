const Registry = {
  _map: new Map(),

  async createItem(type, device, path, data, sourceData) {
    let cls = this._map.get(type);
    if (!cls) {
      throw new Error(`Unexpected Plex item "${type}"`);
    }
    return cls.create(device, path, data, sourceData);
  },

  register(type, cls) {
    this._map.set(type, cls);
  },

  get types() {
    return this._map.keys();
  }
};

Registry.register("Directory", require("./directory"));
Registry.register("Hub", require("./hub"));
Registry.register("Metadata", require("./metadata"));

module.exports = Registry;
