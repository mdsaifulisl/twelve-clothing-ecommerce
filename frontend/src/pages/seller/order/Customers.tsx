import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, ShoppingBag, Phone, MapPin, User, ShieldAlert, ShieldCheck, Globe, Lock, Fingerprint, Smartphone } from "lucide-react";
import { useAppDispatch } from "../../../app/hooks";
import { openModal } from "../../../features/alert/modalSlice";
import { showAlertModal } from "../../../features/alert/alertSlice";
import { useCustomer } from "../../../features/customer/useCustomer";
import type { CustomerDeviceRecord, CustomerRecord } from "../../../features/customer/customerType";

export interface CustomerAggregate {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  ipAddress: string;
  isBlocked: boolean;
  isIpBlocked: boolean;
  devices: CustomerDeviceRecord[];
}

export const Customers: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { customers: customerRecords, blockedIps: blockedIPs, isLoading: loading, error, mutationId: busyId, fetchCustomers, blockById, unblockById, setDeviceBlocked, blockIp, unblockIp } = useCustomer();
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') ?? '');
  const [selectedCity, setSelectedCity] = useState("All");
  const [ipStatusFilter, setIpStatusFilter] = useState("All");
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [newIpAddress, setNewIpAddress] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerAggregate | null>(null);

  useEffect(() => {
    const linkedSearch = searchParams.get('search');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (linkedSearch) setSearchTerm(linkedSearch);
  }, [searchParams]);

  useEffect(() => {
    const request = fetchCustomers(searchTerm.trim() || undefined);
    return () => request.abort();
  }, [fetchCustomers, searchTerm]);

  const customers: CustomerAggregate[] = useMemo(() => customerRecords.map((customer: CustomerRecord) => ({
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    address: customer.address ?? "—",
    city: customer.city ?? "—",
    totalOrders: customer.totalOrders,
    totalSpent: Number(customer.totalOrderValue),
    lastOrderDate: customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : "—",
    ipAddress: customer.ipAddress ?? "—",
    isBlocked: customer.isBlocked,
    isIpBlocked: customer.isIpBlocked,
    devices: customer.devices ?? [],
  })), [customerRecords]);

  // সিটির ইউনিক লিস্ট
  const cities = useMemo(() => {
    const set = new Set(customers.map((c) => c.city));
    return ["All", ...Array.from(set)];
  }, [customers]);

  const toggleBlockIP = async (ip: string) => {
    if (!ip || ip === "—") return;
    const matchingRecord = blockedIPs.find((item) => item.address === ip && item.isBlocked);
    const shouldBlock = !matchingRecord;
    dispatch(openModal({
      title: shouldBlock ? "Block IP address" : "Unblock IP address",
      message: shouldBlock ? `Block ${ip}? Future checkout attempts from this IP will be rejected.` : `Unblock ${ip}? Its history will be retained.`,
      onConfirm: async () => {
        try {
          if (shouldBlock) await blockIp(ip);
          else await unblockIp(matchingRecord!.id);
          dispatch(showAlertModal({ message: shouldBlock ? "IP address blocked." : "IP address unblocked.", type: "success", isToast: true }));
        } catch (cause) {
          dispatch(showAlertModal({ message: String(cause), type: "error", isToast: true }));
        }
      },
    }));
  };

  const toggleBlockCustomer = async (customer: Pick<CustomerAggregate, 'id' | 'name' | 'isBlocked'>) => {
    const shouldBlock = !customer.isBlocked;
    dispatch(openModal({
      title: shouldBlock ? "Block customer" : "Unblock customer",
      message: shouldBlock ? `Block ${customer.name}? Their future checkout attempts will be rejected.` : `Unblock ${customer.name}?`,
      onConfirm: async () => {
        try {
          if (shouldBlock) await blockById(customer.id);
          else await unblockById(customer.id);
          dispatch(showAlertModal({ message: shouldBlock ? "Customer blocked." : "Customer unblocked.", type: "success", isToast: true }));
        } catch (cause) {
          dispatch(showAlertModal({ message: String(cause), type: "error", isToast: true }));
        }
      },
    }));
  };

  const toggleBlockDevice = (device: CustomerDeviceRecord) => {
    const shouldBlock = !device.isBlocked;
    dispatch(openModal({
      title: shouldBlock ? "Block device" : "Unblock device",
      message: shouldBlock ? `Block browser/device ${device.label}? Future orders from this browser identifier will be rejected.` : `Unblock browser/device ${device.label}?`,
      onConfirm: async () => {
        try {
          await setDeviceBlocked(device.id, shouldBlock);
          dispatch(showAlertModal({ message: shouldBlock ? "Device blocked." : "Device unblocked.", type: "success", isToast: true }));
        } catch (cause) {
          dispatch(showAlertModal({ message: String(cause), type: "error", isToast: true }));
        }
      },
    }));
  };

  const blockSuggestedPhone = (entry: { phone: string; customerId: string | null; isBlocked: boolean }) => {
    if (!entry.customerId) {
      dispatch(showAlertModal({ message: `No customer record is associated with ${entry.phone}.`, type: 'error', isToast: true }));
      return;
    }
    setSelectedCustomer(null);
    void toggleBlockCustomer({ id: entry.customerId, name: entry.phone, isBlocked: entry.isBlocked });
  };

  const handleCreateBlockedIp = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newIpAddress.trim()) return;
    const address = newIpAddress.trim();
    dispatch(openModal({
      title: "Block IP address",
      message: `Block ${address}? Future checkout attempts from this IP will be rejected.`,
      onConfirm: async () => {
        try {
          await blockIp(address);
          setNewIpAddress("");
          dispatch(showAlertModal({ message: "IP address blocked.", type: "success", isToast: true }));
        } catch (cause) {
          dispatch(showAlertModal({ message: String(cause), type: "error", isToast: true }));
        }
      },
    }));
  };

  // সার্চ ও ফিল্টারিং লজিক (IP Address সহ)
  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      const matchesSearch =
        cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cust.phone.includes(searchTerm) ||
        cust.ipAddress.includes(searchTerm) ||
        cust.devices.some((device) => device.ips.some((ip) => ip.includes(searchTerm)) || device.phones.some((phone) => phone.includes(searchTerm)) || searchTerm.toUpperCase().startsWith(device.label)) ||
        cust.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCity =
        selectedCity === "All" || cust.city.toLowerCase() === selectedCity.toLowerCase();

      const matchesIpStatus =
        ipStatusFilter === "All" ||
        (ipStatusFilter === "Blocked" && (cust.isIpBlocked || cust.devices.some((device) => device.ips.some((ip) => blockedIPs.some((record) => record.address === ip && record.isBlocked))))) ||
        (ipStatusFilter === "Active" && !cust.isIpBlocked && !cust.devices.some((device) => device.ips.some((ip) => blockedIPs.some((record) => record.address === ip && record.isBlocked))));

      return matchesSearch && matchesCity && matchesIpStatus;
    });
  }, [customers, blockedIPs, searchTerm, selectedCity, ipStatusFilter]);

  const activeBlockedIpCount = blockedIPs.filter((item) => item.isBlocked).length;

  return (
    <div className="space-y-6 font-sans pb-10">
      {/* পেজ হেডার */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">
            Customers & IP Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Review customer activity and block customers, IP addresses, or browser identifiers. Browser matching is not a guaranteed hardware fingerprint.
          </p>
        </div>
        <button
          onClick={() => setShowBlockedModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 text-xs font-bold rounded-xl hover:bg-red-100 transition-colors cursor-pointer w-full sm:w-auto"
        >
          <Lock className="w-4 h-4" />
          <span>Blocked IPs List ({activeBlockedIpCount})</span>
        </button>
      </div>

      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {/* সার্চ এবং ফিল্টার বার */}
      <div className="bg-white p-4 rounded-2xl border border-borderLight shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* সার্চ ইনপুট (IP সার্চ সমর্থিত) */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Name, Phone, IP Address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface border border-borderLight rounded-xl text-sm outline-none text-primary focus:border-cardHeader transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* IP স্ট্যাটাস ফিল্টার */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />
            <select
              value={ipStatusFilter}
              onChange={(e) => setIpStatusFilter(e.target.value)}
              className="w-full sm:w-36 bg-surface border border-borderLight text-sm text-gray-700 py-2 px-3 rounded-xl outline-none focus:border-cardHeader transition-colors cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Buyers</option>
              <option value="Blocked">Blocked IPs</option>
            </select>
          </div>

          {/* সিটি ফিল্টার */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full sm:w-36 bg-surface border border-borderLight text-sm text-gray-700 py-2 px-3 rounded-xl outline-none focus:border-cardHeader transition-colors cursor-pointer capitalize"
          >
            {cities.map((city, idx) => (
              <option key={idx} value={city}>
                {city === "All" ? "All Cities" : city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* MOBILE VIEW: কার্ড লেআউট */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {loading ? <div className="bg-white p-8 text-center rounded-2xl border border-borderLight text-gray-400 text-sm">Loading customers…</div> : filteredCustomers.length > 0 ? (
          filteredCustomers.map((cust) => (
            <div
              key={cust.id}
              className={`bg-white p-4 rounded-2xl border shadow-xs space-y-3 ${
                cust.isBlocked ? "border-red-300 bg-red-50/20" : "border-borderLight"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-surface text-gray-500 rounded-md border border-borderLight">
                  {cust.id}
                </span>
                {cust.isBlocked ? (
                  <span className="text-[11px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> Blocked
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Active
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <h4 className="font-semibold text-primary text-sm flex items-center gap-1.5">
                  <User className="w-4 h-4 text-cardHeader" /> {cust.name}
                </h4>
                <p className="text-xs text-gray-500 flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-gray-400" /> {[...new Set([cust.phone, ...cust.devices.flatMap((device) => device.phones)])].join(', ')}</p>
                <div className="space-y-2 rounded-xl border border-borderLight bg-surface p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Devices / IP Addresses</p>
                  {cust.devices.length ? cust.devices.map((device) => <div key={device.id} className="space-y-1 border-t border-borderLight pt-2 first:border-0 first:pt-0">
                    <span className="flex items-center gap-1 font-mono text-[10px] text-primary"><Fingerprint className="h-3 w-3 text-cardHeader" />{device.label}</span>
                    {device.ips.map((ip) => <span key={ip} className="block break-all font-mono text-[10px] text-gray-600"><Globe className="mr-1 inline h-3 w-3" />{ip}</span>)}
                  </div>) : <p className="text-[10px] text-gray-400">No device identifier recorded yet.</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-borderLight text-xs">
                <div>
                  <span className="text-gray-400 block">Total Orders:</span>
                  <span className="font-bold text-primary flex items-center gap-1 mt-0.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-cardHeader" />
                    {cust.totalOrders} Orders
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Total Spent:</span>
                  <span className="font-bold text-primary text-sm mt-0.5 block">
                    ৳{cust.totalSpent.toLocaleString("en-BD")}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-borderLight">
                <span className="text-xs text-gray-500 uppercase font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" /> {cust.city}
                </span>
                <div className="flex flex-col items-end gap-2">
                <button
                  disabled={busyId === cust.id}
                  onClick={() => setSelectedCustomer(cust)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${cust.isBlocked ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-amber-100 text-amber-800 hover:bg-amber-200"}`}
                >
                  Manage blocks
                </button>
                {cust.isBlocked && <span className="text-[10px] font-semibold text-red-600">Customer blocked</span>}
                </div>
              </div>
              {cust.devices.some((device) => device.isBlocked || device.ips.some((ip) => blockedIPs.some((record) => record.address === ip && record.isBlocked))) && <div className="space-y-1 border-t border-borderLight pt-2">
                {cust.devices.filter((device) => device.isBlocked || device.ips.some((ip) => blockedIPs.some((record) => record.address === ip && record.isBlocked))).map((device) => <div key={device.id} className="space-y-1 rounded-lg bg-red-50 p-2 text-[10px] text-red-600">
                  {device.isBlocked && <span className="block">Device blocked · {device.label}</span>}
                  {device.ips.filter((ip) => blockedIPs.some((record) => record.address === ip && record.isBlocked)).map((ip) => <span key={ip} className="block">IP blocked · {ip}</span>)}
                </div>)}
              </div>}
            </div>
          ))
        ) : (
          <div className="bg-white p-8 text-center rounded-2xl border border-borderLight text-gray-400 text-sm">
            No customers or IP logs found matching your filter.
          </div>
        )}
      </div>

      {/* DESKTOP VIEW: টেবিল লেআউট */}
      <div className="hidden md:block bg-white rounded-2xl border border-borderLight shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface text-gray-500 text-xs uppercase tracking-wider border-b border-borderLight">
                <th className="py-4 px-6">Customer & ID</th>
                <th className="py-4 px-6">Phone Numbers</th>
                <th className="py-4 px-6">Devices / IP Addresses</th>
                <th className="py-4 px-6">Location</th>
                <th className="py-4 px-6">Orders Count</th>
                <th className="py-4 px-6">Total Spent</th>
                <th className="py-4 px-6 text-right">Customer Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderLight text-sm text-gray-700">
          {loading ? (
            <tr><td colSpan={7} className="py-12 text-center text-gray-400 text-sm">Loading customers…</td></tr>
          ) : filteredCustomers.length > 0 ? (
                filteredCustomers.map((cust) => (
                  <tr
                    key={cust.id}
                    className={`hover:bg-surface/50 transition-colors ${
                      cust.isBlocked ? "bg-red-50/30" : ""
                    }`}
                  >
                    <td className="py-4 px-6">
                      <span className="font-semibold text-primary block">{cust.name}</span>
                      <span className="text-xs font-mono text-gray-400">{cust.id}</span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="text-xs text-gray-700 block font-semibold">{cust.phone}</span>
                      {[...new Set(cust.devices.flatMap((device) => device.phones).filter((phone) => phone !== cust.phone))].map((phone) => <span key={phone} className="mt-1 block text-xs text-gray-500">{phone}</span>)}
                    </td>

                    <td className="max-w-[380px] space-y-2 py-4 px-6">
                      {cust.devices.length ? cust.devices.map((device) => <div key={device.id} className="space-y-1 rounded-lg border border-borderLight bg-surface p-2">
                        <span className="flex items-center gap-1.5 break-all font-mono text-[10px] font-semibold text-primary"><Smartphone className="h-3.5 w-3.5 shrink-0 text-cardHeader" />{device.label}</span>
                        {device.ips.length ? device.ips.map((ip) => <span key={ip} className="block break-all font-mono text-[10px] text-gray-600"><Globe className="mr-1 inline h-3 w-3" />{ip}</span>) : <span className="text-[10px] text-gray-400">No IP recorded</span>}
                      </div>) : <span className="text-xs text-gray-400">No device identifier recorded</span>}
                    </td>

                    <td className="py-4 px-6">
                      <span className="text-xs font-semibold text-primary uppercase block">{cust.city}</span>
                      <span className="text-xs text-gray-400 truncate max-w-[180px] block">{cust.address}</span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface border border-borderLight text-xs font-semibold rounded-lg text-primary">
                        <ShoppingBag className="w-3.5 h-3.5 text-cardHeader" />
                        {cust.totalOrders} Orders
                      </span>
                    </td>

                    <td className="py-4 px-6 font-bold text-primary">
                      ৳ {cust.totalSpent.toLocaleString("en-BD")}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        disabled={busyId === cust.id}
                        onClick={() => setSelectedCustomer(cust)}
                        className={`mr-2 px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer border shadow-2xs ${
                          cust.isBlocked
                            ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                            : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                        }`}
                      >
                        Manage blocks
                      </button>
                      <div className="mt-2 space-y-2">
                        {cust.isBlocked && <p className="text-[10px] font-semibold text-red-600">Customer blocked · {cust.phone}</p>}
                        {cust.devices.map((device) => <div key={device.id} className="space-y-1">
                          {device.isBlocked && <p className="text-[10px] font-semibold text-red-600">Device blocked · {device.label}</p>}
                          {device.ips.map((ip) => {
                            const ipBlocked = blockedIPs.some((record) => record.address === ip && record.isBlocked);
                            return <div key={ip} className="flex flex-col items-end">
                              {ipBlocked && <span className="text-[10px] font-semibold text-red-600">IP blocked · {ip}</span>}
                            </div>;
                          })}
                        </div>)}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400 text-sm">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCustomer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedCustomer(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="customer-block-title" className="max-h-[85vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-2xl border border-borderLight bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-borderLight pb-3">
              <div><h2 id="customer-block-title" className="font-heading text-lg font-bold text-primary">Manage customer blocks</h2><p className="mt-1 text-xs text-gray-500">{selectedCustomer.name} · {selectedCustomer.phone}</p></div>
              <button type="button" onClick={() => setSelectedCustomer(null)} className="rounded-lg px-2 py-1 text-gray-500 hover:bg-surface" aria-label="Close">×</button>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-borderLight px-3 py-2.5"><span className="text-xs text-primary">Customer · {selectedCustomer.phone}</span><button type="button" disabled={busyId === selectedCustomer.id} onClick={() => { setSelectedCustomer(null); void toggleBlockCustomer(selectedCustomer); }} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${selectedCustomer.isBlocked ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{selectedCustomer.isBlocked ? 'Unblock customer' : 'Block customer'}</button></div>
            {selectedCustomer.devices.map((device) => <div key={device.id} className="space-y-2 border-t border-borderLight pt-3">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-borderLight px-3 py-2.5"><span className="break-all font-mono text-xs text-primary">Device · {device.label}</span><button type="button" disabled={busyId === device.id} onClick={() => { setSelectedCustomer(null); toggleBlockDevice(device); }} className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold ${device.isBlocked ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{device.isBlocked ? 'Unblock device' : 'Block device'}</button></div>
              {device.ips.map((ip) => {
                const blocked = blockedIPs.some((record) => record.address === ip && record.isBlocked);
                return <div key={ip} className="flex items-center justify-between gap-3 rounded-xl border border-borderLight px-3 py-2.5"><span className="break-all font-mono text-xs text-primary">IP · {ip}</span><button type="button" onClick={() => { setSelectedCustomer(null); void toggleBlockIP(ip); }} className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold ${blocked ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{blocked ? 'Unblock IP' : 'Block IP'}</button></div>;
              })}
              {device.phoneCustomers?.filter((entry) => entry.phone !== selectedCustomer.phone).map((entry) => <div key={entry.phone} className="flex items-center justify-between gap-3 rounded-xl border border-borderLight px-3 py-2.5"><span className="text-xs text-primary">Phone · {entry.phone}</span><button type="button" disabled={!entry.customerId} onClick={() => blockSuggestedPhone(entry)} className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-40 ${entry.isBlocked ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-800'}`}>{entry.isBlocked ? 'Unblock customer' : 'Block customer'}</button></div>)}
            </div>)}
            {!selectedCustomer.devices.length && <p className="rounded-xl bg-surface p-3 text-xs text-gray-400">No device or IP activity is recorded for this customer.</p>}
          </section>
        </div>
      )}

      {/* ৪. ব্লক করা IP সমূহের মোডাল (Blacklist Manager) */}
      {showBlockedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 border border-borderLight shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-borderLight pb-3">
              <h3 className="font-heading text-lg font-bold text-primary flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-600" /> Blocked IP Blacklist
              </h3>
              <button
                onClick={() => setShowBlockedModal(false)}
                className="text-gray-400 hover:text-primary text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Blocked IP addresses are rejected by the backend during checkout. Unblocking changes the status and keeps the history.
            </p>

            <form onSubmit={handleCreateBlockedIp} className="space-y-2 rounded-xl border border-borderLight bg-surface p-3">
              <input required value={newIpAddress} onChange={(event) => setNewIpAddress(event.target.value)} placeholder="IPv4 or IPv6 address" className="w-full rounded-lg border border-borderLight bg-white px-3 py-2 text-xs font-mono outline-none focus:border-cardHeader" />
              <button disabled={busyId === newIpAddress.trim()} className="w-full rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">Block IP</button>
            </form>

            <div className="max-h-60 overflow-y-auto divide-y divide-borderLight border border-borderLight rounded-xl">
              {blockedIPs.length > 0 ? (
                blockedIPs.map((ip) => (
                  <div key={ip.id} className="p-3 flex items-center justify-between gap-3 text-xs bg-surface">
                    <div><span className="block font-mono font-bold text-gray-700">{ip.address}</span>{ip.reason && <span className="mt-0.5 block text-gray-500">{ip.reason}</span>}</div>
                    {ip.isBlocked ? <button
                      disabled={busyId === ip.address}
                      onClick={() => { void toggleBlockIP(ip.address); }}
                      className="text-red-600 hover:underline font-semibold cursor-pointer disabled:opacity-50"
                    >Unblock</button> : <span className="whitespace-nowrap text-gray-400">Unblocked</span>}
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-gray-400">
                  No IP addresses currently blacklisted.
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowBlockedModal(false)}
                className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;

