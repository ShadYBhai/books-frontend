import React, { useEffect, useState } from "react";
import axios from "axios";
import AddBookForm from "./AddBookForm";
import "../App.css";

interface Book {
  id: number;
  title: string;
  author: string;
}

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newAuthor, setNewAuthor] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch books from the backend
  const fetchBooks = async (query = "") => {
    try {
      const response = await axios.get(`/books?query=${query}`);
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
      alert("Failed to fetch books. Please try again.");
    }
  };

  useEffect(() => {
    fetchBooks(searchQuery);
  }, [searchQuery]);

  // Handle delete
  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`/books/${id}`);
      if (response.status === 200) {
        setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
        alert("Book deleted!");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Failed to delete book. Please try again.");
    }
  };

  // Handle edit
  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setNewTitle(book.title);
    setNewAuthor(book.author);
  };

  // Handle submit update
  const handleUpdate = async (id: number) => {
    if (!newTitle || !newAuthor) {
      alert("Please fill in both fields");
      return;
    }

    try {
      // Sending PUT request to update the book
      const response = await axios.put(`/books/${id}`, {
        title: newTitle,
        author: newAuthor,
      });

      // Check if response data has the updated book
      const updatedBook = response.data;

      // Updating the book list with the updated book
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === id
            ? { ...book, title: updatedBook.title, author: updatedBook.author }
            : book
        )
      );

      // Reset editing state and input fields
      setEditingBook(null);
      setNewTitle("");
      setNewAuthor("");
      alert("Book updated!");
    } catch (error) {
      console.error("Error updating book:", error);
      alert("Failed to update book. Please try again.");
    }
  };

  return (
    <div className="container">
      <AddBookForm setBooks={setBooks} />

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title or author"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="book-list">
        <h1>Book List</h1>
        {books.length > 0 ? (
          <ul>
            {books.map((book) => (
              <li key={book.id}>
                <div className="book-card">
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>

                  <button className="btn-edit" onClick={() => handleEdit(book)}>
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(book.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No books available.</p>
        )}
      </div>

      {editingBook && (
        <div className="edit-form">
          <h2>Edit Book</h2>
          <div className="input-group">
            <label>Title:</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter book title"
            />
          </div>
          <div className="input-group">
            <label>Author:</label>
            <input
              type="text"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              placeholder="Enter author name"
            />
          </div>
          <button
            onClick={() => handleUpdate(editingBook.id)}
            className="btn-submit"
          >
            Update Book
          </button>
          <button onClick={() => setEditingBook(null)} className="btn-cancel">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default BookList;
