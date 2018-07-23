const Registry = {
  _map: new Map(),

  async createItem(type, device, path, sourceData, data) {
    let cls = this._map.get(type);
    if (!cls) {
      throw new Error(`Unexpected Plex item "${type}"`);
    }
    return cls.create(device, path, sourceData, data);
  },

  register(type, cls) {
    this._map.set(type, cls);
  },

  get types() {
    return this._map.keys();
  }
};

Registry.register("Directory", require("./directory"));

module.exports = Registry;
