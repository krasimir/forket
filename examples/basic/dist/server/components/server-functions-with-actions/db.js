const db = {
  users: {
    updateName: async (name) => {
      await new Promise((resolve) => setTimeout(resolve, 2e3));
      return {
        __name: name,
        ok: true
      };
    }
  }
};
var db_default = db;
export {
  db_default as default
};
