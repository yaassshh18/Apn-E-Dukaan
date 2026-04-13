import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const BuyerDashboard = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('orders/');
            setOrders(res.data);
        } catch (error) {
            toast.error("Failed to load your orders");
        }
    };

    return (
        <div className="container mx-auto px-6 py-12 max-w-5xl">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">My Orders</h1>
            
            {orders.length === 0 ? (
                <div className="glass-card text-center py-20 text-gray-500">
                    You haven't placed any orders yet. Start exploring local deals!
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.id} className="glass-card p-6 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-lg transition-shadow">
                            <div className="flex-grow">
                                <h3 className="font-bold text-lg text-gray-800">Order #{order.id}</h3>
                                <p className="text-gray-500 text-sm mb-2">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                                <p className="font-bold text-primary max-w-[200px] truncate">₹{order.total_price}</p>
                            </div>
                            
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <span className="block text-sm text-gray-500 mb-1">Status</span>
                                    <span className={`px-4 py-2 rounded-full text-xs font-bold shadow-sm ${order.status === 'PENDING' ? 'bg-warning/20 text-warning border border-warning/30' : 'bg-accent/20 text-accent border border-accent/30'}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <button className="btn-secondary whitespace-nowrap text-sm">Track Order</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BuyerDashboard;
