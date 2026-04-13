import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { ShoppingCart, MessageCircle, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`products/${id}/`);
                setProduct(res.data);
            } catch (err) {
                toast.error("Failed to load product details");
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!user) return navigate('/login');
        if (user.role !== 'BUYER') return toast.error("Only buyers can add to cart");
        
        try {
            await api.post('cart/add_item/', { product_id: product.id, quantity: 1 });
            toast.success("Added to cart");
        } catch (error) {
            toast.error("Failed to add to cart");
        }
    };

    const handleChatClick = () => {
        if (!user) return navigate('/login');
        toast.info("WhatsApp style Chat opening... (Component in progress)");
    };

    if (!product) return <div className="min-h-screen pt-32 text-center text-xl">Loading amazing local product...</div>;

    return (
        <div className="container mx-auto px-6 py-20 max-w-6xl">
            <div className="glass-card p-6 md:p-12 overflow-hidden flex flex-col md:flex-row gap-12">
                <div className="w-full md:w-1/2">
                    <div className="bg-gray-100 h-96 rounded-2xl overflow-hidden shadow-inner">
                         {product.image ? (
                             <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                         ) : (
                             <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                 <ShoppingCart className="w-16 h-16 mb-4 opacity-50"/>
                                 <span>No product image available</span>
                             </div>
                         )}
                    </div>
                </div>
                
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-warning mb-2">
                        <Star className="w-5 h-5 fill-current" />
                        <span className="font-bold">4.8</span>
                        <span className="text-gray-400 text-sm">(12 reviews)</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{product.title}</h1>
                    <p className="text-3xl font-bold text-primary mb-6">₹{product.price}</p>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        {product.description || "This seller hasn't provided a description for this product yet. Better chat with them to find out more!"}
                    </p>
                    
                    <div className="p-4 bg-gray-50 rounded-xl mb-8 flex items-center gap-4">
                        <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center text-secondary font-bold text-xl uppercase">
                            {product.seller?.username?.[0] || 'S'}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Sold locally by</p>
                            <p className="font-bold text-gray-800">{product.seller?.username || 'Local Seller'}</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={handleAddToCart} className="btn-primary flex-1 flex items-center justify-center gap-2 py-4 text-lg">
                            <ShoppingCart className="w-5 h-5" /> Add to Cart
                        </button>
                        <button onClick={handleChatClick} className="btn-secondary flex-1 flex items-center justify-center gap-2 py-4 text-lg border-accent text-accent hover:bg-accent/5">
                            <MessageCircle className="w-5 h-5" /> Negotiate
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
