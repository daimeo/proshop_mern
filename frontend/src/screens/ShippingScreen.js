import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import {
    getShippingAddress,
    saveShippingAddress,
} from "../actions/cartActions";
import { useNavigate } from "react-router-dom";

// TODO: use react-bootstrap-typeahead for autocomplete dropdown list in the address fields
const ShippingScreen = () => {
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    const [dbAddress, setDBAddress] = useState(shippingAddress.address || "");
    const [city, setCity] = useState(shippingAddress.city || "");
    const [postalCode, setPostalCode] = useState(
        shippingAddress.postalCode || ""
    );
    const [country, setCountry] = useState(shippingAddress.country || "");
    const [district, setDistrict] = useState(shippingAddress.district || "");
    const [ward, setWard] = useState(shippingAddress.ward || "");
    const [addressType, setAddressType] = useState(
        shippingAddress.addressType || ""
    );

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const { loading, success, error } = useSelector(
        (state) => state.cartAddress
    );

    const {
        loading: loadingAddress,
        success: successAddress,
        error: errorAddress,
        address,
    } = useSelector((state) => state.cartGetAddress);

    useEffect(() => {
        if (!userInfo) {
            navigate("/login");
        }

        if (success) {
            navigate("/payment");
        } else {
            if (!address || !address.addressType) {
                console.log("userInfo: " + JSON.stringify(userInfo));
                dispatch(getShippingAddress(userInfo._id));
            } else {
                setDBAddress(address.address);
                setWard(address.ward);
                setDistrict(address.district);
                setCity(address.city);
                setPostalCode(address.postalCode);
                setCountry(address.country);
                setAddressType(address.addressType);
            }
        }
    }, [userInfo, navigate, success, dispatch]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(
            saveShippingAddress({
                addressType: "shipping",
                dbAddress,
                ward,
                district,
                city,
                postalCode,
                country,
            })
        );
        // navigate("/payment");
    };

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 />
            <h1>Shipping</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter address"
                        value={`${dbAddress}`}
                        required
                        onChange={(e) => setDBAddress(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId="city">
                    <Form.Label>Ward</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter ward"
                        value={`${ward}`}
                        required
                        onChange={(e) => setWard(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId="city">
                    <Form.Label>District</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter district"
                        value={district}
                        required
                        onChange={(e) => setDistrict(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId="city">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter city"
                        value={city}
                        required
                        onChange={(e) => setCity(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId="postalCode">
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter postal code"
                        value={postalCode}
                        required
                        onChange={(e) => setPostalCode(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId="country">
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter country"
                        value={`${country}`}
                        required
                        onChange={(e) => setCountry(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId="country">
                    <Form.Label>Address Type</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Select address type"
                        value={`${addressType}`}
                        required
                        onChange={(e) => setAddressType(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type="submit" variant="primary">
                    Continue
                </Button>
            </Form>
        </FormContainer>
    );
};

export default ShippingScreen;
