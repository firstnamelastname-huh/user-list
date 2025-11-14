import { useState, useEffect } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';

function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [searchTerm, sortOrder, users]);


  // ⭐⭐⭐ MAIN MAPPER — EDIT THIS WHEN USING ANOTHER API
  const mapUser = (u) => ({
    id: u.id ?? u.userId ?? Date.now(),

    // if API uses "fullName" instead of "name"
    name: u.name ?? u.fullName ?? "Unknown",

    // fallback for username
    username: u.username ?? u.userName ?? "",

    email: u.email ?? u.emailAddress ?? "N/A",
    phone: u.phone ?? u.mobile ?? "N/A",

    // Address mapping (safe)
    address: {
      city: u.address?.city ?? u.city ?? "Unknown",
    },

    // Company mapping (safe)
    company: {
      name: u.company?.name ?? u.companyName ?? "Unknown",
    },
  });
  // ⭐⭐⭐ END OF MAPPER


  const fetchUsers = async () => {
    try {
      setLoading(true);

      // ⭐ Change only this URL when using any new API
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) throw new Error('Failed to fetch users');

      const data = await response.json();

      // Apply mapper here
      const mapped = data.map(mapUser);

      setUsers(mapped);
      setFilteredUsers(mapped);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const filterAndSortUsers = () => {
    let result = [...users];

    if (searchTerm) {
      result = result.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result.sort((a, b) =>
      sortOrder === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

    setFilteredUsers(result);
  };


  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };


  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading users...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Error: {error}
      </div>
    );


  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h1 className="text-3xl font-bold mb-6">User Directory</h1>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>

            <button
              onClick={toggleSortOrder}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              <ArrowUpDown />
              Sort {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
            </button>
          </div>

          <p className="text-sm text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>


        {/* USER CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white p-6 rounded-lg shadow hover:shadow-xl">

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  {user.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{user.name}</h3>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="font-medium">Email:</span>
                  <span>{user.email}</span>
                </div>

                <div className="flex gap-2">
                  <span className="font-medium">Phone:</span>
                  <span>{user.phone}</span>
                </div>

                <div className="flex gap-2">
                  <span className="font-medium">City:</span>
                  <span>{user.address.city}</span>
                </div>

                <div className="flex gap-2">
                  <span className="font-medium">Company:</span>
                  <span>{user.company.name}</span>
                </div>
              </div>

            </div>
          ))}
        </div>


        {filteredUsers.length === 0 && (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            No users found.
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
