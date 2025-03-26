"use client"
import { useState } from "react";
import SharedSidebar from "./Sidebar";
import Profile from "./sections/Profile";
import Bookings from "./sections/Bookings";
import Expenses from "./sections/Expenses";
import Incomes from "./sections/Income";
import Users from "./sections/Users";
import Rooms from "./sections/Rooms";
import { User } from "@/context/AuthContext";

export default function AdminView({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "bookings", label: "Bookings" },
    { id: "expenses", label: "Expenses" },
    { id: "incomes", label: "Incomes" },
    { id: "users", label: "Users" },
    { id: "rooms", label: "Rooms" }
  ];

  return (
    <div className="flex h-screen bg-gray-100 relative">
      <SharedSidebar
        user={user}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="flex-1 overflow-auto p-6">
        {activeTab === "profile" && <Profile user={user} />}
        {activeTab === "bookings" && <Bookings />}
        {activeTab === "expenses" && <Expenses />}
        {activeTab === "incomes" && <Incomes />}
        {activeTab === "users" && <Users />}
        {activeTab === "rooms" && <Rooms />}
      </div>
    </div>
  );
}