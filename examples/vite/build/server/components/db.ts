const db = {
  notes: {
    create: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        ok: true
      };
    }
  }
}

export default db;