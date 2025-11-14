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

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // --------------------------------------------
      // CHANGE THIS URL TO YOUR NEW API URL
      // --------------------------------------------
      const response = await fetch('https://example.com/api/random-users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();

      // --------------------------------------------
      // TRANSFORM THE NEW API STRUCTURE HERE
      //
      // Example random structure:
      // {
      //   "uid": 101,
      //   "fullName": "John Doe",
      //   "mail": "john@gmail.com",
      //   "mobile": "9838383883",
      //   "location": "Mumbai",
      //   "workplace": "TechCorp"
      // }
      //
      // You ONLY need to edit this mapping block
      // when using a different API.
      // --------------------------------------------
      const mappedUsers = data.map((u) => ({
        id: u.uid,                     // change if your API uses a different primary key
        name: u.fullName,              // replace with your name field
        username: u.userName || '',    // optional (fallback)
        email: u.mail,                 // replace with your email field
        phone: u.mobile,               // replace with your phone field
        address: { city: u.location }, // replace with your city field
        company: { name: u.workplace } // replace with your company field
      }));

      setUsers(mappedUsers);
      setFilteredUsers(mappedUsers);
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
      result = result.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    result.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

    setFilteredUsers(result);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">User Directory</h1>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={toggleSortOrder}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowUpDown className="w-5 h-5" />
              Sort {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
            </button>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{user.name}</h3>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 font-medium">Email:</span>
                  <span className="text-gray-700 break-all">{user.email}</span>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-gray-500 font-medium">Phone:</span>
                  <span className="text-gray-700">{user.phone}</span>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-gray-500 font-medium">City:</span>
                  <span className="text-gray-700">{user.address.city}</span>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-gray-500 font-medium">Company:</span>
                  <span className="text-gray-700">{user.company.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No users found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
