"use client"
import { useState } from "react";
import SharedSidebar from "./Sidebar";
import Profile from "./sections/Profile";
import Bookings from "./sections/Bookings";
import Expenses from "./sections/Expenses";
import { User } from "@/context/AuthContext";

export default function BookerView({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "bookings", label: "Bookings" },
    { id: "expenses", label: "Expenses" }
  ];

  return (
    <div className="flex h-screen bg-gray-100 relative">
      <SharedSidebar
        user={user}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="overflow-auto p-6 px-20">
        {activeTab === "profile" && <Profile user={user} />}
        {activeTab === "bookings" && <Bookings />}
        {activeTab === "expenses" && <Expenses />}
      </div>
    </div>
  );
}