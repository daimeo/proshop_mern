import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import {
    Navbar,
    Nav,
    Container,
    NavDropdown,
    ToggleButton,
    ToggleButtonGroup,
} from "react-bootstrap";
import SearchBox from "./SearchBox";
import { logoutUser } from "../actions/userActions";
import { useTranslation } from "react-i18next";

const Header = () => {
    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    // react-i18next
    const { t, i18n } = useTranslation();
    const logoutHandler = () => {
        // dispatch(logout());
        dispatch(logoutUser());
    };

    const [language, setLanguage] = useState("vn");
    const [languageChanged, setLanguageChanged] = useState(false);
    const [isEnglishSelected, setIsEnglishSelected] = useState(false);
    const [isVietnameseSelected, setIsVietnameseSelected] = useState(true);

    useEffect(() => {
        // Force NavDropdown to re-render when language changes
        i18n.on("languageChanged", () => {
            setLanguageChanged(true);
        });
        return () => {
            i18n.off("languageChanged");
        };
    }, [i18n]);

    const handleLanguageChange = (val) => {
        setLanguage(val);
        i18n.changeLanguage(val).then(console.log(val));
    };

    const handleToggleChange = (event) => {
        if (event.target.name === "english") {
            setIsEnglishSelected(true);
            setIsVietnameseSelected(false);
            setLanguage("en");
            i18n.changeLanguage("en");
            // set the i18next language to English
        } else if (event.target.name === "vietnamese") {
            setIsVietnameseSelected(true);
            setIsEnglishSelected(false);
            setLanguage("en");
            i18n.changeLanguage("vn");
            // set the i18next language to Vietnamese
        }
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
                                    <i className="fa fa-cart-shopping"></i>{" "}
                                    {t("Cart")}
                                </Nav.Link>
                            </LinkContainer>
                            {userInfo ? (
                                <NavDropdown
                                    title={userInfo.name}
                                    id="username"
                                >
                                    <LinkContainer to="/profile">
                                        <NavDropdown.Item>
                                            {t("Profile")}
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
                                        {t("Logout")}
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <LinkContainer to="/login">
                                    <Nav.Link>
                                        <i className="fas fa-user"></i>{" "}
                                        {t("Sign In")}
                                    </Nav.Link>
                                </LinkContainer>
                            )}
                            {userInfo && userInfo.isAdmin && (
                                <NavDropdown title="Admin Menu" id="adminmenu">
                                    <LinkContainer to="/admin/userlist">
                                        <NavDropdown.Item>
                                            {t("Users")}
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/admin/productlist">
                                        <NavDropdown.Item>
                                            {t("Products")}
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/admin/orderlist">
                                        <NavDropdown.Item>
                                            {t("Orders")}
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
                            {/*<NavDropdown*/}
                            {/*    title={t("Language")}*/}
                            {/*    id="languagemenu"*/}
                            {/*>*/}
                            <ToggleButtonGroup
                                type={"radio"}
                                name={"language"}
                                value={language}
                                onChange={handleLanguageChange}
                                size={"sm"}
                                vertical={false}
                            >
                                {/*<NavDropdown.Item>*/}
                                <ToggleButton
                                    id={"en"}
                                    name={"english"}
                                    // type={"radio"}
                                    variant="outline-dark"
                                    value={"en"}
                                    checked={language === "en"}
                                    // onChange={handleToggleChange}
                                >
                                    EN
                                </ToggleButton>
                                {/*</NavDropdown.Item>*/}
                                {/*<NavDropdown.Item>*/}
                                <ToggleButton
                                    id={"vn"}
                                    name={"vietnamese"}
                                    // type={"radio"}
                                    variant="outline-dark"
                                    value={"en"}
                                    checked={language === "vn"}
                                    // onChange={handleToggleChange}
                                >
                                    VN
                                </ToggleButton>
                                {/*</NavDropdown.Item>*/}
                            </ToggleButtonGroup>
                            {/*</NavDropdown>*/}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
