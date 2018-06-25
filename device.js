class PlexDevice {
  constructor(data) {
    this.data = data;
  }

  get name() {
    return this.data.$.name;
  }

  provides(provides = []) {
    // Shortcut the empty case.
    if (provides.length == 0) {
      return true;
    }

    let list = this.data.$.provides.split(",");
    for (let item of provides) {
      if (!list.includes(item)) {
        return false;
      }
    }

    return true;
  }
}

module.exports = PlexDevice;
