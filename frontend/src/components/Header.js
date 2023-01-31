import React from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import SearchBox from "./SearchBox";
import { logoutUser } from "../actions/userActions";

const Header = () => {
    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const logoutHandler = () => {
        // dispatch(logout());
        dispatch(logoutUser());
    };

    return (
        <header>
            <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect>
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand>DemoShop</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Routes>
                            <Route
                                render={({ history }) => (
                                    <SearchBox history={history} />
                                )}
                            />
                        </Routes>
                        <Nav className="ms-auto ml-auto">
                            <LinkContainer to="/cart">
                                <Nav.Link>
                                    <i className="fa fa-cart-shopping"></i> Cart
                                </Nav.Link>
                            </LinkContainer>
                            {userInfo ? (
                                <NavDropdown
                                    title={userInfo.name}
                                    id="username"
                                >
                                    <LinkContainer to="/profile">
                                        <NavDropdown.Item>
                                            Profile
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                    {/*<NavDropdown.Divider />*/}
                                    {/*{userInfo && userInfo.isAdmin && (*/}
                                    {/*    <NavDropdown*/}
                                    {/*        title="Admin Menu"*/}
                                    {/*        id="adminmenu"*/}
                                    {/*    >*/}
                                    {/*        <LinkContainer to="/admin/userlist">*/}
                                    {/*            <NavDropdown.Item>*/}
                                    {/*                Users*/}
                                    {/*            </NavDropdown.Item>*/}
                                    {/*        </LinkContainer>*/}
                                    {/*        <LinkContainer to="/admin/productlist">*/}
                                    {/*            <NavDropdown.Item>*/}
                                    {/*                Products*/}
                                    {/*            </NavDropdown.Item>*/}
                                    {/*        </LinkContainer>*/}
                                    {/*        <LinkContainer to="/admin/orderlist">*/}
                                    {/*            <NavDropdown.Item>*/}
                                    {/*                Orders*/}
                                    {/*            </NavDropdown.Item>*/}
                                    {/*        </LinkContainer>*/}
                                    {/*    </NavDropdown>*/}
                                    {/*)}*/}
                                    {/*<NavDropdown.Divider />*/}
                                    <NavDropdown.Item onClick={logoutHandler}>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <LinkContainer to="/login">
                                    <Nav.Link>
                                        <i className="fas fa-user"></i> Sign In
                                    </Nav.Link>
                                </LinkContainer>
                            )}
                            {userInfo && userInfo.isAdmin && (
                                <NavDropdown title="Admin Menu" id="adminmenu">
                                    <LinkContainer to="/admin/userlist">
                                        <NavDropdown.Item>
                                            Users
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/admin/productlist">
                                        <NavDropdown.Item>
                                            Products
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/admin/orderlist">
                                        <NavDropdown.Item>
                                            Orders
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>
                            )}
                            {/*{userInfo && userInfo.isEditor && (*/}
                            {/*    <NavDropdown*/}
                            {/*        title="Editor Menu"*/}
                            {/*        id="editormenu"*/}
                            {/*    >*/}
                            {/*        <LinkContainer to="/editor/productlist">*/}
                            {/*            <NavDropdown.Item>*/}
                            {/*                Products*/}
                            {/*            </NavDropdown.Item>*/}
                            {/*        </LinkContainer>*/}
                            {/*    </NavDropdown>*/}
                            {/*)}*/}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
