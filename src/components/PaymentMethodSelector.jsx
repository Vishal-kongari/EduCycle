import React from 'react';
import { CreditCard, Banknote } from "lucide-react";

const PaymentMethodSelector = ({ selectedMethod, onSelect }) => {
    return (
        <div className="payment-methods">
            <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
            <div className="flex flex-col gap-4">
                <label className="flex items-center space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={selectedMethod === "card"}
                        onChange={(e) => onSelect(e.target.value)}
                        className="h-4 w-4 text-primary"
                    />
                    <CreditCard className="h-5 w-5 text-gray-600" />
                    <div className="flex-1">
                        <span className="font-medium">Credit / Debit Card</span>
                        <p className="text-sm text-gray-500">Pay securely with your card</p>
                    </div>
                </label>

                <label className="flex items-center space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={selectedMethod === "cod"}
                        onChange={(e) => onSelect(e.target.value)}
                        className="h-4 w-4 text-primary"
                    />
                    <Banknote className="h-5 w-5 text-gray-600" />
                    <div className="flex-1">
                        <span className="font-medium">Cash on Delivery</span>
                        <p className="text-sm text-gray-500">Pay when you receive your order</p>
                    </div>
                </label>
            </div>
        </div>
    );
};

export default PaymentMethodSelector; 