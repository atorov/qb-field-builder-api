# qb-field-builder-api

This is a Node.js/Express application for building and validating form configurations. The API is designed to validate and process form data, ensuring that the provided data adheres to specified rules.

## Features

-   **Data Validation**: Uses Zod for schema validation.
-   **Security**: Implements Helmet for security.
-   **Compression**: Uses compression middleware to reduce the size of the response body.
-   **Error Handling**: Custom error handling for various scenarios.

## Live Demo

The API is deployed on Railway.app and is publicly accessible at:
**<https://qb-field-builder-api-production.up.railway.app/api/>**

-   GET <https://qb-field-builder-api-production.up.railway.app/api/health>
-   POST <https://qb-field-builder-api-production.up.railway.app/api/builder>

## Getting Started

### Prerequisites

-   Node.js
-   npm

### Installation

1. Clone the repository

    ```sh
    git clone https://github.com/atorov/qb-field-builder-api.git
    ```

2. Install NPM packages

    ```sh
    npm install
    ```

3. Alternative installation script

    ```sh
    npm install --legacy-peer-deps
    ```

### Running the App

-   Development mode

    ```sh
    npm run dev
    ```

-   Production mode

    ```sh
    npm start
    ```

### Building the App

```sh
npm run build
```

## API Endpoints

### Health Check

#### GET /api/health

**Description**: Check if the server is running.

**Response**:

```json
{
    "message": "Server is up and running..."
}
```

### Form Builder

#### POST /api/builder

**Description**: Validates and processes form data.

**Request Body**:

```json
{
    "choices": ["string"],
    "default": "string",
    "displayOrder": "alphabetically_ascending | alphabetically_descending | predefined | natural_number_ascending | natural_number_descending",
    "label": "string",
    "multiselect": true,
    "required": true
}
```

**Response**:

```json
{
    "choices": ["string"],
    "default": "string",
    "displayOrder": "alphabetically_ascending | alphabetically_descending | predefined | natural_number_ascending | natural_number_descending",
    "label": "string",
    "multiselect": true,
    "required": true
}
```

**Error Responses**:

-   **404 Not Found**: Returned if the requested route does not exist.

    ```json
    {
        "message": "::: Error! Could not find this route!"
    }
    ```

-   422 Unprocessable Entity: Invalid data provided

    ```json
    {
        "message": "Error message detailing the validation issue"
    }
    ```

-   **500 Internal Server Error**: Returned for any other errors.

    ```json
    {
        "message": "::: Error! An unknown error occurred!"
    }
    ```

### Explanation of the /api/builder Endpoint

The `/api/builder` endpoint is the core of this application. It takes a JSON payload containing form configuration details, validates the data against a predefined schema using Zod, and processes it. The endpoint ensures:

-   **Choices Validation**: The `choices` array must contain at least one string.
-   **Default Choice Validation**: The `default` string must be non-empty and unique within the `choices` array.
-   **Display Order**: The `displayOrder` value must be one of the specified enum values.
-   **Label Validation**: The `label` string must be at least 2 characters long.
-   **Multiselect and Required**: Both must be boolean values.
-   **Uniqueness and Length Constraints**: The combined set of `choices` and `default` must contain up to 5 unique values, with **each value truncated to a maximum length of 40 characters** if necessary.

## Project Structure

-   **src/app.ts**: Main application file.

## Dependencies

-   **express**: Fast, unopinionated, minimalist web framework for Node.js.
-   **helmet**: Helps secure Express apps by setting various HTTP headers.
-   **compression**: Node.js compression middleware.
-   **zod**: TypeScript-first schema declaration and validation library.

## Dev Dependencies

-   **typescript**: TypeScript is a superset of JavaScript that compiles to clean JavaScript output.
-   **tsx**: TypeScript execution engine.
-   **eslint**: Pluggable and configurable linter tool for identifying and reporting on patterns in JavaScript.
-   **prettier**: An opinionated code formatter.

```

```
