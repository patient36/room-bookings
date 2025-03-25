import { User } from "@/context/AuthContext";

interface AdminDashboardProps {
  user: User;
}

const AdminDashboard = ({ user }: AdminDashboardProps) => {
  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.name}!</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Statistics Cards */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-gray-700">Total Users</h3>
          <p className="text-2xl font-bold mt-2">1,248</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-gray-700">Active Bookings</h3>
          <p className="text-2xl font-bold mt-2">56</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-gray-700">Revenue</h3>
          <p className="text-2xl font-bold mt-2">$24,780</p>
        </div>

        {/* Admin Features */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
              Manage Users
            </button>
            <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition">
              View Reports
            </button>
            <button className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition">
              System Settings
            </button>
            <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition">
              Audit Logs
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
          <ul className="space-y-3">
            <li className="text-sm">User "John" was created</li>
            <li className="text-sm">Booking #1234 was canceled</li>
            <li className="text-sm">System backup completed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;