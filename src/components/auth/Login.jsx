import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Form, FormControl, Button } from "react-bootstrap"
import { loginUser } from "../utils/ApiFunctions"
import { useAuth } from "./AuthContext"
import Header from "../common/Header"

const Login = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" })
    const [errorMessage, setErrorMessage]   = useState("")
    const [isLoading, setIsLoading]         = useState(false)

    const { login } = useAuth()
    const navigate  = useNavigate()
    const location  = useLocation()

    // Redirect back to where they came from, or home
    const from = location.state?.from?.pathname || "/"

    const handleChange = (e) => {
        const { name, value } = e.target
        setCredentials((prev) => ({ ...prev, [name]: value }))
        setErrorMessage("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setErrorMessage("")
        try {
            const userData = await loginUser(credentials)
            login(userData)                          // save to context + localStorage
            navigate(from, { replace: true })        // redirect
        } catch (error) {
            setErrorMessage(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mt-5 mb-5">
            <Header title="Login" />
            <div className="row justify-content-center mt-4">
                <div className="col-12 col-sm-10 col-md-8 col-lg-5">
                    {errorMessage && (
                        <div className="alert alert-danger fade show" role="alert">
                            {errorMessage}
                        </div>
                    )}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="email">Email</Form.Label>
                            <FormControl
                                required
                                type="email"
                                id="email"
                                name="email"
                                value={credentials.email}
                                placeholder="Enter your email"
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="password">Password</Form.Label>
                            <FormControl
                                required
                                type="password"
                                id="password"
                                name="password"
                                value={credentials.password}
                                placeholder="Enter your password"
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <div className="d-flex align-items-center justify-content-between">
                            <Button type="submit" className="btn btn-hotel" disabled={isLoading}>
                                {isLoading ? "Logging in..." : "Login"}
                            </Button>
                            <Link to="/signup" className="text-decoration-none">
                                Don't have an account? Sign up
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default Login