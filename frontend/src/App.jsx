import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Layouts
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgetPass from './pages/ForgetPass';
import AdminDashboard from './pages/AdminDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import SellerDashboard from './pages/SellerDashboard';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Chat from './pages/Chat';
import Wishlist from './pages/Wishlist';
import SellerProfile from './pages/SellerProfile';
import Legal from './pages/Legal';
import Footer from './components/Footer';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
            <Route path="/forgot-password" element={!user ? <ForgetPass /> : <Navigate to="/" />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" />} />
            <Route path="/wishlist" element={user ? <Wishlist /> : <Navigate to="/login" />} />
            <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" />} />
            <Route path="/chat" element={user ? <Chat /> : <Navigate to="/login" />} />
            <Route path="/buyer-dashboard" element={user?.role === 'BUYER' ? <BuyerDashboard /> : <Navigate to="/" />} />
            <Route path="/seller-dashboard" element={user?.role === 'SELLER' ? <SellerDashboard /> : <Navigate to="/" />} />
            <Route path="/admin-dashboard" element={user?.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/" />} />
            <Route path="/seller/:id" element={<SellerProfile />} />
            <Route path="/legal/:section" element={<Legal />} />
          </Routes>
        </main>
        {user && <BottomNav />}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
