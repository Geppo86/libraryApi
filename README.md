# Library Management System

## Overview

The **Library Management System** is a web-based application designed to manage the catalog of a library. It includes features for user authentication, book management, and review submission. The system is designed for both librarians and regular users, with different levels of access depending on the user role.

### Key Features

- **User Authentication**: Supports registration and login for both customers and librarians.
- **Role-Based Access Control**: Different functionalities are available depending on whether the user is a librarian or a customer.
- **Book Management**: Librarians can add, edit, and remove books from the library catalog.
- **Book Checkout and Return**: Customers can check out and return books. The system tracks who has checked out a book and when it is due back.
- **Reviews and Ratings**: Users can leave reviews and ratings for books, and the system calculates an average rating for each book.

## Technology Stack

- **Frontend**: React, TypeScript, Material-UI
- **Backend**: ASP.NET Core Web API
- **Database**: Entity Framework Core with SQLite  or SQL Server
- **Authentication**: ASP.NET Core Identity

### Prerequisites

Before running the application, ensure you have the following installed:

- [.NET SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) and npm
- [SQLite](https://www.sqlite.org/) or SQL Server for database


1. **Clone the Repository**:
   git clone [https://github.com/yourusername/library-management-system.git](https://github.com/Geppo86/libraryApi.git)


2. **Navigate to the Backend Directory**:
 bash:  cd LibraryApi


3. **Install Dependencies**:
bash:   dotnet restore


4. **Apply Migrations**:
bash:   dotnet ef database update


5. **Run the Application**:
bash:   dotnet run


#### Frontend (React)

1. **Navigate to the Frontend Directory**:
bash:   cd ClientApp

2. **Install Dependencies**:
bash:   npm install


3. **Run the Frontend**:
bash:   npm start

### Seeding the Database

The application includes a database initializer that seeds the database with roles, users, and sample book data. This occurs automatically on application startup if the database is empty.

## Project Structure
src/
├── components/
│   ├── Auth/               # Components for user authentication (Login, SignUp)
│   ├── Books/              # Components for book-related features (BookList, BookDetails)
│   ├── Header.tsx          # Header component with user info and logout functionality
│   ├── HomePage.tsx        # Home page component
│   ├── NotFound.tsx        # 404 Not Found page component
│   ├── ProtectedRoute.tsx  # ProtectedRoute component for route protection
│   └── App.tsx             # Main application component
├── models/                 # Backend models (Book, Review, ApplicationUser)
├── controllers/            # API controllers for handling requests
├── services/               # Services for business logic and data access
├── DbInitializer.cs        # Seeds the database with initial data
└── README.md               # This file


## API Endpoints

### Authentication

- POST /api/Auth/login - Login a user.
- POST /api/Auth/register - Register a new user.

### Books

- GET /api/Books - Retrieve a list of all books.
- GET /api/Books/{id} - Retrieve details of a specific book by ID.
- POST /api/Books - Add a new book (Librarian only).
- PUT /api/Books/{id} - Edit an existing book (Librarian only).
- DELETE `/api/Books/{id} - Delete a book (Librarian only).
- POST `/api/Books/{id}/checkout - Checkout a book.
- POST /api/Books/{id}/return - Return a checked-out book.
- GET /api/Books/{id}/reviews - Get reviews for a specific book.
- POST /api/Books/{id}/review - Add a review to a specific book.

## Contributing

Contributions are welcome! Please fork this repository and submit a pull request with your changes. Be sure to follow the established coding style and include appropriate tests.

## Contact

For questions or support, please contact peppemiretto@gmail.com.

