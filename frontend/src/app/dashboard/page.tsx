"use client";

import { useAuth } from "@/context/AuthContext";
import AdminView from "@/components/dashboard/AdminView";
import OwnerView from "@/components/dashboard/OwnerView";
import BookerView from "@/components/dashboard/BookerView";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return <LoadingSpinner />
    }

    if (!isAuthenticated || !user) {
        return <LoadingSpinner />
    }

    switch (user?.accountType) {
        case "admin":
            return <AdminView user={user} />;
        case "owner":
            return <OwnerView user={user} />;
        case "booker":
            return <BookerView user={user} />;
        default:
            return (
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
                    <div className="p-6 bg-white text-red-700 rounded-lg shadow-lg text-center">
                        <h2 className="text-2xl font-semibold mb-2">Unauthorized Access</h2>
                        <p className="text-gray-600">Please create an account first. If you already have one, log in.</p>
                    </div>
                </div>

            );
    }
}