import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // In a real app we'd fetch the profile to get the full role, but here we can decode or fetch profile.
                fetchProfile();
            } catch (e) {
                logout();
            }
        } else {
            setLoading(false);
        }
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('auth/profile/');
            setUser(res.data);
        } catch (error) {
            logout();
        } finally {
            setLoading(false);
        }
    };

    // Step 1: Request 2FA OTP
    const initiateLogin = async (email, password) => {
        const res = await api.post('auth/login/', { email, password });
        return res.data; // e.g. { message: "Credentials verified...", email: "..." }
    };

    // Step 2: Verify 2FA OTP and actually log in
    const verifyLogin = async (email, otp_code) => {
        const res = await api.post('auth/login/otp/verify/', { email, otp_code });
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        await fetchProfile();
        return res.data.user;
    };

    const register = async (userData) => {
        await api.post('auth/register/', userData);
        // After registration, user must verify registration OTP.
    };

    const verifyRegistration = async (email, otp_code) => {
        await api.post('auth/register/verify-otp/', { email, otp_code });
    };

    const resendOtp = async (email, action = 'login') => {
        await api.post('auth/resend-otp/', { email, action });
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, initiateLogin, verifyLogin, register, verifyRegistration, resendOtp, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
