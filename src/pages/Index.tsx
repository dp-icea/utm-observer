import React from "react";
import { MonitoringHeader } from "@/components/MonitoringHeader";
import { MonitoringSidebar } from "@/components/MonitoringSidebar";
import { CesiumMap } from "@/components/CesiumMap";
import { TimelineBar } from "@/components/TimelineBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

const IndexContent = () => {
  const { isDarkMode } = useTheme();

  return (
    <SidebarProvider>
      <div
        className={`min-h-screen flex w-full ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <MonitoringSidebar />

        <div className="flex flex-col flex-1 min-w-0">
          <MonitoringHeader />

          <main className="flex-1 flex flex-col relative">
            <div className="flex-1 relative">
              <CesiumMap isDarkMode={isDarkMode} />
            </div>
            <TimelineBar />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const Index = () => {
  return (
    <ThemeProvider>
      <IndexContent />
    </ThemeProvider>
  );
};

export default Index;
