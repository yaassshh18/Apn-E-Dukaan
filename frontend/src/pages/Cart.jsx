import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Trash2, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Cart = () => {
    const [cart, setCart] = useState({ items: [] });
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await api.get('cart/');
            setCart(res.data[0] || { items: [] }); // Router config might return array
        } catch (error) {
            console.error("Cart fetch error", error);
        }
    };

    const handleRemove = async (productId) => {
        try {
            await api.delete('cart/remove_item/', { data: { product_id: productId } });
            fetchCart();
            toast.success("Item removed");
        } catch (error) {
            toast.error("Failed to remove item");
        }
    };
    
    const handleCheckout = () => {
        navigate('/checkout');
    }

    const total = cart.items?.reduce((acc, item) => acc + (parseFloat(item.product?.price || 0) * item.quantity), 0) || 0;

    return (
        <div className="container mx-auto px-6 py-20 max-w-4xl">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
                <ShoppingBag className="text-primary w-8 h-8" /> Your Local Cart
            </h1>
            
            {(!cart.items || cart.items.length === 0) ? (
                <div className="glass-card text-center py-20">
                    <p className="text-gray-500 text-lg mb-6">Your cart is feeling a bit empty.</p>
                    <Link to="/" className="btn-primary">Discover Trends</Link>
                </div>
            ) : (
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-2/3 space-y-4">
                        {cart.items.map(item => (
                            <div key={item.id} className="glass-card p-4 flex items-center gap-4 hover:shadow-lg transition-shadow">
                                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                    {item.product?.image && <img src={item.product.image} className="w-full h-full object-cover" />}
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-bold text-lg text-gray-800">{item.product?.title}</h3>
                                    <p className="text-primary font-bold">₹{item.product?.price}</p>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                </div>
                                <button onClick={() => handleRemove(item.product?.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                    <Trash2 className="w-5 h-5"/>
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <div className="md:w-1/3">
                        <div className="glass-card p-6 sticky top-24">
                            <h3 className="text-xl font-bold mb-4 border-b pb-4 text-gray-800">Order Summary</h3>
                            <div className="flex justify-between mb-4">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-bold">₹{total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-4 border-b pb-4">
                                <span className="text-gray-600">Local Delivery</span>
                                <span className="font-bold text-accent">Free</span>
                            </div>
                            <div className="flex justify-between mb-8 text-xl font-extrabold">
                                <span>Total</span>
                                <span className="text-primary">₹{total.toFixed(2)}</span>
                            </div>
                            <button onClick={handleCheckout} className="btn-primary w-full py-4 text-lg">Proceed to Checkout</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
