const db = {
  notes: {
    create: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      return {
        ok: true
      };
    }
  }
};
var db_default = db;
export {
  db_default as default
};
