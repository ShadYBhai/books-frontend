import React, { useState } from "react";
import axios from "axios";

// Book type interface
interface Book {
  _id: string;
  title: string;
  author: string;
}

interface AddBookFormProps {
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
}

const AddBookForm: React.FC<AddBookFormProps> = ({ setBooks }) => {
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !author) {
      setError("Both title and author are required.");
      return;
    }

    try {
      const response = await axios.post("/books", {
        title,
        author,
      });

      setBooks((prevBooks) => [
        ...prevBooks,
        { _id: response.data._id, title, author },
      ]);

      setTitle("");
      setAuthor("");
      setError(null);
      alert("Book added!");
    } catch (error) {
      console.error("Error adding book:", error);
      setError("Failed to add book. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <h2>Add a New Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter book title"
          />
        </div>
        <div className="input-group">
          <label>Author:</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter author name"
          />
        </div>
        <button type="submit" className="btn-submit">
          Add Book
        </button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default AddBookForm;
