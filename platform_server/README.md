# Book Exchange API Documentation

## Overview

This API provides endpoints for managing user authentication, books, and book exchanges. It allows users to sign up, log in, manage their book collection, and exchange books with other users.


## Endpoint* `/signup`

**Method:**`POST`

**Description:** Registers a new user and returns a JWT token.
**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string"
}
```

## Endpoint* /login

**Method:** POST

**Description:** Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```
Response:

## Endpoint: /user/:username

**Method:** GET

**Description:** Fetches details of a user by username.

**Request Headers:**

```Authorization: Bearer <token>```
Response:

# Book Management
## Endpoint: /book/:bookId

**Method:** GET

**Description:** Retrieves details of a specific book.

**Request Headers:**

```Authorization: Bearer <token>```
Response:

## Endpoint: /books/find/:username

**Method:** GET

**Description:** Retrieves all books owned by a specific user.

**Request Headers:**

```Authorization: Bearer <token>```

## Endpoint: /books/available/:username

**Method:** GET

**Description:** Retrieves all books owned by a user that are not involved in any exchange.

**Request Headers:**

```Authorization: Bearer <token>```

## Endpoint: /books/add

**Method:** POST

**Description:** Adds a new book to the user's collection.

**Request Body:**
```json
{
  "title": "string",
  "author": "string",
  "genre": ["string"],
  "username": "string"
}
```
**Request Headers:**

```Authorization: Bearer <token>```

## Endpoint: /books/:id

**Method:** DELETE

**Description:** Deletes a specific book by ID.

**Request Headers:**

```Authorization: Bearer <token>```

## Endpoint: /books

**Method:** GET

**Description:** Retrieves all books except those added by the current user.

**Request Headers:**

```Authorization: Bearer <token>```
Response:

## Endpoint: /books/filter

**Method:** GET

**Description:** Retrieves books based on filters for genre, author, and title.

**Request Query Parameters:**

genre: Optional filter by genre
author: Optional filter by author
title: Optional filter by title
Request Headers:

```Authorization: Bearer <token>```
Response:


# Book Exchange
## Endpoint: /book-exchange

**Method:** POST

**Description:** Creates a new book exchange request.

**Request Body:**
```json
{
  "bookIdAskedFor": "string",
  "bookIdSent": "string",
  "fromUsername": "string",
  "toUsername": "string"
}
```
**Request Headers:**

```Authorization: Bearer <token>```
Response:

## Endpoint: /book-exchange/received/:username

**Method:** GET

**Description:** Retrieves all book exchange requests received by a user.

**Request Headers:**

```Authorization: Bearer <token>```

## Endpoint: /book-exchange/sent/:username

**Method:** GET

**Description:** Retrieves all book exchange requests sent by a user.

**Request Headers:**

```Authorization: Bearer <token>```

**Endpoint**: /book-exchange/accept/:exchangeId

**Method:** POST

**Description:** Accepts a book exchange request and swaps the ownership of the books.

**Request Headers:**

```Authorization: Bearer <token>```
Response:

**Endpoint**: /book-exchange/refuse/:exchangeId

**Method:** POST

**Description:** Refuses a book exchange request and removes it from the system.

**Request Headers:**

```Authorization: Bearer <token>```
Response:

## Dependencies

This project requires the following dependencies:

- **express**: A web framework for Node.js.
- **mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.
- *jsonwebtoken**: A library to work withJSON Web Tokens.
- **bcryptjs**: A library to hash passwords and manage user authentication.
- **dotenv**: A module to load environment variables from a `.env` file.
- **cors**: A package to enable Cross-Origin Resource Sharing.

## Security
The API uses JWT for authentication. Ensure the Authorization header contains a valid JWT token for protected routes.