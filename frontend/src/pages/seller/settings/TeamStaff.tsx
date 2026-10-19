import React, { useState, useMemo } from "react";
import { Search, Plus, ShieldCheck, Mail, Phone, Edit, Trash2, X, UserCheck, UserX } from "lucide-react";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Admin" | "Moderator" | "Editor" | "Support";
  status: "Active" | "Inactive";
  joinedDate: string;
  lastActive: string;
  permissions: string[];
}

const INITIAL_TEAM: TeamMember[] = [
  {
    id: "ADM-101",
    name: "তানভীর আহমেদ",
    email: "tanvir@twelveclothing.com",
    phone: "+880 1700-112233",
    role: "Admin",
    status: "Active",
    joinedDate: "01 Jan, 2026",
    lastActive: "Just now",
    permissions: ["Full Access", "Product Control", "Orders Management", "Team Control"],
  },
  {
    id: "MOD-102",
    name: "সাকিব হাসান",
    email: "sakib@twelveclothing.com",
    phone: "+880 1811-445566",
    role: "Moderator",
    status: "Active",
    joinedDate: "15 Feb, 2026",
    lastActive: "10 mins ago",
    permissions: ["Orders Management", "Customer View", "Status Update"],
  },
  {
    id: "EDT-103",
    name: "মরিয়ম বেগম",
    email: "moriyom@twelveclothing.com",
    phone: "+880 1922-778899",
    role: "Editor",
    status: "Active",
    joinedDate: "10 Mar, 2026",
    lastActive: "2 hours ago",
    permissions: ["Product CRUD", "Slider Management"],
  },
  {
    id: "SUP-104",
    name: "কামরুল ইসলাম",
    email: "kamrul@twelveclothing.com",
    phone: "+880 1633-001122",
    role: "Support",
    status: "Inactive",
    joinedDate: "01 Apr, 2026",
    lastActive: "3 days ago",
    permissions: ["Orders View Only", "Customer Support"],
  },
];

export const TeamStaff: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  // মোডাল স্টেট
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<TeamMember | null>(null);

  // ফর্ম স্টেট
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: "",
    email: "",
    phone: "",
    role: "Moderator",
    status: "Active",
  });

  // সার্চ ও রোল ফিল্টার
  const filteredTeam = useMemo(() => {
    return team.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone.includes(searchTerm) ||
        member.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = selectedRole === "All" || member.role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [team, searchTerm, selectedRole]);

  // স্ট্যাটাস টগল (Active/Inactive)
  const toggleStatus = (id: string) => {
    setTeam((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: m.status === "Active" ? "Inactive" : "Active" } : m
      )
    );
  };

  // ডিলিট মেম্বার
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to remove this staff member?")) {
      setTeam((prev) => prev.filter((m) => m.id !== id));
    }
  };

  // মোডাল ওপেন
  const handleOpenAddModal = () => {
    setMemberToEdit(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "Moderator",
      status: "Active",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member: TeamMember) => {
    setMemberToEdit(member);
    setFormData(member);
    setIsModalOpen(true);
  };

  // সাবমিট হ্যান্ডলার
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const getPermissionsByRole = (role: string) => {
      switch (role) {
        case "Admin":
          return ["Full Access", "Product Control", "Orders Management", "Team Control"];
        case "Moderator":
          return ["Orders Management", "Customer View", "Status Update"];
        case "Editor":
          return ["Product CRUD", "Slider Management"];
        case "Support":
          return ["Orders View Only", "Customer Support"];
        default:
          return ["Basic Access"];
      }
    };

    if (memberToEdit) {
      setTeam((prev) =>
        prev.map((m) =>
          m.id === memberToEdit.id
            ? {
                ...m,
                ...formData,
                permissions: getPermissionsByRole(formData.role || "Moderator"),
              } as TeamMember
            : m
        )
      );
    } else {
      const newMember: TeamMember = {
        id: `STF-${Math.floor(100 + Math.random() * 900)}`,
        name: formData.name || "New Staff",
        email: formData.email || "staff@twelveclothing.com",
        phone: formData.phone || "+880 1700-000000",
        role: (formData.role as TeamMember["role"]) || "Moderator",
        status: (formData.status as TeamMember["status"]) || "Active",
        joinedDate: "18 Oct, 2026",
        lastActive: "Never",
        permissions: getPermissionsByRole(formData.role || "Moderator"),
      };
      setTeam((prev) => [newMember, ...prev]);
    }

    setIsModalOpen(false);
  };

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
            className="w-full sm:w-48 bg-surface border border-borderLight text-sm text-gray-700 py-2 px-3 rounded-xl outline-none focus:border-cardHeader transition-colors cursor-pointer"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Moderator">Moderator</option>
            <option value="Editor">Editor</option>
            <option value="Support">Support</option>
          </select>
        </div>
      </div>

      {/* MOBILE VIEW: কার্ড লেআউট */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredTeam.length > 0 ? (
          filteredTeam.map((member) => (
            <div
              key={member.id}
              className="bg-white p-4 rounded-2xl border border-borderLight shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-primary">{member.id}</span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    member.role === "Admin"
                      ? "bg-purple-100 text-purple-700"
                      : member.role === "Moderator"
                      ? "bg-blue-100 text-blue-700"
                      : member.role === "Editor"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-100 text-gray-700"
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
                  <Phone className="w-3.5 h-3.5 text-gray-400" /> {member.phone}
                </p>
              </div>

              <div className="flex flex-wrap gap-1 pt-2 border-t border-borderLight">
                {member.permissions.map((perm, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium bg-surface text-gray-600 px-2 py-0.5 rounded border border-borderLight"
                  >
                    {perm}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-borderLight text-xs">
                <button
                  onClick={() => toggleStatus(member.id)}
                  className={`flex items-center gap-1 font-bold ${
                    member.status === "Active" ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {member.status === "Active" ? (
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
                    onClick={() => handleDelete(member.id)}
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
                <th className="py-4 px-6">Permissions</th>
                <th className="py-4 px-6">Status / Last Active</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderLight text-sm text-gray-700">
              {filteredTeam.length > 0 ? (
                filteredTeam.map((member) => (
                  <tr key={member.id} className="hover:bg-surface/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-bold text-primary block">{member.name}</span>
                      <span className="text-xs font-mono text-gray-400">{member.id}</span>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full inline-block ${
                          member.role === "Admin"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : member.role === "Moderator"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : member.role === "Editor"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-gray-50 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {member.role}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="text-xs font-medium text-gray-700 block">{member.email}</span>
                      <span className="text-xs text-gray-400 block">{member.phone}</span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {member.permissions.map((perm, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium bg-surface text-gray-600 px-2 py-0.5 rounded border border-borderLight"
                          >
                            {perm}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <button
                        onClick={() => toggleStatus(member.id)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors block mb-1 ${
                          member.status === "Active"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {member.status}
                      </button>
                      <span className="text-[11px] text-gray-400 block">
                        Active: {member.lastActive}
                      </span>
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
                          onClick={() => handleDelete(member.id)}
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
                  <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                    No staff members found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
                  Configure role and contact credentials for dashboard access.
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
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
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
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as TeamMember["role"] })}
                    className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader cursor-pointer"
                  >
                    <option value="Admin">Admin (Full Control)</option>
                    <option value="Moderator">Moderator (Orders & Status)</option>
                    <option value="Editor">Editor (Products & Sliders)</option>
                    <option value="Support">Support (View Only)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Account Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as TeamMember["status"] })}
                    className="w-full px-3.5 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none focus:border-cardHeader cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
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
                  className="px-6 py-2.5 bg-cardHeader text-white font-semibold text-sm rounded-xl hover:bg-cardAccent transition-colors shadow-xs cursor-pointer"
                >
                  {memberToEdit ? "Update Member" : "Save Member"}
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