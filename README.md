# API Companies Documentation

Welcome to the API documentation for Companies. This API allows you to access data about companies and their establishments from a database.

## Base URL

The base URL for accessing the API is: `http://localhost:3000` (or your deployed domain).

## Endpoints

### Retrieve all companies

Retrieve the list of companies with pagination and name filtering options.

**URL:** `/companies`

**Method:** `GET`

**Parameters:**
- `page` (optional): Page number for pagination (default: 1).
- `name` (optional): Filter companies by name.

**Usage Examples:**
- Retrieve the first page of companies: `/companies?page=1`
- Filter companies by name: `/companies?name=Example`

### Retrieve a Company by ID

Retrieve information about a company based on its ID.

**URL:** `/companies/:id`

**Method:** `GET`

**Parameters:**
- `id`: The ID of the company.

**Usage Example:**
- Retrieve information about the company with ID 1: `/companies/1`

### Retrieve Establishments of a Company

Retrieve the list of establishments belonging to a company based on its ID.

**URL:** `/establishments/company/:id`

**Method:** `GET`

**Parameters:**
- `id`: The ID of the company.

**Usage Example:**
- Retrieve establishments of the company with ID 1: `/establishments/company/1`

## Errors

The API may return responses with the following HTTP error codes:

- `404 Not Found`: URL not valid.
- `500 Internal Server Error`: An internal error has occurred.

## Notes

- The returned data is in JSON format.
- Make sure to respect the correct case and syntax for URLs and parameters.

---