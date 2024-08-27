# Platform Client

A React-based book management system that allows users to list their own books, search for related books, and put up exchange requests for books listed by other users.

## Features

- **User Authentication**: Users can log in and sign up. (uses JWT based authorization )
- **Book Listing**: Users can list their own books.
- **Book Discovery**: Users can search and discover books listed by other users.
- **Book Exchange**: Users can create and manage book exchange requests.

## Dependencies

This project uses the following dependencies:

- **React**: ^18.3.1
- **Material-UI**: ^5.16.7
- **Redux Toolkit**: ^2.2.7
- **React Router DOM**: ^6.26.1
- **React Toastify**: ^10.0.5
- **Date-fns**: ^3.6.0


# Project Structure

## Folder Structure

- `src/`: Contains the source code of the application.
  - `components/`: Contains reusable UI components.
  - `pages/`: Contains page components for different routes.
  - `slice/`: Contains Redux slices and configuration.
  - `utils/`: Contains utility functions and constants.
- `App.js`: The main application component with routing.
- `index.js`: The entry point of the application.

## Routing

The application uses the following routes:

- `/`: Redirects to `/login`
- `/login`: Login page
- `/sign-up`: Signup page
- `/user/:username`: User profile page
- `/books/list`: List of books owned by the user
- `/books/discover`: Discovery page for searching books
- `/books/exchange`: Page to manage book exchange requests