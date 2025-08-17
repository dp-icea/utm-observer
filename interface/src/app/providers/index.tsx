import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { MapProvider } from "../../contexts/MapContext";
import { Toaster } from "../../shared/ui/toaster";

const queryClient = new QueryClient();

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => (
  <QueryClientProvider client={queryClient}>
    <MapProvider>
      <Toaster />
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </MapProvider>
  </QueryClientProvider>
);