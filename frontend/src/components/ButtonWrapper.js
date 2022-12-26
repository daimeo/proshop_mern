import { useEffect } from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useDispatch, useSelector } from "react-redux";
import Message from "./Message";
import { payOrder } from "../actions/orderActions";
import Loader from "./Loader";

// These values are the props in the UI
// const amount = "2";
// const currency = "USD";
const defaultStyle = {
    shape: "pill",
    color: "blue",
    layout: "vertical",
    // tagline: false,
    label: "buynow",
};
// Custom component to wrap the PayPalButtons and handle currency changes
const ButtonWrapper = ({ style, currency, orderId }) => {
    // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
    // This is the main reason to wrap the PayPalButtons in a new component
    const [{ options, isPending, isRejected, isResolved }] =
        usePayPalScriptReducer();

    const dispatch = useDispatch();

    const { loading, order, error } = useSelector(
        (state) => state.orderDetails
    );

    const amount = order.totalPrice;

    useEffect(() => {
        dispatch({
            type: "resetOptions",
            value: {
                ...options,
                currency: currency,
            },
        });
    }, [currency, dispatch, options]);

    const createOrderHandler = async (data, actions) => {
        // window.location.reload();
        if (order && !order.isCanceled) {
            return await actions.order.create({
                purchase_units: [
                    {
                        amount: {
                            currency_code: currency,
                            value: amount,
                        },
                    },
                ],
            });
        }
    };

    const successPaymentHandler = async (data, actions) => {
        return await actions.order.capture().then((paymentResult) => {
            console.log(paymentResult);
            dispatch(payOrder(orderId, paymentResult));
        });
    };

    return (
        <>
            {loading && isPending && <Loader />}
            {error && isRejected && (
                <Message variant={"danger"}>{error}</Message>
            )}
            {isResolved && (
                <PayPalButtons
                    style={style ? style : defaultStyle}
                    disabled={false}
                    forceReRender={[amount, currency, style]}
                    // fundingSource={undefined}
                    // disable-funding="card, credit"
                    createOrder={createOrderHandler}
                    onApprove={successPaymentHandler}
                />
            )}
        </>
    );
};

export default ButtonWrapper;
