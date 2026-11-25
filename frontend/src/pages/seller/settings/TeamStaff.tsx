import React, { useState, useEffect, useMemo } from "react";
import { Search, Plus, ShieldCheck, Mail, Phone, Edit, Trash2, X, UserCheck, UserX, Loader2, ShieldAlert } from "lucide-react";
import { useUser } from "../../../features/user/useUser";
import type { IUser } from "../../../features/user/userType";

import { useAppDispatch } from "../../../app/hooks";
import { openModal } from "../../../features/alert/modalSlice";
import { useAuth } from "../../../features/auth/useAuth";

export const TeamStaff: React.FC = () => {
  const { isAdmin } = useAuth(); 
  const dispatch = useAppDispatch();
  const {
    users,
    isLoading,
    error, 
    fetchAllUsers,
    addNewUser,
    editUser,
    removeUser,
  } = useUser();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  // মোডাল স্টেট
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<IUser | null>(null);

  // ফর্ম স্টেট
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    role: "admin" | "moderator" | "seller";
    status: "active" | "inactive";
  }>({
    name: "",
    email: "",
    phone: "",
    role: "moderator",
    status: "active",
  });

  // কম্পোনেন্ট মাউন্ট হওয়ার পর এবং Admin হলে ইউজার ফেচ করা
  useEffect(() => {
    if (isAdmin) {
      fetchAllUsers();
    }
  }, [isAdmin]);

  // সার্চ ও রোল ফিল্টার
  const filteredTeam = useMemo(() => {
    if (!Array.isArray(users)) return [];
    return users.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.phone && member.phone.includes(searchTerm)) ||
        member.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = selectedRole === "All" || member.role.toLowerCase() === selectedRole.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, selectedRole]);

  // স্ট্যাটাস টগল (Active/Inactive)
  const toggleStatus = async (member: IUser) => {
    if (!isAdmin) return;
    try {
      const newStatus = member.status === "active" ? "inactive" : "active";
      await editUser(member.id, { status: newStatus });
      fetchAllUsers();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // ডিলিট মেম্বার
  const handleDelete = async (id: string, name: string, email: string) => {
    if (!isAdmin) return;

    dispatch(
      openModal({
        title: "Delete User Confirmation",
        message: `Are you sure you want to delete "${name}" (${email})? This action cannot be undone.`,
        onConfirm: async () => {
          try {
            await removeUser(id);
            fetchAllUsers();
          } catch (error) {
            console.error("Failed to delete user:", error);
          }
        },
      })
    );
  };

  // মোডাল ওপেন
  const handleOpenAddModal = () => {
    setMemberToEdit(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "moderator",
      status: "active",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member: IUser) => {
    setMemberToEdit(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone || "",
      role: member.role,
      status: member.status,
    });
    setIsModalOpen(true);
  };

  // সাবমিট হ্যান্ডলার (Create & Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (memberToEdit) {
        await editUser(memberToEdit.id, formData);
      } else {
        await addNewUser(formData);
      }
      setIsModalOpen(false);
      fetchAllUsers();
    } catch (err) {
      console.error("Failed to save user:", err);
    }
  };

  // 🟢 যদি ইউজার Admin না হয়, তবে রেস্ট্রিক্টেড এক্সেস মেসেজ দেখাবে
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-xs">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-primary">Access Denied</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Team and staff management features contain sensitive administrative controls. Only administrators are authorized to view and modify this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans pb-10">
      {/* পেজ হেডার */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">
            Team & Staff Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage admins, moderators, and staff permissions for Twelve Clothing dashboard.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-cardHeader text-white text-sm font-semibold rounded-xl hover:bg-cardAccent transition-colors shadow-xs cursor-pointer w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Staff</span>
        </button>
      </div>

      {/* এরর বা লোডিং স্টেট */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* সার্চ ও ফিল্টার বার */}
      <div className="bg-white p-4 rounded-2xl border border-borderLight shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search staff by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none text-primary focus:border-cardHeader transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <ShieldCheck className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full sm:w-48 bg-surface border border-borderLight text-sm text-gray-700 py-2 px-3 rounded-xl outline-none focus:border-cardHeader transition-colors cursor-pointer capitalize"
          >
            <option value="All">All Roles</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="seller">Seller</option>
          </select>
        </div>
      </div>

      {isLoading && users.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-cardHeader" />
        </div>
      ) : (
        <>
          {/* MOBILE VIEW: কার্ড লেআউট */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredTeam.length > 0 ? (
              filteredTeam.map((member) => (
                <div
                  key={member.id}
                  className="bg-white p-4 rounded-2xl border border-borderLight shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-primary">{`#${member.id.slice(0, 8)}`}</span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                        member.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : member.role === "moderator"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {member.role}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-semibold text-primary text-sm">{member.name}</h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-gray-400" /> {member.email}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-gray-400" /> {member.phone || "N/A"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-borderLight text-xs">
                    <button
                      onClick={() => toggleStatus(member)}
                      className={`flex items-center gap-1 font-bold capitalize ${
                        member.status === "active" ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      {member.status === "active" ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5" /> Active
                        </>
                      ) : (
                        <>
                          <UserX className="w-3.5 h-3.5" /> Inactive
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(member)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id, member.name, member.email)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-8 text-center rounded-2xl border border-borderLight text-gray-400 text-sm">
                No team members found.
              </div>
            )}
          </div>

          {/* DESKTOP VIEW: টেবিল লেআউট */}
          <div className="hidden md:block bg-white rounded-2xl border border-borderLight shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface text-gray-500 text-xs uppercase tracking-wider border-b border-borderLight">
                    <th className="py-4 px-6">Staff Member</th>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6">Contact Details</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderLight text-sm text-gray-700">
                  {filteredTeam.length > 0 ? (
                    filteredTeam.map((member) => (
                      <tr key={member.id} className="hover:bg-surface/50 transition-colors">
                        <td className="py-4 px-6">
                          <span className="font-bold text-primary block">{member.name}</span>
                          <span className="text-xs font-mono text-gray-400">{`#${member.id.slice(0, 8)}`}</span>
                        </td>

                        <td className="py-4 px-6">
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-full inline-block capitalize ${
                              member.role === "admin"
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
                                : member.role === "moderator"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {member.role}
                          </span>
                        </td>

                        <td className="py-4 px-6">
                          <span className="text-xs font-medium text-gray-700 block">{member.email}</span>
                          <span className="text-xs text-gray-400 block">{member.phone || "N/A"}</span>
                        </td>

                        <td className="py-4 px-6">
                          <button
                            onClick={() => toggleStatus(member)}
                            className={`text-xs font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors block capitalize ${
                              member.status === "active"
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                          >
                            {member.status}
                          </button>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              title="Edit Staff"
                              onClick={() => handleOpenEditModal(member)}
                              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              title="Remove Staff"
                              onClick={() => handleDelete(member.id, member.name, member.email)}
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-400 text-sm">
                        No staff members found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* অ্যাড ও এডিট স্টাফ মডাল */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg border border-borderLight shadow-xl font-sans">
            <div className="p-6 border-b border-borderLight flex items-center justify-between">
              <div>
                <h2 className="font-heading text-xl font-bold text-primary">
                  {memberToEdit ? "Edit Staff Details" : "Add New Staff Member"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Configure role and contact credentials for dashboard access. Credentials will be emailed automatically.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-primary rounded-xl hover:bg-surface transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Shakib Al Hasan"
                  className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="shakib@twelve.com"
                    className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+880 1700-000000"
                    className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Select Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as IUser["role"] })}
                    className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader cursor-pointer capitalize"
                  >
                    <option value="admin">Admin (Full Control)</option>
                    <option value="moderator">Moderator (Orders & Status)</option>
                    <option value="seller">Seller</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Account Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as IUser["status"] })}
                    className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader cursor-pointer capitalize"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-borderLight flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-borderLight text-gray-600 font-medium text-sm rounded-xl hover:bg-surface transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-cardHeader text-white font-semibold text-sm rounded-xl hover:bg-cardAccent transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : memberToEdit ? "Update Member" : "Save Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamStaff;