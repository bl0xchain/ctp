import { useEffect, useState } from "react";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Header from "../components/Header";
import Login from "../components/Login";
import NotAllowed from "../components/NotAllowed";
import { createUser, reset } from "../features/auth/authSlice";

const CreateUser = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")

    const dispatch = useDispatch()
    const { user, isLoading, isError, isSuccess, message } = useSelector( (state) => state.auth )

    const handleCreateUser = (e) => {
        e.preventDefault()
        if(password !== password2) {
            toast.error('Passwords do not match')
        } else if(name === "" || email === '' || password === '') {
            toast.error('All fields are needed')
        } else {
            const userData = {
                name, email, password
            }
            dispatch(createUser(userData)) 
        }
    }

    useEffect(() => {
        if(isError) {
            toast.error(message)
        }
        if(isSuccess) {
            toast.success("User Created.")
        }
        dispatch(reset())
        setName("")
        setEmail("")
        setPassword("")
        setPassword2("")
    }, [isError, isSuccess, message, dispatch])

    return (
        <>
            <Header />
            <Container className="py-5" style={{ minHeight: "calc(100vh - 221px)" }}>
                {
                    ! user ?
                    <Login /> :
                    <>
                    {
                        user.isAdmin ?
                        <div className="mx-auto text-center" style={{ maxWidth: "400px" }}>
                            <h2 className="mb-5">Create User</h2>
                            <Form onSubmit={handleCreateUser}>
                                <Form.Group className="mb-3" controlId="formName">
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formConfirmPassword">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control type="password" placeholder="Confirm Password" value={password2} onChange={(e) => setPassword2(e.target.value)} />
                                </Form.Group>
                                {
                                    isLoading ?
                                    <Button variant="primary" type="submit" disabled>
                                        Creating User {" "} <Spinner size="sm" />
                                    </Button> :
                                    <Button variant="primary" type="submit">
                                        Create User
                                    </Button>
                                }
                            </Form>
                        </div> :
                        <NotAllowed />
                    }
                    </>
                }
                
            </Container>
        </>
    );
};

export default CreateUser;
