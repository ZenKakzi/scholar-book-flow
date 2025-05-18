import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book as BookIcon, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useBooks } from "@/contexts/BookContext";
import BookCard from "@/components/BookCard";
import SearchBox from "@/components/SearchBox";
import FloatingBooks from "@/components/FloatingBooks";
import Footer from "@/components/Footer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { books, borrowedBooks } = useBooks();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Effect to log borrowedBooks state changes - for debugging
  useEffect(() => {
    console.log("Borrowed Books state updated in Dashboard:", borrowedBooks);
  }, [borrowedBooks]);

  const myBorrowedBooks = borrowedBooks.filter(
    (borrowed) => borrowed.studentEmail === user?.email && borrowed.status === "active"
  );
  
  const availableBooks = books.filter(
    (book) => book.available && book.title.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 6);
  
  // Effect to log books state changes - for debugging
  useEffect(() => {
    console.log("Books state updated in Dashboard:", books.length, "total books");
    const availableCount = books.filter(book => book.available).length;
    console.log("Available books count:", availableCount);
  }, [books]); 

  return (
    <div className="flex min-h-screen bg-library-background">
      <FloatingBooks />
      <Sidebar userType="student" />
      
      <div className="flex-1 ml-64">
        <main className="flex-1 p-6">
          <div className="">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-white">
                Welcome, {user?.name || "Student"}
              </h1>
              <p className="text-gray-400">
                Find and borrow books from our extensive library
              </p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-library-panel border-gray-700 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-medium">Total Books</CardTitle>
                  <BookIcon className="h-5 w-5 text-library-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{books.length}</div>
                  <p className="text-sm text-gray-400 mt-1">
                    Books available in the library
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-library-panel border-gray-700 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-medium">Books Borrowed</CardTitle>
                  <Clock className="h-5 w-5 text-library-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{myBorrowedBooks.length}</div>
                  <p className="text-sm text-gray-400 mt-1">
                    Books you currently have borrowed
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="mb-8" key={myBorrowedBooks.length}>
              <h2 className="text-2xl font-bold text-white mb-4">Available Books</h2>
              <div className="mb-4">
                <SearchBox 
                  onSearch={setSearchQuery} 
                  placeholder="Search for books..."
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {availableBooks.map((book) => (
                  <BookCard key={book.id} book={book} isStudent={true} />
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">My Borrowed Books</h2>
              {myBorrowedBooks.length > 0 ? (
                <div className="bg-library-panel rounded-xl overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-700">
                          <TableHead className="text-gray-300">Book Title</TableHead>
                          <TableHead className="text-gray-300">Borrowed Date</TableHead>
                          <TableHead className="text-gray-300">Due Date</TableHead>
                          <TableHead className="text-gray-300">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                      {myBorrowedBooks.map((borrowed) => (
                          <TableRow key={borrowed.id} className="border-gray-700">
                            <TableCell className="font-medium text-white">{borrowed.bookTitle}</TableCell>
                            <TableCell className="text-gray-300">{borrowed.borrowedDate}</TableCell>
                            <TableCell className="text-gray-300">{borrowed.dueDate}</TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  borrowed.status === "active"
                                    ? "bg-green-800 text-green-200"
                                    : "bg-blue-800 text-blue-200"
                                }`}
                              >
                                {borrowed.status === "active" ? "Active" : "Returned"}
                              </span>
                            </TableCell>
                          </TableRow>
                      ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="bg-library-panel p-6 rounded-xl text-center">
                  <p className="text-gray-400">You haven't borrowed any books yet.</p>
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default StudentDashboard;
