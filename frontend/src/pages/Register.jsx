import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff, ShoppingBag, ShieldCheck } from 'lucide-react';

const Register = () => {
    const { register } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        location: '',
        role: 'BUYER'
    });

    const getPasswordStrength = () => {
        const p = formData.password;
        if(p.length === 0) return { label: '', color: 'bg-gray-200', text: '' };
        if(p.length < 5) return { label: 'Weak', color: 'bg-red-500', text: 'text-red-500' };
        if(p.length < 8) return { label: 'Good', color: 'bg-warning', text: 'text-warning' };
        return { label: 'Strong', color: 'bg-accent', text: 'text-accent' };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            toast.success('Registration successful!');
        } catch (error) {
            toast.error('Registration failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex animate-fade-in">
            {/* Left Side: Branding (Hidden on mobile) */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-secondary via-primary to-slate-900 relative items-center justify-center overflow-hidden">
                <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-accent/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
                <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>

                <div className="z-10 text-center text-white px-12 animate-slide-up">
                    <div className="flex justify-center mb-8">
                        <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/20 shadow-glass">
                            <ShieldCheck className="w-16 h-16 text-accent drop-shadow-xl" />
                        </div>
                    </div>
                    <h1 className="text-5xl font-display font-black mb-6 tracking-tight drop-shadow-md leading-tight">Join the Local<br/>Revolution!</h1>
                    <p className="text-xl text-blue-100 font-light max-w-md mx-auto leading-relaxed">Create a secure account in seconds and unlock exclusive deals from sellers trusted by your neighborhood.</p>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-background relative overflow-y-auto min-h-screen">
                <div className="w-full max-w-lg animate-slide-up z-10 glass-card p-8 sm:p-10 border-white/80">
                    <div className="mb-8">
                        <h2 className="text-3xl font-display font-extrabold text-gray-900 mb-2">Create Account 🚀</h2>
                        <p className="text-gray-500">Sign up to start buying or selling.</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                                <input 
                                    type="text" 
                                    className="input-field shadow-sm" 
                                    placeholder="johndoe"
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                                <input 
                                    type="email" 
                                    className="input-field shadow-sm" 
                                    placeholder="you@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    className="input-field shadow-sm pr-12" 
                                    placeholder="Create a strong password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    required
                                />
                                <button 
                                    type="button" 
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors focus:outline-none"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                                </button>
                            </div>
                            
                            {/* Password Strength Indicator */}
                            {formData.password.length > 0 && (
                                <div className="mt-2 flex items-center justify-between animate-fade-in">
                                    <div className="flex gap-1 flex-grow mr-4">
                                        <div className={`h-1.5 w-1/3 rounded-full ${getPasswordStrength().color} transition-all duration-300`}></div>
                                        <div className={`h-1.5 w-1/3 rounded-full ${formData.password.length >= 5 ? getPasswordStrength().color : 'bg-gray-200'} transition-all duration-300`}></div>
                                        <div className={`h-1.5 w-1/3 rounded-full ${formData.password.length >= 8 ? getPasswordStrength().color : 'bg-gray-200'} transition-all duration-300`}></div>
                                    </div>
                                    <span className={`text-xs font-bold ${getPasswordStrength().text}`}>{getPasswordStrength().label}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">City / Area</label>
                            <input 
                                type="text" 
                                className="input-field shadow-sm" 
                                placeholder="e.g. Mumbai, Bandra"
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3 block border-b pb-2">I want to join as a:</label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.role === 'BUYER' ? 'border-primary bg-primary/5 shadow-inner' : 'border-gray-100 bg-white hover:border-gray-300'}`}>
                                    <input type="radio" value="BUYER" checked={formData.role === 'BUYER'} onChange={(e) => setFormData({...formData, role: e.target.value})} className="sr-only"/>
                                    <span className={`font-bold ${formData.role === 'BUYER' ? 'text-primary' : 'text-gray-600'}`}>🛍️ Buyer</span>
                                    <span className="text-[10px] text-gray-400 mt-1">Shop local deals</span>
                                </label>
                                <label className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.role === 'SELLER' ? 'border-secondary bg-secondary/5 shadow-inner' : 'border-gray-100 bg-white hover:border-gray-300'}`}>
                                    <input type="radio" value="SELLER" checked={formData.role === 'SELLER'} onChange={(e) => setFormData({...formData, role: e.target.value})} className="sr-only"/>
                                    <span className={`font-bold ${formData.role === 'SELLER' ? 'text-secondary' : 'text-gray-600'}`}>🏪 Seller</span>
                                    <span className="text-[10px] text-gray-400 mt-1">List your products</span>
                                </label>
                            </div>
                        </div>

                        <button type="submit" className="btn-primary w-full py-4 text-lg font-bold shadow-glow mt-4">
                            Create Account
                        </button>
                    </form>
                    
                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-gray-600">
                            Already part of the community? <Link to="/login" className="font-bold text-gradient hover:underline ml-1">Sign in here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
