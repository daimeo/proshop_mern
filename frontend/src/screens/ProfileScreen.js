import React, { useState, useEffect } from "react";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getUserDetails, updateUserProfile } from "../actions/userActions";
import { cancelOrder, listMyOrders } from "../actions/orderActions";
import { USER_UPDATE_PROFILE_RESET } from "../constants/userConstants";
import { useNavigate } from "react-router-dom";
// import moment from "moment";
import moment from "moment-timezone";
import { DateTime } from "luxon";
// import Breadcrumbs from "../components/Breadcrumbs";

const ProfileScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const dispatch = useDispatch();
    // const location = useLocation();
    const navigate = useNavigate();

    const userDetails = useSelector((state) => state.userDetails);
    const { loading, error, user } = userDetails;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
    const { success } = userUpdateProfile;

    const orderListMy = useSelector((state) => state.orderListMy);
    const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;

    const { success: successCancel } = useSelector(
        (state) => state.orderCancel
    );

    const orderDetails = useSelector((state) => state.orderDetails);
    const { order } = orderDetails;

    // console.log("ORDER: " + JSON.stringify(order._id));

    useEffect(() => {
        // console.log(JSON.stringify(successOrders));
        if (!userInfo) {
            navigate("/login");
        } else {
            if (!user || !user.name || success) {
                dispatch({ type: USER_UPDATE_PROFILE_RESET });
                dispatch(getUserDetails("profile"));
                dispatch(listMyOrders());
            } else {
                setName(user.name);
                setEmail(user.email);
            }
        }

        if (successCancel) {
            dispatch(listMyOrders());
        }

        // if (order.orderStatus === "New") {
        //     setDisabled(false);
        // }
    }, [dispatch, navigate, userInfo, user, success, order, successCancel]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
        } else {
            dispatch(
                updateUserProfile({ id: user._id, name, email, password })
            );
        }
    };

    const goBack = () => {
        navigate(-1); // Equivalent to hitting the back button.
    };

    const cancelOrderHandler = (id) => {
        if (window.confirm("Are you sure?")) {
            // console.log("cancelOrderHandler ID: " + order._id);
            // console.log("cancelOrderHandler is running...");
            const now = moment().format("DD/MM/YYYY HH:mm:ss");
            const now1 = moment()
                .tz("Asia/Tokyo")
                .format("DD/MM/YYYY HH:mm:ss");
            const now2 = new Date();
            const now3 = DateTime.now().setZone("Asia/Ho_Chi_Minh").toJSDate();
            const now4 = DateTime.now().toString();
            // .minus({ weeks: 1 })
            // .endOf("day")
            // .toFormat("dd/MM/yyyy HH:mm:ss");
            // .toISO();
            console.log(
                new Intl.DateTimeFormat("vi-VN", {
                    dateStyle: "short",
                    timeStyle: "medium",
                    timeZone: "Asia/Ho_Chi_Minh",
                }).format(now2)
            );
            console.log(now);
            console.log(now1);
            console.log(now3);
            console.log("NOW4: " + now4);

            const now5 = new Date().toLocaleString("vi-VN", {
                timeZone: "Asia/Ho_Chi_Minh",
            });

            console.log("NOW 5: " + now5);

            const now6 = new Date();

            function createDateAsUTC(date) {
                return new Date(
                    Date.UTC(
                        date.getFullYear(),
                        date.getMonth(),
                        date.getDate(),
                        date.getHours(),
                        date.getMinutes(),
                        date.getSeconds()
                    )
                );
            }

            console.log("NOW6 " + createDateAsUTC(now6));

            console.log(
                "NOW6 GET UTC: " +
                    new Date(
                        now6.getUTCFullYear(),
                        now6.getUTCMonth(),
                        now6.getUTCDate(),
                        now6.getUTCHours(),
                        now6.getUTCMinutes(),
                        now6.getUTCSeconds()
                    )
            );

            dispatch(cancelOrder(id, "Canceled", now4));
            // console.log("AFTER setUpdate: " + update);
            // console.log(
            //     "ORDER ID in Profile Screen after dispatch: " +
            //         JSON.stringify(id)
            // );
            // console.log(
            //     "ORDER in Profile Screen after dispatch: " +
            //         JSON.stringify(orders)
            // );
        }
    };

    // const deleteHandler = (id) => {
    //     if (window.confirm("Are you sure?")) {
    //         dispatch(deleteOrder(id));
    //     }
    // };

    return (
        <>
            {/*<Breadcrumbs />*/}
            <Button type={"button"} variant={"light"} onClick={() => goBack()}>
                Go Back
            </Button>
            <Row>
                <Col md={3}>
                    <h2>User Profile</h2>
                    {message && <Message variant="danger">{message}</Message>}
                    {success && (
                        <Message variant="success">Profile Updated</Message>
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

                            <Form.Group controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    autoComplete="off"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group controlId="confirmPassword">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm password"
                                    autoComplete="off"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                ></Form.Control>
                            </Form.Group>

                            <Button type="submit" variant="primary">
                                Update
                            </Button>
                        </Form>
                    )}
                </Col>
                <Col md={9}>
                    <h2>My Orders</h2>
                    {loadingOrders ? (
                        <Loader />
                    ) : errorOrders ? (
                        <Message variant="danger">{errorOrders}</Message>
                    ) : (
                        <Table
                            striped
                            bordered
                            hover
                            responsive
                            className="table-sm"
                        >
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>DATE</th>
                                    <th>TOTAL</th>
                                    <th>STATUS</th>
                                    <th>PAID</th>
                                    <th>DELIVERED</th>
                                    <th>
                                        <i className={"fa-solid fa-gear"}></i>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>
                                            {order.createdAt.substring(0, 10)}
                                        </td>
                                        <td>${order.totalPrice}</td>
                                        <td>
                                            {order.orderStatus === "New" ? (
                                                <span className={"text-info"}>
                                                    {order.orderStatus}
                                                </span>
                                            ) : order.orderStatus ===
                                              "Confirmed" ? (
                                                <span
                                                    className={"text-success"}
                                                >
                                                    {order.orderStatus}
                                                </span>
                                            ) : (
                                                <span className={"text-danger"}>
                                                    {order.orderStatus}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            {/* TODO: Convert to dd/MM/yyyy hh:mm:ss UTC +7 */}
                                            {order.isPaid ? (
                                                <span>
                                                    {order.paidAt}{" "}
                                                    <i
                                                        className="fa-regular fa-circle-xmark fa-bounce"
                                                        color={"green"}
                                                    ></i>
                                                </span>
                                            ) : (
                                                <span>
                                                    <i
                                                        className="fa-regular fa-circle-xmark fa-beat-fade"
                                                        color={"red"}
                                                    ></i>
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            {order.isDelivered ? (
                                                <span>
                                                    {order.deliveredAt.substring(
                                                        0,
                                                        10
                                                    )}{" "}
                                                    <i
                                                        className="fa-regular fa-circle-xmark fa-bounce"
                                                        color={"green"}
                                                    ></i>
                                                </span>
                                            ) : (
                                                <span>
                                                    <i
                                                        className="fa-regular fa-circle-xmark fa-spin"
                                                        color={"red"}
                                                    ></i>
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <div
                                                className={
                                                    "d-flex justify-content-around"
                                                }
                                            >
                                                <LinkContainer
                                                    to={`/order/${order._id}`}
                                                >
                                                    <Button
                                                        className="btn-sm"
                                                        variant="light"
                                                    >
                                                        Details
                                                    </Button>
                                                </LinkContainer>
                                                {/*<Button*/}
                                                {/*    variant="danger"*/}
                                                {/*    className="btn-sm mx-2"*/}
                                                {/*    onClick={() =>*/}
                                                {/*        deleteHandler(order._id)*/}
                                                {/*    }*/}
                                                {/*>*/}
                                                {/*    <i*/}
                                                {/*        className="fa-regular fa-trash-can"*/}
                                                {/*        // style={{*/}
                                                {/*        //     color: "red",*/}
                                                {/*        // }}*/}
                                                {/*    ></i>*/}
                                                {/*</Button>*/}
                                                <Button
                                                    className="btn-sm mx-2"
                                                    variant="light"
                                                    disabled={
                                                        order.orderStatus !==
                                                        "New"
                                                    }
                                                    onClick={() => {
                                                        cancelOrderHandler(
                                                            order._id
                                                        );
                                                    }}
                                                >
                                                    <i
                                                        className="fa-regular fa-trash-can"
                                                        style={{
                                                            color: "red",
                                                        }}
                                                    ></i>{" "}
                                                    Cancel
                                                </Button>
                                                {/*)}*/}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Col>
            </Row>
        </>
    );
};

export default ProfileScreen;
