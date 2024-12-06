import React, { useEffect, useState } from "react";
import axios from "axios";
import AddBookForm from "./AddBookForm";
import "../App.css";

// Book type interface
interface Book {
  id: number;
  title: string;
  author: string;
}

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);

  // Fetch books from the backend
  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/books");
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
      alert("Failed to fetch books. Please try again.");
    }
  };

  // Fetch books on component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="container">
      {/* Pass setBooks to AddBookForm to allow adding books dynamically */}
      <AddBookForm setBooks={setBooks} />
      <div className="book-list">
        <h1>Book List</h1>
        {books.length > 0 ? (
          <ul>
            {books.map((book) => (
              <li key={book.id}>
                <div className="book-card">
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No books available.</p>
        )}
      </div>
    </div>
  );
};

export default BookList;
