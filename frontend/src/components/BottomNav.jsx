import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const BottomNav = () => {
    const location = useLocation();
    const { user } = useContext(AuthContext);

    const getLinkClass = (path) => {
        const isActive = location.pathname === path;
        return `flex flex-col items-center justify-center w-full transition-all duration-300 relative ${isActive ? 'text-primary' : 'text-gray-400 hover:text-primary'}`;
    };

    const cartCount = 0; // We can implement actual fetch if needed
    
    // Determine profile link based on auth role
    const profileLink = user ? (user.role === 'SELLER' ? '/seller-dashboard' : '/buyer-dashboard') : '/login';

    return (
        <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-[72px] bg-white/80 backdrop-blur-2xl border-t border-gray-100 flex items-center justify-between px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <Link to="/" className={getLinkClass('/')}>
                <div className={`p-1.5 rounded-full mb-1 transition-all ${location.pathname === '/' ? 'bg-primary/10' : ''}`}>
                    <Home className="w-6 h-6 outline-none" fill={location.pathname === '/' ? "currentColor" : "none"}/>
                </div>
                <span className="text-[10px] font-semibold">Home</span>
            </Link>
            <Link to="/?search=focus" className={getLinkClass('/search')}>
                <div className={`p-1.5 rounded-full mb-1 transition-all ${location.pathname === '/search' ? 'bg-primary/10' : ''}`}>
                    <Search className="w-6 h-6 outline-none" />
                </div>
                <span className="text-[10px] font-semibold">Search</span>
            </Link>
            <Link to="/cart" className={`${getLinkClass('/cart')} relative`}>
                <div className={`p-1.5 rounded-full mb-1 transition-all ${location.pathname === '/cart' ? 'bg-primary/10' : ''}`}>
                    <ShoppingCart className="w-6 h-6 outline-none" fill={location.pathname === '/cart' ? "currentColor" : "none"}/>
                </div>
                {cartCount > 0 && (
                    <span className="absolute top-1 right-3 inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-red-500 rounded-full border border-white">
                        {cartCount}
                    </span>
                )}
                <span className="text-[10px] font-semibold">Cart</span>
            </Link>
            <Link to={profileLink} className={getLinkClass(profileLink)}>
                <div className={`p-1.5 rounded-full mb-1 transition-all ${location.pathname === profileLink ? 'bg-primary/10' : ''}`}>
                    <User className="w-6 h-6 outline-none" fill={location.pathname === profileLink ? "currentColor" : "none"}/>
                </div>
                <span className="text-[10px] font-semibold">Profile</span>
            </Link>
        </div>
    );
};

export default BottomNav;
