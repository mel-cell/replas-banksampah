import React, { useState, useMemo } from "react";
import {
  Users,
  Search,
  Filter,
  Edit,
  Trash2,
  UserX,
  Eye,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Award,
  Activity,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "suspended";
  role: "user" | "admin";
  joinDate: string;
  lastActive: string;
  location: string;
  points: number;
  totalDeposits: number;
}

export default function ManageUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user" as User["role"],
    status: "active" as User["status"],
  });
  const itemsPerPage = 10;

  // Sample user data
  const users: User[] = [
    {
      id: "1",
      name: "Ahmad Surya",
      email: "ahmad.surya@email.com",
      phone: "+62 812-3456-7890",
      status: "active",
      role: "user",
      joinDate: "2024-01-15",
      lastActive: "2024-01-20",
      location: "Jakarta",
      points: 1250,
      totalDeposits: 45.5,
    },
    {
      id: "2",
      name: "Siti Rahayu",
      email: "siti.rahayu@email.com",
      phone: "+62 811-2345-6789",
      status: "active",
      role: "user",
      joinDate: "2024-01-10",
      lastActive: "2024-01-19",
      location: "Bandung",
      points: 890,
      totalDeposits: 32.2,
    },
    {
      id: "3",
      name: "Budi Santoso",
      email: "budi.santoso@email.com",
      phone: "+62 813-4567-8901",
      status: "inactive",
      role: "user",
      joinDate: "2023-12-05",
      lastActive: "2024-01-15",
      location: "Surabaya",
      points: 567,
      totalDeposits: 18.7,
    },
    {
      id: "4",
      name: "Maya Sari",
      email: "maya.sari@email.com",
      phone: "+62 814-5678-9012",
      status: "active",
      role: "user",
      joinDate: "2024-01-08",
      lastActive: "2024-01-20",
      location: "Yogyakarta",
      points: 1456,
      totalDeposits: 52.3,
    },
    {
      id: "5",
      name: "Rudi Hartono",
      email: "rudi.hartono@email.com",
      phone: "+62 815-6789-0123",
      status: "suspended",
      role: "user",
      joinDate: "2023-11-20",
      lastActive: "2024-01-10",
      location: "Semarang",
      points: 234,
      totalDeposits: 8.9,
    },
  ];

  // Filter and search users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm);
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;
      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchTerm, statusFilter, roleFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusChange = (userId: string, newStatus: User["status"]) => {
    // In real app, this would make an API call
    console.log(`Changing status of user ${userId} to ${newStatus}`);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus user ini?")) {
      // In real app, this would make an API call
      console.log(`Deleting user ${userId}`);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
    });
    setShowEditModal(true);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      // In real app, this would make an API call
      console.log(`Updating user ${editingUser.id}`, editFormData);
      alert("User berhasil diupdate!");
      setShowEditModal(false);
      setEditingUser(null);
    }
  };

  const handleEditFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSuspendUser = (userId: string) => {
    if (confirm("Apakah Anda yakin ingin menangguhkan user ini?")) {
      // In real app, this would make an API call
      console.log(`Suspending user ${userId}`);
      alert("User berhasil ditangguhkan!");
    }
  };

  const getStatusBadge = (status: User["status"]) => {
    const statusConfig = {
      active: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        label: "Aktif",
      },
      inactive: {
        color:
          "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
        label: "Tidak Aktif",
      },
      suspended: {
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        label: "Ditangguhkan",
      },
    };
    return statusConfig[status];
  };

  const getRoleBadge = (role: User["role"]) => {
    const roleConfig = {
      user: {
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        label: "User",
      },
      admin: {
        color:
          "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
        label: "Admin",
      },
    };
    return roleConfig[role];
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="animate-in slide-in-from-left-4 duration-500">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            Manajemen User
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola data pengguna sistem bank sampah
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-bottom-4 duration-500 delay-100">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Users
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {users.length}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                New This Month
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {
                  users.filter(
                    (u) => new Date(u.joinDate) > new Date("2024-01-01")
                  ).length
                }
              </p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Konversi
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {users.reduce((sum, u) => sum + u.totalDeposits, 0)}
              </p>
            </div>
            <Activity className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-in slide-in-from-bottom-4 duration-500 delay-200">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari nama, email, atau nomor telepon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
                <option value="suspended">Ditangguhkan</option>
              </select>
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-in slide-in-from-bottom-4 duration-500 delay-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Kontak
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Poin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Bergabung
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          {user.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white flex items-center gap-1">
                      <Mail className="w-3 h-3 text-gray-400" />
                      {user.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {user.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(user.status).color}`}
                      >
                        {getStatusBadge(user.status).label}
                      </span>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadge(user.role).color}`}
                      >
                        {getRoleBadge(user.role).label}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-emerald-600" />
                      {user.points.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.totalDeposits} kg sampah
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(user.joinDate).toLocaleDateString("id-ID")}
                    </div>
                    <div className="text-xs">
                      <Activity className="w-3 h-3 inline mr-1" />
                      {user.lastActive}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Hapus User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {user.status !== "suspended" && (
                        <button
                          onClick={() => handleSuspendUser(user.id)}
                          className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300 p-1 rounded hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                          title="Tangguhkan User"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Menampilkan{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  sampai{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
                  </span>{" "}
                  dari{" "}
                  <span className="font-medium">{filteredUsers.length}</span>{" "}
                  hasil
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ‹
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum =
                      Math.max(1, Math.min(totalPages - 4, currentPage - 2)) +
                      i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pageNum === currentPage
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ›
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Detail User
              </h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-medium text-lg">
                    {selectedUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    {selectedUser.name}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Status
                  </p>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedUser.status).color}`}
                  >
                    {getStatusBadge(selectedUser.status).label}
                  </span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Role
                  </p>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadge(selectedUser.role).color}`}
                  >
                    {getRoleBadge(selectedUser.role).label}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {selectedUser.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {selectedUser.phone}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {selectedUser.location}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    Bergabung{" "}
                    {new Date(selectedUser.joinDate).toLocaleDateString(
                      "id-ID"
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    Aktif terakhir {selectedUser.lastActive}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {selectedUser.points.toLocaleString()} poin (
                    {selectedUser.totalDeposits} kg sampah)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowUserModal(false);
                  handleEditUser(selectedUser);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Edit User
              </button>
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Edit User
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={editFormData.role}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                  <option value="suspended">Ditangguhkan</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Simpan Perubahan
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
