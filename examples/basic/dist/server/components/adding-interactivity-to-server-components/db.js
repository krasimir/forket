const db = {
  notes: {
    getAll: async () => {
      return [
        {
          id: 1,
          content: "Note 1"
        },
        {
          id: 2,
          content: "Note 2"
        },
        {
          id: 3,
          content: "Note 3"
        }
      ];
    }
  }
};
var db_default = db;
export {
  db_default as default
};
