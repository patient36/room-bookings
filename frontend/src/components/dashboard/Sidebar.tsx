import { User } from "@/context/AuthContext";
import {
  FiUser,
  FiCalendar,
  FiDollarSign,
  FiUsers,
  FiKey,
  FiChevronLeft,
  FiMenu
} from "react-icons/fi";
import { useState } from "react";

interface SidebarProps {
  user: User;
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function SharedSidebar({
  user,
  tabs,
  activeTab,
  onTabChange
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getIcon = (id: string) => {
    switch (id) {
      case "profile": return <FiUser />;
      case "bookings": return <FiCalendar />;
      case "expenses":
      case "incomes": return <FiDollarSign />;
      case "users": return <FiUsers />;
      case "rooms": return <FiKey />;
      default: return null;
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`bg-white shadow-md absolute top-0 left-0 h-full backdrop-blur-2xl transition-all duration-300 ease-in-out ${isCollapsed ? 'w-14' : 'w-64'}`}>
      <div className="py-4 px-1 border-b flex items-center justify-between">
        {!isCollapsed && (
          <>
            <h1 className="text-xl font-semibold text-black">Dashboard</h1>
            <p className="text-sm text-gray-500 capitalize">{user.accountType}</p>
          </>
        )}
        <button
          onClick={toggleSidebar}
          className={`text-gray-500 cursor-pointer hover:text-gray-700 ${isCollapsed ? 'mx-auto' : ''}`}
        >
          {isCollapsed ? <FiMenu /> : <FiChevronLeft />}
        </button>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center w-full p-2 cursor-pointer rounded-lg hover:bg-blue-50 ${activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? tab.label : undefined}
              >
                <span className={`${isCollapsed ? 'mr-0' : 'mr-3'}`}>
                  {getIcon(tab.id)}
                </span>
                {!isCollapsed && tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}