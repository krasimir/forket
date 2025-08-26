const db = {
  notes: {
    get: async (id) => {
      return {
        id,
        content: `Note ${id}`,
      }
    }
  },
  comments: {
    get(id) {
      // return Promise.resolve([
      //   { id: 1, content: "This is the first comment." },
      //   { id: 2, content: "This is the second comment." }
      // ]);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            { id: 1, content: "This is the first comment." },
            { id: 2, content: "This is the second comment." }
          ]);
        }, 3000);
      });
    }
  }
}

export default db;