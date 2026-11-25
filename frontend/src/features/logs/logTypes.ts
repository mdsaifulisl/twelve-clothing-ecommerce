export interface IActivityLog {
  id: string;
  userName: string;
  userRole: "Admin" | "Moderator" | "Editor" | "Support";
  action: string;
  module: "Orders" | "Products" | "Customers" | "Sliders" | "Team";
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface LogState {
  logs: IActivityLog[];
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export interface CreateLogPayload {
  userName: string;
  userRole: "Admin" | "Moderator" | "Editor" | "Support";
  action: string;
  module: "Orders" | "Products" | "Customers" | "Sliders" | "Team";
  details: string;
  ipAddress: string;
}