export const query = `
            SELECT date, price FROM prices
            WHERE instrument_name = ? AND date BETWEEN ? AND ?
            ORDER BY date ASC;
        `;

export const create_user_table = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_name TEXT NOT NUll,
                password TEXT NOT NULL,
                user_type TEXT NOT NULL,
                email TEXT NOT NULL,
                broker TEXT NOT NULL
            );
`;