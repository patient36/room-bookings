import { User } from "@/context/AuthContext";

interface BookerDashboardProps {
  user: User;
}

const BookerDashboard = ({ user }: BookerDashboardProps) => {
  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Booker Dashboard</h1>
        <p className="text-gray-600">Hello, {user.name}!</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-gray-700">My Bookings</h3>
          <p className="text-2xl font-bold mt-2">12</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-gray-700">Upcoming</h3>
          <p className="text-2xl font-bold mt-2">3</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-gray-700">Pending</h3>
          <p className="text-2xl font-bold mt-2">2</p>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Recent Bookings</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left py-2">ID</th>
                  <th className="text-left py-2">Event</th>
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2">#1234</td>
                  <td className="py-2">Corporate Conference</td>
                  <td className="py-2">May 15, 2023</td>
                  <td className="py-2 text-green-500">Confirmed</td>
                </tr>
                <tr>
                  <td className="py-2">#1235</td>
                  <td className="py-2">Product Launch</td>
                  <td className="py-2">May 22, 2023</td>
                  <td className="py-2 text-yellow-500">Pending</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
              New Booking
            </button>
            <button className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition">
              View Calendar
            </button>
            <button className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition">
              My Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookerDashboard;