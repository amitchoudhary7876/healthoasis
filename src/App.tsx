import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ScrollToTop from "@/components/common/ScrollToTop";

import Index from "./pages/Index";
import BookAppointment from "./pages/BookAppointment";
import EmergencyCare from "./pages/services/EmergencyCare";
import LabTests from "./pages/services/LabTests";
import MedicalCheckups from "./pages/services/MedicalCheckups";
import Vaccinations from "./pages/services/Vaccinations";
import Contact from "./pages/Contact";
import Departments from "./pages/Departments";
import DepartmentDetail from "./pages/DepartmentDetail";
import Doctors from "./pages/Doctors";
import VideoCall from './pages/VideoCall';
import DoctorCall from './pages/DoctorCall';
import NotFound from "./pages/NotFound";
import WalletPage from "./pages/WalletPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop /> {/* 👈 Add this just after BrowserRouter */}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/services/emergency-care" element={<EmergencyCare />} />
          <Route path="/services/lab-tests" element={<LabTests />} />
          <Route path="/services/medical-checkups" element={<MedicalCheckups />} />
          <Route path="/services/vaccinations" element={<Vaccinations />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/departments/:departmentId" element={<DepartmentDetail />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/video-call/:roomId" element={<VideoCall />} />
          <Route path="/doctor-call/:doctorId" element={<DoctorCall />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
