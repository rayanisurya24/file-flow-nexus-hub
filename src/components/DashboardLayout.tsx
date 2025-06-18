import { useUser, OrganizationSwitcher } from "@clerk/clerk-react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarInset } from "@/components/ui/sidebar";
import { NavLink, useLocation } from "react-router-dom";
import { Upload, FileText, Home } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, isLoaded } = useUser();
  const location = useLocation();

  const sidebarItems = [
    { title: "Overview", url: "/dashboard", icon: Home },
    { title: "Upload Files", url: "/dashboard/upload", icon: Upload },
    { title: "My Files", url: "/dashboard/my-files", icon: FileText },
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Please sign in to access the dashboard.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <Sidebar className="border-r border-gray-200">
            <SidebarHeader className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CV</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">CloudVault</span>
              </div>
              <div className="mt-4">
                <OrganizationSwitcher 
                  appearance={{
                    elements: {
                      organizationSwitcherTrigger: "p-2 rounded-lg border border-gray-200 w-full justify-start",
                      organizationPreview: "text-sm"
                    }
                  }}
                />
              </div>
            </SidebarHeader>
            
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel className="text-gray-600 text-xs uppercase tracking-wider px-6 py-3">
                  Navigation
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {sidebarItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <NavLink 
                            to={item.url} 
                            end={item.url === "/dashboard"}
                            className={({ isActive }) => 
                              `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                                isActive 
                                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600" 
                                  : "text-gray-700 hover:bg-gray-50"
                              }`
                            }
                          >
                            <item.icon className="w-5 h-5" />
                            {item.title}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          <SidebarInset className="flex-1">
            <main className="p-8 bg-gray-50 min-h-screen">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
