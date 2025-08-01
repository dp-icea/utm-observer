import "@/App.css";

import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { TimelineBar } from "@/components/TimelineBar";

import Map from "@/components/Map";

const Index = () => {
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
};

export default Index;
