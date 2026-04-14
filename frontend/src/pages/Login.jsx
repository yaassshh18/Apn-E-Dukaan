import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff, ShoppingBag } from 'lucide-react';

const Login = () => {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            toast.success('Welcome back!');
        } catch (error) {
            toast.error('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex animate-fade-in">
            {/* Left Side: Branding (Hidden on mobile) */}
            <div className="hidden md:flex w-1/2 bg-gradient-to-br from-primary via-secondary to-purple-900 relative items-center justify-center overflow-hidden">
                {/* Animated Background Blobs */}
                <div className="absolute top-20 left-20 w-72 h-72 bg-accent/30 rounded-full mix-blend-screen filter blur-[80px] animate-blob"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>

                <div className="z-10 text-center text-white px-12 animate-slide-up">
                    <div className="flex justify-center mb-6">
                        <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md">
                            <ShoppingBag className="w-16 h-16 text-white drop-shadow-xl" />
                        </div>
                    </div>
                    <h1 className="text-5xl font-display font-black mb-4 tracking-tight drop-shadow-md">Apn-E-Dukaan</h1>
                    <p className="text-xl text-blue-100 font-light max-w-sm mx-auto leading-relaxed">The premium hyperlocal marketplace for your neighborhood. Shop local, securely and effortlessly.</p>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-background relative">
                {/* Mobile Blob */}
                <div className="absolute md:hidden top-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 blur-[100px] rounded-full mix-blend-multiply pointer-events-none"></div>
                
                <div className="w-full max-w-md animate-slide-up z-10 glass-card p-10 border-white/80">
                    <div className="mb-10 text-center md:text-left">
                        <h2 className="text-4xl font-display font-extrabold text-gray-900 mb-2">Welcome Back 👋</h2>
                        <p className="text-gray-500 text-lg">Login to explore exclusive local deals.</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                            <input 
                                type="text" 
                                className="input-field shadow-sm hover:shadow-md" 
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? 'text' : 'password'} 
                                    className="input-field shadow-sm hover:shadow-md pr-12" 
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary border-gray-300 transition-all cursor-pointer"/>
                                <span className="text-gray-600 group-hover:text-primary transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="font-semibold text-secondary hover:text-primary transition-colors hover:underline">Forgot Password?</a>
                        </div>

                        <button type="submit" className="btn-primary w-full text-lg py-4 mt-2 shadow-glow hover:shadow-primary/50">
                            Sign In to Marketplace
                        </button>
                    </form>
                    
                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-gray-600">
                            New to Apn-E-Dukaan? <Link to="/register" className="font-bold text-gradient hover:underline ml-1 tracking-wide">Create an account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
