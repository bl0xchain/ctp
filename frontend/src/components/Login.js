import { useEffect, useState } from "react"
import { Button, Form, Spinner } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { login, reset } from "../features/auth/authSlice"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const dispatch = useDispatch()
    const { user, isLoading, isError, isSuccess, message } = useSelector( (state) => state.auth )

    const handleLogin = (e) => {
        e.preventDefault()
        if(email === "" || password === "") {
            toast.error("Please enter email and password")
        } else {
            dispatch(login({ email, password }))
        }
    }

    useEffect(() => {
        if(isError) {
            toast.error(message)
        }
        if(isSuccess) {
            toast.success("Login successful.")
        }
        dispatch(reset())
    }, [isError, isSuccess, message, dispatch])

    return (
        <>
        {
            user ?
            <p>Already Logged in</p> :
            <div className="mx-auto text-center" style={{ maxWidth: "400px" }}>
                <h2 className="mb-5">Login</h2>
                <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    {
                        isLoading ?
                        <Button variant="primary" type="submit" disabled>
                            Logging in {" "} <Spinner size="sm" />
                        </Button> :
                        <Button variant="primary" type="submit">
                            Login
                        </Button>
                    }
                </Form>
            </div>
        }
        </>
    )
}

export default Login