import "./App.css";
import BookList from "./components/BookList";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";

const App: React.FC = () => (
  <div>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<BookList />} />
      </Routes>
    </Router>
  </div>
);

export default App;
