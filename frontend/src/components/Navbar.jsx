import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShoppingBag, ShoppingCart, User, LogOut, MessageSquare, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed w-full z-50 glass-card rounded-none border-t-0 border-r-0 border-l-0 top-0 left-0 px-6 py-4 flex justify-between items-center transition-all duration-300">
            <Link to="/" className="flex items-center gap-2 group">
                <div className="bg-gradient-to-tr from-primary to-secondary p-2 rounded-xl group-hover:rotate-12 transition-transform">
                    <ShoppingBag className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    Apn-E-Dukaan
                </span>
            </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden text-gray-800" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                 {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile Drawer */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full glass-card border-t bg-white/95 flex flex-col p-4 gap-4 md:hidden animate-fade-in-down shadow-xl z-50">
                     {user ? (
                        <>
                            <Link onClick={() => setIsMobileMenuOpen(false)} to={user.role === 'SELLER' ? "/seller-dashboard" : user.role === 'ADMIN' ? "/admin-dashboard" : "/buyer-dashboard"} className="text-gray-800 hover:text-primary transition-colors flex items-center gap-2 font-medium p-2 bg-gray-50 rounded-lg">
                                <User className="w-6 h-6" /> Dashboard
                            </Link>
                            <Link onClick={() => setIsMobileMenuOpen(false)} to="/chat" className="text-gray-800 hover:text-primary transition-colors flex items-center gap-2 font-medium p-2 bg-gray-50 rounded-lg">
                                <MessageSquare className="w-6 h-6" /> Chat
                            </Link>
                            {user.role === 'BUYER' && (
                                <Link onClick={() => setIsMobileMenuOpen(false)} to="/cart" className="text-gray-800 hover:text-primary transition-colors flex items-center gap-2 font-medium p-2 bg-gray-50 rounded-lg">
                                    <ShoppingCart className="w-6 h-6" /> View Cart
                                </Link>
                            )}
                            <button onClick={() => { setIsMobileMenuOpen(false); logout(); }} className="text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2 font-medium p-2 rounded-lg text-left">
                                <LogOut className="w-6 h-6" /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link onClick={() => setIsMobileMenuOpen(false)} to="/login" className="text-gray-800 hover:text-primary font-medium transition-colors p-2 text-center bg-gray-50 rounded-lg">Login</Link>
                            <Link onClick={() => setIsMobileMenuOpen(false)} to="/register" className="btn-primary text-center">Sign Up</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
