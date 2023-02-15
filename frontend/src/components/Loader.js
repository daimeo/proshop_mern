import React from "react";
import { Spinner } from "react-bootstrap";

const Loader = (size) => {
    return (
        <>
            {size === "small" ? (
                <Spinner
                    animation="border"
                    role="status"
                    style={{
                        width: "10px",
                        height: "10px",
                        margin: "auto",
                        display: "block",
                    }}
                >
                    <span className="sr-only">Loading...</span>
                </Spinner>
            ) : (
                <Spinner
                    animation="border"
                    role="status"
                    style={{
                        width: "100px",
                        height: "100px",
                        margin: "auto",
                        display: "block",
                    }}
                >
                    <span className="sr-only">Loading...</span>
                </Spinner>
            )}
        </>
    );
};

export default Loader;
