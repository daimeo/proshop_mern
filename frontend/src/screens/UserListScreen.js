import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listUsers, deleteUser, disableUser } from "../actions/userActions";
import { useNavigate } from "react-router-dom";

const UserListScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userList = useSelector((state) => state.userList);
    const { loading, error, users } = userList;

    const userDetails = useSelector((state) => state.userDetails);
    const { user } = userDetails;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const userDelete = useSelector((state) => state.userDelete);
    const { success: successDelete } = userDelete;

    const userDisable = useSelector((state) => state.userDisable);
    const { success: successDisabled } = userDisable;

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listUsers());
        } else {
            navigate("/login");
        }

        if (successDisabled) {
            dispatch(listUsers());
        }
    }, [dispatch, navigate, successDelete, successDisabled, userInfo, user]);

    const disableHandler = (id) => {
        // console.log("USER ID: " + id);

        const now = Date.now();
        if (window.confirm("Are you sure?")) {
            dispatch(disableUser(id, true, now));
        }
    };

    const deleteHandler = (id) => {
        if (window.confirm("Are you sure")) {
            dispatch(deleteUser(id));
        }
    };

    return (
        <>
            <h1>Users</h1>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <Table striped bordered hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>ADMIN</th>
                            <th>EDITOR</th>
                            <th>DISABLED</th>
                            <th>
                                <i className={"fa-solid fa-gear"}></i>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>
                                    <a href={`mailto:${user.email}`}>
                                        {user.email}
                                    </a>
                                </td>
                                <td>
                                    {user.isAdmin ? (
                                        <i
                                            className="fa-solid fa-check"
                                            style={{ color: "green" }}
                                        ></i>
                                    ) : (
                                        <i
                                            className="fa-solid fa-times"
                                            style={{ color: "red" }}
                                        ></i>
                                    )}
                                </td>
                                <td>
                                    {user.isEditor ? (
                                        <i
                                            className="fa-solid fa-check"
                                            style={{ color: "green" }}
                                        ></i>
                                    ) : (
                                        <i
                                            className="fa-solid fa-times"
                                            style={{ color: "red" }}
                                        ></i>
                                    )}
                                </td>
                                <td>
                                    {user.isDisabled ? (
                                        <i
                                            className="fa-solid fa-check"
                                            style={{ color: "green" }}
                                        ></i>
                                    ) : (
                                        <i
                                            className="fa-solid fa-times"
                                            style={{ color: "red" }}
                                        ></i>
                                    )}
                                </td>
                                <td>
                                    <LinkContainer
                                        to={`/admin/user/${user._id}/edit`}
                                    >
                                        <Button
                                            variant="light"
                                            className="btn-sm"
                                        >
                                            <i className="fa-solid fa-edit"></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button
                                        variant={"danger"}
                                        className={"btn-sm"}
                                        onClick={() => disableHandler(user._id)}
                                    >
                                        <i className="fa-solid fa-trash"></i>{" "}
                                        Disable
                                    </Button>
                                    <Button
                                        variant="danger"
                                        className="btn-sm"
                                        onClick={() => deleteHandler(user._id)}
                                    >
                                        <i className="fa-solid fa-trash"></i>{" "}
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    );
};

export default UserListScreen;
