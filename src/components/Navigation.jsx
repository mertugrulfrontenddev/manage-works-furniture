import { Link } from "react-router-dom";
import { useEffect } from "react";

function Navigation() {
  useEffect(() => {
    // Dropdown menülerinin hover ile açılmasını sağla
    document.querySelectorAll(".nav-item.dropdown").forEach((dropdown) => {
      dropdown.addEventListener("mouseenter", () => {
        dropdown.classList.add("show");
        dropdown.querySelector(".dropdown-menu").classList.add("show");
      });

      dropdown.addEventListener("mouseleave", () => {
        dropdown.classList.remove("show");
        dropdown.querySelector(".dropdown-menu").classList.remove("show");
      });
    });
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        {/* Navbar başlığı */}
        <Link className="navbar-brand" to="/">
          İş Takip Sistemi
        </Link>

        {/* Hamburger Menü Butonu */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menü içeriği */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            {/* EKLE Dropdown Menü */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="ekleDropdown"
                role="button"
              >
                Ekle
              </a>
              <ul className="dropdown-menu" aria-labelledby="ekleDropdown">
                <li>
                  <Link className="dropdown-item" to="/lotform">
                    İş Emri Ekle
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/partadd">
                    Parça Ekle
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/sizing">
                    Ebat Ekle
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/">
                İş Emri Listesi
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/partdetails">
                Parça Detay Sayfası
              </Link>
            </li>

            {/* ÜRETİM Dropdown Menü */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="uretimDropdown"
                role="button"
              >
                Üretim
              </a>
              <ul className="dropdown-menu" aria-labelledby="uretimDropdown">
                <li>
                  <Link className="dropdown-item" to="/sizinglist">
                    Ebatlama
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/banding">
                    Bantlama
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/drilling">
                    Delik
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
