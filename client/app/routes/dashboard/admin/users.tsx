import React, { useState, useMemo, useEffect } from "react";
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
  Loader2,
  UserCheck,
} from "lucide-react";

interface User {
  id: string;
  username: string;
  fullname: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  isActive: boolean;
  location: string;
  nisn: string;
  studentClass: string;
  school: string;
  lastActive: string;
  createdAt: string;
  pointsBalance: number;
  totalBottles: number;
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
    fullname: "",
    email: "",
    phone: "",
    role: "user" as User["role"],
    isActive: true,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Load users data
  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch("/api/web/dashboard/admin/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        setError("Failed to load users");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filter and search users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.isActive) ||
        (statusFilter === "inactive" && !user.isActive);
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

  const handleStatusChange = async (userId: string, newStatus: boolean) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "/api/web/dashboard/admin/users/${userId}/status",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive: newStatus }),
        }
      );

      if (response.ok) {
        // Reload users
        await loadUsers();
        alert(newStatus ? "User diaktifkan" : "User dinonaktifkan");
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus user ini?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "/api/web/dashboard/admin/users/${userId}",
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          alert("User berhasil dihapus!");
          await loadUsers(); // Reload users
        } else {
          alert("Failed to delete user");
        }
      } catch (err) {
        alert("Network error. Please try again.");
      }
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      fullname: user.fullname,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      isActive: user.isActive,
    });
    setShowEditModal(true);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "/api/web/dashboard/admin/users/${editingUser.id}",
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(editFormData),
          }
        );

        if (response.ok) {
          alert("User berhasil diupdate!");
          setShowEditModal(false);
          setEditingUser(null);
          await loadUsers(); // Reload users
        } else {
          alert("Failed to update user");
        }
      } catch (err) {
        alert("Network error. Please try again.");
      }
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

  const getStatusBadge = (isActive: boolean) => {
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
    };
    return isActive ? statusConfig.active : statusConfig.inactive;
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
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            Manajemen Pengguna
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 ml-1">
            Pantau dan kelola data nasabah bank sampah
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Users className="w-24 h-24" />
          </div>
          <p className="text-blue-100 font-medium mb-1 relative z-10">
            Total Pengguna
          </p>
          <h3 className="text-4xl font-bold relative z-10">{users.length}</h3>
          <div className="mt-4 flex items-center gap-2 text-sm text-blue-100/80 relative z-10">
            <span className="bg-white/20 px-2 py-0.5 rounded text-white font-medium">
              {users.filter((u) => u.isActive).length}
            </span>
            <span>Akun Aktif</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Calendar className="w-24 h-24 text-purple-500" />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
              <Calendar className="w-6 h-6" />
            </div>
            <p className="font-medium text-gray-500 dark:text-gray-400">
              User Baru
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              +
              {
                users.filter(
                  (u) =>
                    new Date(u.createdAt) >
                    new Date(new Date().setDate(new Date().getDate() - 30))
                ).length
              }
            </h3>
            <p className="text-xs text-gray-500">Dalam 30 hari terakhir</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Activity className="w-24 h-24 text-emerald-500" />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
              <Activity className="w-6 h-6" />
            </div>
            <p className="font-medium text-gray-500 dark:text-gray-400">
              Total Aktivitas
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              {users
                .reduce((sum, u) => sum + u.totalBottles, 0)
                .toLocaleString()}{" "}
              <span className="text-lg font-normal text-gray-400">botol</span>
            </h3>
            <p className="text-xs text-gray-500">Terkumpul dari semua user</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col">
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 dark:border-slate-700 flex flex-col lg:flex-row gap-4 justify-between items-center">
          {/* Search */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari user (nama, email, no.hp)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-200 dark:border-slate-600">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent border-none text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-0 cursor-pointer"
              >
                <option value="all">Status: Semua</option>
                <option value="active">Status: Aktif</option>
                <option value="inactive">Status: Nonaktif</option>
              </select>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-200 dark:border-slate-600">
              <UserCheck className="w-4 h-4 text-gray-500" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-transparent border-none text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-0 cursor-pointer"
              >
                <option value="all">Role: Semua</option>
                <option value="user">Role: User</option>
                <option value="admin">Role: Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
            <p className="text-gray-500">Mengambil data user...</p>
          </div>
        ) : error ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="bg-red-50 p-4 rounded-full mb-3">
              <UserX className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-red-900 font-medium mb-2">{error}</p>
            <button
              onClick={loadUsers}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 dark:bg-slate-700/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role & Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Kontak
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Statistik
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50/80 dark:hover:bg-slate-700/30 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800">
                          {user.fullname.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            {user.fullname}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3" /> Joined{" "}
                            {new Date(user.createdAt).toLocaleDateString(
                              "id-ID",
                              { month: "short", year: "numeric" }
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col items-start gap-1.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            user.role === "admin"
                              ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800"
                              : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
                          }`}
                        >
                          {user.role}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`w-2 h-2 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-gray-300"}`}
                          />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {user.isActive ? "Aktif" : "Nonaktif"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          {user.phone || "-"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {user.totalBottles.toLocaleString()}{" "}
                          <span className="text-xs font-normal text-gray-500">
                            botol
                          </span>
                        </div>
                        <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded inline-block">
                          {user.pointsBalance.toLocaleString()} Poin
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between bg-gray-50/50 dark:bg-slate-700/10">
            <p className="text-sm text-gray-500">
              Menampilkan{" "}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              -{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
              </span>{" "}
              dari <span className="font-medium">{filteredUsers.length}</span>{" "}
              user
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 dark:border-slate-700">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Users className="w-32 h-32" />
              </div>
              <button
                onClick={() => setShowUserModal(false)}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <UserX className="w-5 h-5 text-white" />
              </button>

              <div className="relative z-10 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-bold border-2 border-white/30 text-white shadow-xl">
                  {selectedUser.fullname.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.fullname}</h3>
                  <p className="text-blue-100 text-sm flex items-center gap-2">
                    <Mail className="w-3 h-3" /> {selectedUser.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-100 dark:border-slate-600">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Total Poin
                  </p>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedUser.pointsBalance.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-100 dark:border-slate-600">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Total Botol
                  </p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {selectedUser.totalBottles.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Info List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                      <Phone className="w-4 h-4" />
                    </div>
                    {selectedUser.phone || "Tidak ada nomor"}
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg">
                      <MapPin className="w-4 h-4" />
                    </div>
                    {selectedUser.location || "Lokasi belum diatur"}
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-lg">
                      <Activity className="w-4 h-4" />
                    </div>
                    Terakhir aktif:{" "}
                    {selectedUser.lastActive
                      ? new Date(selectedUser.lastActive).toLocaleDateString(
                          "id-ID"
                        )
                      : "-"}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-slate-700">
                <button
                  onClick={() => {
                    handleEditUser(selectedUser);
                    setShowUserModal(false);
                  }}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                >
                  Edit Data
                </button>
                {!selectedUser.isActive ? (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedUser.id, true);
                      setShowUserModal(false);
                    }}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
                  >
                    Aktifkan Akun
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedUser.id, false);
                      setShowUserModal(false);
                    }}
                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                  >
                    Nonaktifkan
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Edit User
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <UserX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    value={editFormData.fullname}
                    onChange={handleEditFormChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditFormChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleEditFormChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Role
                    </label>
                    <select
                      name="role"
                      value={editFormData.role}
                      onChange={handleEditFormChange}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Status
                    </label>
                    <select
                      name="isActive"
                      value={editFormData.isActive ? "true" : "false"}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          isActive: e.target.value === "true",
                        }))
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="true">Aktif</option>
                      <option value="false">Nonaktif</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-colors"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
