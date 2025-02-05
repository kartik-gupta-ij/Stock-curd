# Assignment

This project consists of a backend and a frontend. Follow the instructions below to set up and run the project.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- SQLite3

## Setup

### Backend

1. Create a `.env` file in the `backend` directory with the following content (replace `your_secret_key` with your own secret key) :

   ```
   SECRET_KEY="your_secret_key"
   DB="./db/database.db"
   PORT=3000
   ```

2. Navigate to the `backend` directory and install dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Start the backend server:
   ```bash
   npm run start
   ```

### Frontend

1. Navigate to the `frontend` directory and install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Start the frontend development server:
   ```bash
   npm run start
   ```

## Usage

### Running the Application

- Ensure the backend server is running on `http://localhost:3000`.
- Ensure the frontend server is running on `http://localhost:5173`.

### API Endpoints

- `POST /register`: Register a new user.
- `POST /login`: Login with existing user credentials.
- `GET /profile`: Get the profile of the logged-in user.
- `POST /order/place_order`: Place a new order.
- `GET /portfolio/user_holdings`: Get user-specific holdings.
- `GET /portfolio/holdings`: Get static holdings data.
- `GET /historical-data`: Get historical price data.

### Environment Variables

- `SECRET_KEY`: Secret key for JWT authentication.
- `DB`: Path to the SQLite database file.
- `PORT`: Port number for the backend server.

## Project Structure

### Backend

- `src/index.ts`: Entry point for the backend server.
- `src/middleware.ts`: Middleware for JWT authentication.
- `src/handlers`: Directory containing request handlers.
- `src/db.ts`: Database setup and schema definitions.

### Frontend

- `src/pages`: Directory containing React components for different pages.
- `src/components`: Directory containing reusable React components.
- `src/utils`: Directory containing utility functions and Axios setup.

## License

This project is licensed under the MIT License.
