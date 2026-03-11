import React, { useState } from 'react'
import { Form, FormControl, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Header from '../common/Header'

const Signup = () => {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
        setErrorMessage("")
        setSuccessMessage("")
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setErrorMessage("")
        setSuccessMessage("")
        if (form.password !== form.confirmPassword) {
            setErrorMessage("Passwords do not match")
            return
        }
        setSuccessMessage("Sign up successful. You can now log in.")
    }

    return (
        <>
        <div className="container mt-5 mb-5">
            <Header title="Sign Up" />
            <div className="row justify-content-center mt-4">
                <div className="col-12 col-sm-10 col-md-8 col-lg-6">
                    {errorMessage && (
                        <div className="alert alert-danger fade show" role="alert">
                            {errorMessage}
                        </div>
                    )}
                    {successMessage && (
                        <div className="alert alert-success fade show" role="alert">
                            {successMessage}
                        </div>
                    )}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="fullName">Full Name</Form.Label>
                            <FormControl
                                required
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={form.fullName}
                                placeholder="Enter your full name"
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="email">Email</Form.Label>
                            <FormControl
                                required
                                type="email"
                                id="email"
                                name="email"
                                value={form.email}
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
                                value={form.password}
                                placeholder="Create a password"
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="confirmPassword">Confirm Password</Form.Label>
                            <FormControl
                                required
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                placeholder="Re-enter your password"
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <div className="d-flex align-items-center justify-content-between">
                            <Button type="submit" className="btn btn-hotel">
                                Sign Up
                            </Button>
                            <Link to="/login" className="text-decoration-none">
                                Already have an account? Log in
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
        </>
    )
}

export default Signup
