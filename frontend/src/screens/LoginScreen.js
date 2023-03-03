import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { login } from "../actions/userActions";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Google Login
    // const [isGoogleAuth, setIsGoogleAuth] = useState(false);
    // const [authEmail, setAuthEmail] = useState("");
    // const [authID, setAuthID] = useState("");

    const dispatch = useDispatch();
    const location = useLocation();

    const userLogin = useSelector((state) => state.userLogin);
    const { loading, error, userInfo } = userLogin;

    const redirect = location.search ? location.search.split("=")[1] : "/";

    const navigate = useNavigate();

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
        apiKey: "AIzaSyDsCd6JQQZ3nGN-O-v_I06QcBIGUSLXYhk",
        authDomain: "mern-login-auth.firebaseapp.com",
        projectId: "mern-login-auth",
        storageBucket: "mern-login-auth.appspot.com",
        messagingSenderId: "612827669022",
        appId: "1:612827669022:web:251718361a3507cfd0840f",
        measurementId: "G-72J130SXL6",
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const analytics = getAnalytics(app);
    // Create a Google provider instance
    const provider = new GoogleAuthProvider();

    // Implement Google Sign-In
    const googleLoginHandler = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential =
                    GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                console.log(token, user);
            })
            .catch((error) => {
                // Handle errors here
                console.error(error);
            });
    };

    // const getGoogleLogin = firebase.auth().onAuthStateChanged((user) => {
    //     if (user) {
    //         const { uid, email, displayName, photoURL } = user;
    //         // Use the user data to create a user account in your MERN app
    //         setAuthID(uid);
    //         setAuthEmail(email);
    //         console.log(displayName);
    //         console.log(photoURL);
    //     } else {
    //         // The user is signed out
    //     }
    // });

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, userInfo, redirect]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    };

    return (
        <FormContainer>
            <h1>Sign In</h1>
            {error && <Message variant="danger">{error}</Message>}
            {loading && <Loader />}
            <Form onSubmit={submitHandler}>
                <Form.Group controlId="email">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        autoComplete="off"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type="submit" variant="primary">
                    Sign In
                </Button>
            </Form>

            <Row className="py-3">
                <Col>
                    New Customer?{" "}
                    <Link
                        to={
                            redirect
                                ? `/register?redirect=${redirect}`
                                : "/register"
                        }
                    >
                        Register
                    </Link>
                </Col>
            </Row>

            <Row className={"py-3"}>
                <Button
                    type={"button"}
                    variant={"primary"}
                    onClick={googleLoginHandler}
                >
                    Sign in with Google
                </Button>
                {/*<Button*/}
                {/*    type={"button"}*/}
                {/*    variant={"primary"}*/}
                {/*    onClick={getGoogleLogin}*/}
                {/*>*/}
                {/*    Display Google Login Info*/}
                {/*</Button>*/}
                {/*<ul>*/}
                {/*    <li>{authID !== "" && authID}</li>*/}
                {/*    <li>{authEmail !== "" && authEmail}</li>*/}
                {/*</ul>*/}
            </Row>
        </FormContainer>
    );
};

export default LoginScreen;
