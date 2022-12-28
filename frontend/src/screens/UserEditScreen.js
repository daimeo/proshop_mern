import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { getUserDetails, updateUser } from "../actions/userActions";
import { USER_UPDATE_RESET } from "../constants/userConstants";

const UserEditScreen = () => {
    const params = useParams();
    const userId = params.id;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditor, setIsEditor] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [disabledAt, setDisabledAt] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userDetails = useSelector((state) => state.userDetails);
    const { loading, error, user } = userDetails;

    const userUpdate = useSelector((state) => state.userUpdate);
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = userUpdate;

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: USER_UPDATE_RESET });
            navigate("/admin/userlist");
        } else {
            if (!user.name || user._id !== userId) {
                dispatch(getUserDetails(userId));
            } else {
                setName(user.name);
                setEmail(user.email);
                setIsAdmin(user.isAdmin);
                setIsEditor(user.isEditor);
                setIsDisabled(user.isDisabled);
            }
        }
    }, [dispatch, navigate, userId, user, successUpdate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(
            updateUser({
                _id: userId,
                name,
                email,
                isAdmin,
                isEditor,
                isDisabled,
                disabledAt,
            })
        );
    };

    return (
        <>
            <Link to="/admin/userlist" className="btn btn-light my-3">
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit User</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && (
                    <Message variant="danger">{errorUpdate}</Message>
                )}
                {loading ? (
                    <Loader />
                ) : error ? (
                    <Message variant="danger">{error}</Message>
                ) : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="name"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="email">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="isadmin">
                            <Form.Check
                                type="checkbox"
                                label="Is Admin"
                                checked={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}
                            ></Form.Check>
                        </Form.Group>
                        <Form.Group controlId={"iseditor"}>
                            <Form.Check
                                type={"checkbox"}
                                label={"Is Editor"}
                                checked={isEditor}
                                onChange={(event) =>
                                    setIsEditor(event.target.checked)
                                }
                            ></Form.Check>
                        </Form.Group>
                        <Form.Group controlId={"isdisabled"}>
                            <Form.Check
                                type={"checkbox"}
                                label={"Disable"}
                                checked={isDisabled}
                                onChange={(event) => {
                                    setIsDisabled(event.target.checked);
                                    setDisabledAt(Date());
                                }}
                            ></Form.Check>
                        </Form.Group>

                        <Button type="submit" variant="primary">
                            Update
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </>
    );
};

export default UserEditScreen;
