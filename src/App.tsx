import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { BookProvider } from "@/contexts/BookContext";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentBooks from "./pages/student/StudentBooks";
import StudentBookDetails from "./pages/student/StudentBookDetails";
import StudentBorrowed from "./pages/student/StudentBorrowed";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBooks from "./pages/admin/AdminBooks";
import AdminBookDetails from "./pages/admin/AdminBookDetails";
import AdminBorrowed from "./pages/admin/AdminBorrowed";
import AdminSearch from "./pages/admin/AdminSearch";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <BookProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              
              {/* Student Routes */}
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/books" element={<StudentBooks />} />
              <Route path="/student/books/:bookId" element={<StudentBookDetails />} />
              <Route path="/student/borrowed" element={<StudentBorrowed />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/books" element={<AdminBooks />} />
              <Route path="/admin/books/:bookId" element={<AdminBookDetails />} />
              <Route path="/admin/borrowed" element={<AdminBorrowed />} />
              <Route path="/admin/search" element={<AdminSearch />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BookProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
