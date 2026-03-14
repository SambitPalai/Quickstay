import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"

const NavBar = () => {
    const [showAccount, setShowAccount] = useState(false)
    const { isLoggedIn, isAdmin, logout, user } = useAuth()
    const navigate = useNavigate()

    const handleAccountClick = () => setShowAccount(!showAccount)

    const handleLogout = () => {
        logout()
        setShowAccount(false)
        navigate("/login")
    }

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary px-5 shadow sticky-top">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">
                    <span className="hotel-color">Quickstay</span>
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarScroll"
                    aria-controls="navbarScroll"
                    aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarScroll">
                    <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll gap-lg-3">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/browse-all-rooms">
                                Browse all rooms
                            </NavLink>
                        </li>

                        {/* Admin link — only visible to ADMIN */}
                        {isAdmin() && (
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/admin">
                                    Admin Panel
                                </NavLink>
                            </li>
                        )}
                    </ul>

                    <ul className="navbar-nav ms-auto d-flex align-items-lg-center gap-lg-3">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/find-booking">
                                Find my booking
                            </NavLink>
                        </li>

                        <li className="nav-item dropdown">
                            <a
                                className={`nav-link dropdown-toggle ${showAccount ? "show" : ""}`}
                                href="#"
                                role="button"
                                onClick={handleAccountClick}>
                                {/* Show name when logged in */}
                                {isLoggedIn() ? `Hi, ${user.name}` : "Account"}
                            </a>
                            <ul className={`dropdown-menu dropdown-menu-end ${showAccount ? "show" : ""}`}>
                                {isLoggedIn() ? (
                                    <>
                                        <li>
                                            <Link to="/profile" className="dropdown-item"
                                                onClick={() => setShowAccount(false)}>
                                                My Profile
                                            </Link>
                                        </li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <button className="dropdown-item text-danger"
                                                onClick={handleLogout}>
                                                Logout
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li>
                                            <Link to="/login" className="dropdown-item"
                                                onClick={() => setShowAccount(false)}>
                                                Login
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/signup" className="dropdown-item"
                                                onClick={() => setShowAccount(false)}>
                                                Sign Up
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default NavBar