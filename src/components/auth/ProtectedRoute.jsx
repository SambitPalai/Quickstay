import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthContext"

// Usage:
// <ProtectedRoute>              → any logged-in user
// <ProtectedRoute adminOnly>   → ADMIN only

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isLoggedIn, isAdmin } = useAuth()

    if (!isLoggedIn()) {
        return <Navigate to="/login" replace />
    }

    if (adminOnly && !isAdmin()) {
        return <Navigate to="/unauthorized" replace />
    }

    return children
}

export default ProtectedRoute