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

export const create_order_table = `
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                symbol TEXT NOT NUll,
                price REAL NOT NULL,
                quantity INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id)
            );
`;
