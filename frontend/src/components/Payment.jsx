import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/Cart";
import axios from "axios";

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const storedUserId = localStorage.getItem("userId");
    const storedEmail = localStorage.getItem("email"); // Get email from storage
    const { address, totalAmount, couponCode } = location.state || {};
    const userId = storedUserId || location.state?.userId;
    const { cartItems, clearCart } = useContext(CartContext);
    const [paymentMethod, setPaymentMethod] = useState("UPI");
    const [finalAmount, setFinalAmount] = useState(totalAmount);
    const [isLoading, setIsLoading] = useState(false);

    // Load Razorpay script dynamically
    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    useEffect(() => {
        setFinalAmount(paymentMethod === "COD" ? totalAmount + 25 : totalAmount);
    }, [paymentMethod, totalAmount]);

    const initiateRazorpay = async (orderData) => {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: orderData.amount,
            currency: "INR",
            name: "Your Store Name",
            description: `Order ${orderData.id}`,
            order_id: orderData.razorpayOrderId,
            handler: async function (response) {
                try {
                    const verifyRes = await axios.post("https://grokart-2.onrender.com/api/v1/payment/verify", {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        orderId: orderData._id
                    });

                    if (verifyRes.data.success) {
                        await axios.post("https://grokart-2.onrender.com/api/v1/order/place-order", {
                            userId,
                            items: cartItems,
                            totalAmount: finalAmount,
                            paymentId: response.razorpay_payment_id,
                            deliveryAddress: address
                        });
                        clearCart();
                        navigate("/order-success", { state: { order: orderData } });
                    } else {
                        alert("Payment verification failed");
                    }
                } catch (error) {
                    console.error("Payment error:", error);
                    alert("Payment processing failed");
                }
            },
            prefill: {
                name: address.name,
                email: storedEmail,
                contact: address.phone,
            },
            theme: {
                color: "#F37254",
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", (response) => {
            alert(`Payment failed: ${response.error.description}`);
        });
        rzp.open();
    };

    const handlePayment = async () => {
        if (!cartItems?.length || !totalAmount || !address || !userId) {
            alert("Missing order details. Please try again.");
            return;
        }

        setIsLoading(true);
        try {
            const orderPayload = {
                userId,
                cartItems,
                totalAmount,
                paymentMethod,
                address,
                couponCode,
                email: storedEmail
            };

            const response = await axios.post("/api/v1/order/create-order", orderPayload);

            if (response.data.success) {
                if (paymentMethod === "COD") {
                    clearCart();
                    alert("COD Order Placed Successfully!");
                    navigate("/order-success", { state: { order: response.data.order } });
                } else {
                    await initiateRazorpay(response.data.order);
                }
            }
        } catch (error) {
            console.error("Order error:", error.response?.data || error);
            alert(error.response?.data?.error || "Failed to process order");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
            <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                    Payment
                </h2>

                <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-700">Total Amount</h3>
                    <p className="text-xl font-bold text-green-600">₹{finalAmount}</p>
                    {paymentMethod === "COD" && (
                        <p className="text-sm text-gray-500 mt-1">(Includes ₹25 COD charge)</p>
                    )}
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-700">Select Payment Method</h3>
                    <div className="mt-2 space-y-3">
                        <label className="flex items-center space-x-2 cursor-pointer p-3 border rounded hover:border-blue-500">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="UPI"
                                checked={paymentMethod === "UPI"}
                                onChange={() => setPaymentMethod("UPI")}
                                className="form-radio h-5 w-5 text-blue-600"
                            />
                            <span className="text-gray-800">UPI (Razorpay)</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer p-3 border rounded hover:border-blue-500">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="COD"
                                checked={paymentMethod === "COD"}
                                onChange={() => setPaymentMethod("COD")}
                                className="form-radio h-5 w-5 text-blue-600"
                            />
                            <span className="text-gray-800">Cash on Delivery (₹25 extra)</span>
                        </label>
                    </div>
                </div>

                <button
                    onClick={handlePayment}
                    disabled={isLoading}
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg mt-4 shadow-md transition-all ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    {isLoading ? "Processing..." : paymentMethod === "COD" ? "Place COD Order" : "Pay Now"}
                </button>
            </div>
        </div>
    );
};

export default Payment;