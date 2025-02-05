export const create_user_table = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_name TEXT UNIQUE NOT NUll,
                password TEXT NOT NULL,
                user_type TEXT NOT NULL,
                email TEXT NOT NULL,
                broker TEXT NOT NULL
            );
`;
