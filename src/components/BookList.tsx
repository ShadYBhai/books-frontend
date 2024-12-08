import React, { useEffect, useState } from "react";
import axios from "axios";
import AddBookForm from "./AddBookForm";
import "../App.css";

interface Book {
  _id: string;
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
      const url = query ? `/books/search?query=${query}` : `/books`;
      const response = await axios.get(url);
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
      alert("Failed to fetch books. Please try again.");
    }
  };
  // Handle delete
  const handleDelete = async (_id: string) => {
    try {
      const response = await axios.delete(`/books/${_id}`);
      if (response.status === 200) {
        setBooks((prevBooks) => prevBooks.filter((book) => book._id !== _id));
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
  const handleUpdate = async (_id: string) => {
    // Keep _id as string if backend expects string
    if (!newTitle || !newAuthor) {
      alert("Please fill in both fields");
      return;
    }

    try {
      const response = await axios.put(`/books/${_id}`, {
        title: newTitle,
        author: newAuthor,
      });

      const updatedBook = response.data;
      setBooks((prevBooks) =>
        prevBooks.map(
          (book) => (book._id === _id ? { ...book, ...updatedBook } : book) // Convert book.id to string
        )
      );

      setEditingBook(null);
      setNewTitle("");
      setNewAuthor("");
      alert("Book updated!");
    } catch (error) {
      console.error("Error updating book:", error);
      alert("Failed to update book. Please try again.");
    }
  };

  useEffect(() => {
    fetchBooks(searchQuery);
  }, [searchQuery]);

  console.log(books);

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
              <li key={book._id}>
                <div className="book-card">
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>

                  <button className="btn-edit" onClick={() => handleEdit(book)}>
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(book._id)}
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
            onClick={() => {
              if (editingBook) {
                handleUpdate(editingBook._id);
              } else {
                alert("No book selected for editing.");
              }
            }}
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
