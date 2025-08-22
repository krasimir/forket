const db = {
    notes: {
        get: async (id)=>{
            return {
                id,
                content: `Note ${id}`
            };
        }
    },
    comments: {
        get (id) {
            return new Promise((resolve)=>{
                setTimeout(()=>{
                    resolve([
                        {
                            id: 1,
                            content: "This is the first comment."
                        },
                        {
                            id: 2,
                            content: "This is the second comment."
                        }
                    ]);
                }, 4000);
            });
        }
    }
};
export default db;
