import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const navigate = useNavigate();

    const handleCheckoutSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('orders/');
            toast.success("Order Placed Successfully!");
            navigate('/buyer-dashboard');
        } catch (error) {
            toast.error("Failed to place order.");
        }
    };

    return (
        <div className="container mx-auto px-6 py-20 max-w-2xl text-center">
             <div className="glass-card p-10">
                 <h1 className="text-3xl font-extrabold mb-4 border-b pb-4">Checkout Process</h1>
                 <p className="text-gray-600 mb-8">Confirm your delivery details to place the order.</p>
                 <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-left">
                     <label className="block">
                         <span className="text-gray-700 font-medium">Delivery Address</span>
                         <textarea className="input-field mt-1" rows="3" required placeholder="Enter your full street address"></textarea>
                     </label>
                     <p className="text-sm text-gray-500 italic">This demo automatically uses cash on delivery (COD) locally.</p>
                     <button type="submit" className="btn-primary w-full py-4 mt-6 text-lg">Confirm & Place Order</button>
                 </form>
             </div>
        </div>
    );
};

export default Checkout;
