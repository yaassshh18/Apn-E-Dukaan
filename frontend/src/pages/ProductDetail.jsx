import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { ShoppingCart, MessageCircle, Star, User } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [product, setProduct] = useState(null);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(5);

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
        if (product.seller.id === user.id) return toast.error("You cannot chat with yourself!");
        
        navigate('/chat', { state: { receiver_id: product.seller.id, product_id: product.id } });
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('reviews/', { product: product.id, rating, comment: reviewText });
            toast.success("Review posted successfully!");
            setReviewText('');
            setRating(5);
            // Refresh product to get new reviews
            const res = await api.get(`products/${id}/`);
            setProduct(res.data);
        } catch (error) {
            toast.error("Failed to submit review");
        }
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

            {/* Reviews Section */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
                
                {/* Submit Review */}
                {user && user.role === 'BUYER' && (
                    <div className="glass-card p-6 mb-8">
                        <h3 className="font-bold text-gray-800 mb-4">Leave a Review</h3>
                        <form onSubmit={handleReviewSubmit}>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-sm font-medium text-gray-600">Rating:</span>
                                {[1,2,3,4,5].map(star => (
                                    <Star 
                                        key={star} 
                                        className={`w-6 h-6 cursor-pointer ${star <= rating ? 'fill-warning text-warning' : 'text-gray-300'}`}
                                        onClick={() => setRating(star)}
                                    />
                                ))}
                            </div>
                            <textarea 
                                className="input-field w-full mb-4" 
                                rows="3" 
                                placeholder="What did you think about this product?"
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                required
                            />
                            <button type="submit" className="btn-primary">Submit Review</button>
                        </form>
                    </div>
                )}

                {/* Review List */}
                <div className="space-y-4">
                    {product.reviews && product.reviews.length > 0 ? (
                        product.reviews.map(review => (
                            <div key={review.id} className="glass-card p-6 flex gap-4">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 shrink-0">
                                    <User className="w-5 h-5"/>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-gray-800">{review.user?.username || 'User'}</h4>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-warning text-warning' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600">{review.comment}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 italic">No reviews yet. Be the first to share your experience!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
