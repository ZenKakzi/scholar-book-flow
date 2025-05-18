import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useBooks } from "@/contexts/BookContext";
import SearchBox from "@/components/SearchBox";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FloatingBooks from "@/components/FloatingBooks";

const StudentBorrowed: React.FC = () => {
  const { user } = useAuth();
  const { borrowedBooks, returnBook } = useBooks();
  const [searchQuery, setSearchQuery] = useState("");
  const [returningBookId, setReturningBookId] = useState<string | null>(null);
  
  // Filter borrowed books for the current student
  const myBorrowedBooks = borrowedBooks
    .filter(
      (borrowed) => 
        borrowed.studentEmail === user?.email && 
        borrowed.status === "active" &&
        borrowed.bookTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
  const handleReturnBook = (borrowedBookId: string) => {
    setReturningBookId(borrowedBookId);
  };
  
  const confirmReturn = () => {
    if (returningBookId) {
      returnBook(returningBookId);
      setReturningBookId(null);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-library-background">
      <FloatingBooks />
      <Sidebar userType="student" />
      
      <div className="flex-1 flex flex-col ml-64">
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">Borrowed Books</h1>
                <p className="text-gray-400">your currently borrowed books</p>
              </div>
              {/* No Add Borrowing button for student */}
            </header>
            
            <div className="mb-6">
              <SearchBox onSearch={setSearchQuery} placeholder="Search by book title..." />
            </div>
            
            {myBorrowedBooks.length > 0 ? (
              <div className="bg-library-panel rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Book Title</TableHead>
                      <TableHead className="text-gray-300">Borrowed Date</TableHead>
                      <TableHead className="text-gray-300">Due Date</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myBorrowedBooks.map((borrowed) => (
                      <TableRow key={borrowed.id} className="border-gray-700">
                        <TableCell className="font-medium text-white">
                          {borrowed.bookTitle}
                        </TableCell>
                        <TableCell className="text-gray-300">{borrowed.borrowedDate}</TableCell>
                        <TableCell className="text-gray-300">{borrowed.dueDate}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReturnBook(borrowed.id)}
                            className="text-library-accent border-library-accent hover:bg-library-accent hover:text-white"
                          >
                            Return
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="bg-library-panel p-6 rounded-xl text-center">
                <p className="text-gray-400">You haven't borrowed any books yet.</p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
      
      <Dialog 
        open={returningBookId !== null}
        onOpenChange={(open) => !open && setReturningBookId(null)}
      >
        <DialogContent className="bg-library-panel text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Return Book</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to return this book?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReturningBookId(null)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-library-accent hover:bg-orange-600"
              onClick={confirmReturn}
            >
              Confirm Return
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentBorrowed;
