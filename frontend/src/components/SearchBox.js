import React, { useState } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";

const SearchBox = ({ history }) => {
    const [keyword, setKeyword] = useState("");

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            history.push(`/search/${keyword}`);
        } else {
            history.push("/");
        }
    };

    return (
        <Form>
            <Row className={"align-items-center"}>
                <Col sm={6} className={"mx-1"}>
                    <Form.Control
                        type="text"
                        name="q"
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Search Products..."
                        className="me-sm-2 ms-md-4"
                        // className="mr-sm-2 ml-sm-5"
                    ></Form.Control>
                </Col>
                <Col sm={4} className={"my-1 mx-4"}>
                    <Button
                        type="submit"
                        variant="light"
                        className="p-2 me-auto"
                        // className="p-2 mx-auto"
                    >
                        Search
                    </Button>
                </Col>
            </Row>
        </Form>
        // <Form onSubmit={submitHandler} className={"d-flex"}>
        //     <Form.Control
        //         type="text"
        //         name="q"
        //         onChange={(e) => setKeyword(e.target.value)}
        //         placeholder="Search Products..."
        //         className="mr-sm-2 ml-sm-5"
        //     ></Form.Control>
        //     <Button type="submit" variant="light" className="p-2">
        //         Search
        //     </Button>
        // </Form>
    );
};

export default SearchBox;
