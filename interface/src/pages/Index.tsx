import "@/App.css";

import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { TimelineBar } from "@/components/TimelineBar";
import { Login } from "@/components/Login";
import { useAuth } from "@/hooks/useAuth";

import Map from "@/components/Map";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex w-full bg-gray-900">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 flex flex-col relative">
          <div className="flex-1 relative">
            <Map />
          </div>
          <TimelineBar />
        </main>
      </div>
    </div>
  );
}

const Index = () => {
  const { isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={login} />;
  }

  return <Dashboard />;
};

export default Index;
