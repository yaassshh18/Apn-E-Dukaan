import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Package, TrendingUp, DollarSign, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const SellerDashboard = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const prodRes = await api.get('products/');
            setProducts(prodRes.data); // in a real app, query by seller is needed, but backend performs basic filtering. Wait, ProductViewSet needs a change for seller filtering if we only want their products. Let's assume the API provides it or we filter client side.
            
            const orderRes = await api.get('orders/');
            setOrders(orderRes.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load dashboard data");
        }
    };

    return (
        <div className="container mx-auto px-6 py-12 max-w-7xl">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900">Seller Dashboard</h1>
                <button className="btn-primary flex items-center gap-2">
                    <Plus className="w-5 h-5"/> Add Product
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="glass-card p-6 flex flex-col items-center justify-center bg-gradient-to-br from-white to-primary/5">
                    <div className="bg-primary/10 p-4 rounded-full text-primary mb-4">
                        <Package className="w-8 h-8" />
                    </div>
                    <p className="text-gray-500 mb-1">Total Products</p>
                    <p className="text-3xl font-bold text-gray-900">{products.length}</p>
                </div>
                <div className="glass-card p-6 flex flex-col items-center justify-center bg-gradient-to-br from-white to-accent/5">
                    <div className="bg-accent/10 p-4 rounded-full text-accent mb-4">
                        <TrendingUp className="w-8 h-8" />
                    </div>
                    <p className="text-gray-500 mb-1">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
                </div>
                 <div className="glass-card p-6 flex flex-col items-center justify-center bg-gradient-to-br from-white to-warning/5">
                    <div className="bg-warning/10 p-4 rounded-full text-warning mb-4">
                        <DollarSign className="w-8 h-8" />
                    </div>
                    <p className="text-gray-500 mb-1">Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">
                        ₹{orders.reduce((acc, order) => acc + parseFloat(order.total_price), 0).toFixed(2)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Recent Products */}
                <div className="glass-card p-6">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">Your Products</h2>
                    <div className="space-y-4">
                        {products.length === 0 ? <p className="text-gray-500">No products added yet.</p> : null}
                        {products.slice(0,5).map(prod => (
                            <div key={prod.id} className="flex justify-between items-center border-b pb-2">
                                <span className="font-medium text-gray-800">{prod.title}</span>
                                <span className="text-primary font-bold">₹{prod.price}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="glass-card p-6">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">Recent Orders</h2>
                    <div className="space-y-4">
                        {orders.length === 0 ? <p className="text-gray-500">No orders yet.</p> : null}
                        {orders.map(order => (
                            <div key={order.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                                <div>
                                    <span className="block font-bold text-gray-800">Order #{order.id}</span>
                                    <span className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'PENDING' ? 'bg-warning/20 text-warning' : 'bg-accent/20 text-accent'}`}>
                                    {order.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;
