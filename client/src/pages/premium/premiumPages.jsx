import Background from '@/assets/premium.png'
import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
import { PREMIUM_ROUTE } from "@/utils/constants";
import apiClient from "@/lib/api-client";
// Renders errors or successfull transactions on the screen.
function Message({ content }) {
    return <p>{content}</p>;

    const navigate = useNavigate();
}

function PremiumPage() {
    const { userInfo } = useAppStore();
    const initialOptions = {
        "client-id": "AY9lsuSPyUSiOuCDiSMGFVKidmp00RE-vPCUQzNX6Ri4msbbJH8QCC2dTGIgfVJoRsWhEdvAU346CVEB",
        "enable-funding": "venmo",
        "disable-funding": "",
        "buyer-country": "US",
        currency: "USD",
        "data-page-type": "product-details",
        components: "buttons",
        "data-sdk-integration-source": "developer-studio",
    };

    const [message, setMessage] = useState("");

    const handleCreateOrder = async (data, actions) => {
        try {
            const cart = [
                { id: "12345", price: 50, quantity: 1 },  // Producto real con precio y cantidad
            ];

            const response = await fetch("http://localhost:8747/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ cart }),
            });

            const orderData = await response.json();
            if (orderData.id) {
                return orderData.id;
            } else {
                throw new Error("Failed to create order: " + JSON.stringify(orderData));
            }
        } catch (error) {
            console.error(error);
            setMessage(`Could not initiate PayPal Checkout...${error.message}`);
            return null;
        }
    };

    const handleApprove = async (data, actions) => {
        try {
            const response = await fetch(`http://localhost:8747/api/orders/${data.orderID}/capture`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const orderData = await response.json();
            if (orderData.details && orderData.details[0]?.issue === "INSTRUMENT_DECLINED") {
                return actions.restart();
            }

            const transaction = orderData.purchase_units[0].payments.captures[0];
            setMessage(`Transaction ${transaction.status}: ${transaction.id}.`);
            console.log("Capture result", orderData);

            const userId = `${userInfo.id}`;  // Obtén el ID del usuario, por ejemplo de un estado o un contexto

            const premiumResponse = await apiClient.post(
                PREMIUM_ROUTE,
                { userId },
                { withCredentials: true }
            );

        } catch (error) {
            console.error(error);
            setMessage(`Sorry, your transaction could not be processed...${error.message}`);
        }
    };

    return (
        <div className="premium-container bg-[#1c2041]" style={{ color: "white", padding: "58px"  }}>
            <div className="premium-content" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {/* Left side: Text content */}
                <div className="premium-text " style={{ width: "40%" }}>
                    <h1 className="text-violet-700">Actualizate a Premium</h1>
                    <p className="text-violet-600">Desbloquea nuevas caracteristicas para tu experiencia de usuario:</p>
                    <ul className="text-violet-500">
                        <li>Se habilitan los emojis en los Mensajes</li>
                        <li>Se habilita la funcion de enviar archivos</li>
                    </ul>
                    <p className="text-violet-700">Click en PAYPAL para comenzar Tu promocion a premiun!</p>
                </div>

                {/* Right side: Image */}
                <div className="premium-image" style={{ width: "50%"}}>
                    <img
                        src={Background}
                        alt="Premium Features"
                        style={{ width: "50%", borderRadius: "25px" }}
                    />
                </div>
            </div>

            {/* PayPal Buttons */}
            <div className="paypal-buttons" style={{ marginTop: "30px" }}>
                <PayPalScriptProvider options={initialOptions}>
                    <PayPalButtons
                        style={{
                            shape: "rect",
                            layout: "vertical",
                            color: "gold",
                            label: "paypal",
                        }}
                        createOrder={handleCreateOrder}
                        onApprove={handleApprove}
                    />
                </PayPalScriptProvider>
            </div>

            {/* Transaction Message */}
            <Message content={message} />
            <a className=" flex justify-center items-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" href="/chat" >Volver a la CHAT-APP</a>
        </div>
    );
}

export default PremiumPage;
