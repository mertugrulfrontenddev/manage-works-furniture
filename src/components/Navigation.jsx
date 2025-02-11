import { Link } from "react-router-dom"; // Import Link from react-router-dom

function Navigation() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link className="nav-link" to="/lotform">
            İş Emri Ekle
          </Link>{" "}
          {/* Link to Lot Form */}
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/">
            İş Emri Listesi
          </Link>{" "}
          {/* Link to Lot List */}
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/partdetails">
            Parça Detay Sayfası
          </Link>{" "}
          {/* Link to Part Details */}
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/partadd">
            Parça Ekle
          </Link>{" "}
          {/* Link to Part Add */}
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/sizing">
            Ebatlama Ekle
          </Link>{" "}
          {/* Link to Part Add */}
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/banding">
            Bantlama
          </Link>{" "}
          {/* Link to Part Add */}
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/drilling">
            Delik
          </Link>{" "}
          {/* Link to Part Add */}
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
