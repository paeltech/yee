
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Councils from "./pages/Councils";
import Wards from "./pages/Wards";
import Groups from "./pages/Groups";
import Members from "./pages/Members";
import MemberDetail from "./pages/MemberDetail";
import GroupDetail from "./pages/GroupDetail";
import Activities from "./pages/Activities";
import Analytics from "./pages/Analytics";
import Locations from "./pages/Locations";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/councils" element={<Councils />} />
          <Route path="/wards" element={<Wards />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/:id" element={<GroupDetail />} />
          <Route path="/members" element={<Members />} />
          <Route path="/members/:id" element={<MemberDetail />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
