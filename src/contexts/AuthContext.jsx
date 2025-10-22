import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext({
    user: null,
    loading: true,
    refresh: () => { }
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setUser(null);
                return;
            }

            const res = await axios.get(
                `${process.env.VITE_API_URL}/api/user/me`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'X-Auth-Token': process.env.VITE_API_TOKEN
                    }
                }
            );

            if (res.data?.user) setUser(res.data.user);
            else setUser(null);
        } catch (err) {
            // If token expired/invalid, remove it so subsequent calls are clean
            if (err?.response?.status === 401) {
                localStorage.removeItem('token');
            }
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
        const handler = () => fetchUser();
        window.addEventListener('auth-change', handler);
        return () => window.removeEventListener('auth-change', handler);
    }, [fetchUser]);

    const value = useMemo(() => ({ user, loading, refresh: fetchUser }), [user, loading, fetchUser]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}

// Helper you can call from login/logout flows:
// import { triggerAuthChange } from '.../contexts/AuthContext.jsx'
export function triggerAuthChange() {
    window.dispatchEvent(new Event('auth-change'));
}
