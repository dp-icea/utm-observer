import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold">Cesium Flight Planner</h1>
      </header>

      <div className="flex flex-1 relative">
        <aside className="bg-gray-200 w-64 p-4 shadow-md">
          <nav>
            <h2 className="text-lg font-semibold mb-4">Tools</h2>
            <ul className="space-y-2">
              <li>
                <button className="w-full text-left p-2 hover:bg-gray-300 rounded">
                  Cylinder Tool
                </button>
              </li>
              <li>
                <button className="w-full text-left p-2 hover:bg-gray-300 rounded">
                  Volume Manager
                </button>
              </li>
              <li>
                <button className="w-full text-left p-2 hover:bg-gray-300 rounded">
                  Settings
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="flex-1 relative">{children}</main>
      </div>

      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2024 Cesium Flight Planner. Built with React & Cesium.</p>
      </footer>
    </div>
  );
};

export default Layout;
