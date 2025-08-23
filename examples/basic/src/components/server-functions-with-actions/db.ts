const db = {
  users: {
    updateName: async (name) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return {
        ok: true
      };
    }
  }
}

export default db;