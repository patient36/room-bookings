import { User } from "@/context/AuthContext";

interface OwnerDashboardProps {
  user: User;
}

const OwnerDashboard = ({ user }: OwnerDashboardProps) => {
  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Owner Dashboard</h1>
        <p className="text-gray-600">Good to see you, {user.name}!</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Business Metrics */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-gray-700">Monthly Revenue</h3>
          <p className="text-2xl font-bold mt-2">$12,450</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-gray-700">Occupancy Rate</h3>
          <p className="text-2xl font-bold mt-2">78%</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-gray-700">Customer Rating</h3>
          <p className="text-2xl font-bold mt-2">4.8/5</p>
        </div>

        {/* Property Management */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Property Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Total Properties</h4>
              <p className="text-xl">5</p>
            </div>
            <div>
              <h4 className="font-medium">Active Listings</h4>
              <p className="text-xl">12</p>
            </div>
            <div>
              <h4 className="font-medium">Maintenance Issues</h4>
              <p className="text-xl">3</p>
            </div>
            <div>
              <h4 className="font-medium">Upcoming Inspections</h4>
              <p className="text-xl">2</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
          <div className="space-y-3">
            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
              Add Property
            </button>
            <button className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition">
              Financial Reports
            </button>
            <button className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition">
              Staff Management
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;