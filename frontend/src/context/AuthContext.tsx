"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    accountType: "admin" | "booker" | "owner";
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing user in localStorage on initial load
    useEffect(() => {
        const storedUser = localStorage.getItem("lh_user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse user data", error);
                localStorage.removeItem("lh_user");
            }
        }
        setIsLoading(false);
    }, []);

    const handleSetUser = (user: User | null) => {
        if (user) {
            localStorage.setItem("lh_user", JSON.stringify(user));
        } else {
            localStorage.removeItem("lh_user");
        }
        setUser(user);
    };

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Login failed");
            }

            const userData: User = await response.json();
            handleSetUser(userData);
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            handleSetUser(null);
            await fetch(`${process.env.NEXT_PUBLIC_API}/api/auth/logout`, {
                method: "POST",
                credentials: 'include'
            }).catch(error => {
                console.error("Logout API error:", error);
            });
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser: handleSetUser,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};