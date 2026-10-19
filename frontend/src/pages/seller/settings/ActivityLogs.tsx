import React, { useState, useMemo } from "react";
import { Search, Filter, Activity, Clock, Trash2, } from "lucide-react";

export interface ActivityLog {
  id: string;
  userName: string;
  userRole: "Admin" | "Moderator" | "Editor" | "Support";
  action: string;
  module: "Orders" | "Products" | "Customers" | "Sliders" | "Team";
  details: string;
  ipAddress: string;
  timestamp: string;
}

const INITIAL_LOGS: ActivityLog[] = [
  {
    id: "LOG-1001",
    userName: "তানভীর আহমেদ",
    userRole: "Admin",
    action: "Blocked IP Address",
    module: "Customers",
    details: "Blocked IP 45.112.88.99 due to suspicious fake orders.",
    ipAddress: "103.220.12.5",
    timestamp: "18 Oct, 2026 - 06:45 PM",
  },
  {
    id: "LOG-1002",
    userName: "সাকিব হাসান",
    userRole: "Moderator",
    action: "Order Status Updated",
    module: "Orders",
    details: "Changed status of order #TC-ORD-902 from 'Pending' to 'Processing'.",
    ipAddress: "192.168.1.45",
    timestamp: "18 Oct, 2026 - 05:30 PM",
  },
  {
    id: "LOG-1003",
    userName: "মরিয়ম বেগম",
    userRole: "Editor",
    action: "Added New Product",
    module: "Products",
    details: "Created product 'Mens Premium Embroidery Panjabi' (SKU: RA-MEN-PNJ-108).",
    ipAddress: "203.110.22.14",
    timestamp: "18 Oct, 2026 - 03:15 PM",
  },
  {
    id: "LOG-1004",
    userName: "সাকিব হাসান",
    userRole: "Moderator",
    action: "Viewed Order Details",
    module: "Orders",
    details: "Viewed order details for #TC-ORD-901 and marked as 'Seen'.",
    ipAddress: "192.168.1.45",
    timestamp: "18 Oct, 2026 - 02:00 PM",
  },
  {
    id: "LOG-1005",
    userName: "তানভীর আহমেদ",
    userRole: "Admin",
    action: "Banner Slide Updated",
    module: "Sliders",
    details: "Updated banner image for 'NEW EID COLLECTION' slider.",
    ipAddress: "103.220.12.5",
    timestamp: "17 Oct, 2026 - 11:20 AM",
  },
];

export const ActivityLogs: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>(INITIAL_LOGS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState("All");

  // ফিল্টার করা লগের লিস্ট
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipAddress.includes(searchTerm);

      const matchesModule =
        selectedModule === "All" || log.module === selectedModule;

      return matchesSearch && matchesModule;
    });
  }, [logs, searchTerm, selectedModule]);

  // লগ ক্লিয়ার হ্যান্ডলার (অ্যাডমিনদের জন্য)
  const handleClearLogs = () => {
    if (window.confirm("Are you sure you want to clear all activity logs?")) {
      setLogs([]);
    }
  };

  return (
    <div className="space-y-6 font-sans pb-10">
      {/* পেজ হেডার */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary flex items-center gap-2">
            <Activity className="w-6 h-6 text-cardHeader" />
            Activity Logs & Audit Trail
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Track real-time actions taken by admins, moderators, and editors.
          </p>
        </div>

        {logs.length > 0 && (
          <button
            onClick={handleClearLogs}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 text-xs font-bold rounded-xl hover:bg-red-100 transition-colors cursor-pointer w-full sm:w-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Audit Logs</span>
          </button>
        )}
      </div>

      {/* সার্চ এবং ফিল্টার বার */}
      <div className="bg-white p-4 rounded-2xl border border-borderLight shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by User, Action, Details, IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none text-primary focus:border-cardHeader transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="w-full sm:w-48 bg-surface border border-borderLight text-sm text-gray-700 py-2 px-3 rounded-xl outline-none focus:border-cardHeader transition-colors cursor-pointer"
          >
            <option value="All">All Modules</option>
            <option value="Orders">Orders</option>
            <option value="Products">Products</option>
            <option value="Customers">Customers</option>
            <option value="Sliders">Sliders</option>
            <option value="Team">Team</option>
          </select>
        </div>
      </div>

      {/* MOBILE VIEW: কার্ড লেআউট */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="bg-white p-4 rounded-2xl border border-borderLight shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-primary">
                  {log.id}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-surface text-gray-600 rounded-md border border-borderLight">
                  {log.module}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-primary">{log.userName}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      log.userRole === "Admin"
                        ? "bg-purple-100 text-purple-700"
                        : log.userRole === "Moderator"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {log.userRole}
                  </span>
                </div>
                <p className="text-xs font-bold text-cardHeader">{log.action}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{log.details}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-borderLight text-[11px] text-gray-400 font-mono">
                <span>IP: {log.ipAddress}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {log.timestamp}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-8 text-center rounded-2xl border border-borderLight text-gray-400 text-sm">
            No activity logs found.
          </div>
        )}
      </div>

      {/* DESKTOP VIEW: টেবিল লেআউট */}
      <div className="hidden md:block bg-white rounded-2xl border border-borderLight shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface text-gray-500 text-xs uppercase tracking-wider border-b border-borderLight">
                <th className="py-4 px-6">User & Role</th>
                <th className="py-4 px-6">Module & Action</th>
                <th className="py-4 px-6">Activity Details</th>
                <th className="py-4 px-6">IP Address</th>
                <th className="py-4 px-6 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderLight text-sm text-gray-700">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-bold text-primary block">{log.userName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                          log.userRole === "Admin"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : log.userRole === "Moderator"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {log.userRole}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="text-xs font-semibold px-2 py-0.5 bg-surface rounded-md border border-borderLight text-gray-600 block w-fit mb-1">
                        {log.module}
                      </span>
                      <span className="text-xs font-bold text-cardHeader block">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <p className="text-xs text-gray-600 max-w-md leading-relaxed">
                        {log.details}
                      </p>
                    </td>

                    <td className="py-4 px-6 font-mono text-xs text-gray-500">
                      {log.ipAddress}
                    </td>

                    <td className="py-4 px-6 text-right text-xs text-gray-400 font-mono">
                      <span className="flex items-center justify-end gap-1">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        {log.timestamp}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 text-sm">
                    No activity logs found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;