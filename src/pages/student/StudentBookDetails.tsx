import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useBooks } from "@/contexts/BookContext";
import BookDetailsCard from "@/components/BookDetailsCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FloatingBooks from "@/components/FloatingBooks";

const StudentBookDetails: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const { user } = useAuth();
  const { books, borrowBook } = useBooks();
  const navigate = useNavigate();
  const [showBorrowDialog, setShowBorrowDialog] = useState(false);
  
  const book = books.find((b) => b.id === bookId);
  
  if (!book) {
    return (
      <div className="flex min-h-screen bg-library-background">
        <Sidebar userType="student" />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Book Not Found</h1>
            <Button onClick={() => navigate("/student/books")}>
              Go Back to Books
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  const handleBorrowRequest = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowBorrowDialog(true);
  };
  
  const confirmBorrow = () => {
    if (user && book) {
      borrowBook(book.id, user.email, user.name);
      setShowBorrowDialog(false);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-library-background">
      <FloatingBooks />
      <Sidebar userType="student" />
      
      <div className="flex-1 flex flex-col ml-64">
        <main className="flex-1 p-6">
          <div className="">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="mb-6"
            >
              ← Back
            </Button>
            
            <BookDetailsCard 
              book={book} 
              isStudent={true} 
              onBorrow={handleBorrowRequest}
            />
          </div>
        </main>
        <Footer />
      </div>
      
      <Dialog open={showBorrowDialog} onOpenChange={setShowBorrowDialog}>
        <DialogContent className="bg-library-panel text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Borrow Book</DialogTitle>
            <DialogDescription className="text-gray-400">
              Would you like to borrow "{book.title}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBorrowDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-library-accent hover:bg-orange-600"
              onClick={confirmBorrow}
            >
              Confirm Borrowing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentBookDetails;
