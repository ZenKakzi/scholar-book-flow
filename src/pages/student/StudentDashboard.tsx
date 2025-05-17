
import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book as BookIcon, Clock } from "lucide-react";
import { books, borrowedBooks } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import BookCard from "@/components/BookCard";
import SearchBox from "@/components/SearchBox";
import FloatingBooks from "@/components/FloatingBooks";
import Footer from "@/components/Footer";

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
  const myBorrowedBooks = borrowedBooks.filter(
    (borrowed) => borrowed.studentEmail === user?.email && borrowed.status === "active"
  );
  
  const availableBooks = books.filter(
    (book) => book.available && book.title.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 6);
  
  return (
    <div className="flex min-h-screen bg-library-background">
      <FloatingBooks />
      <Sidebar userType="student" />
      
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
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
            
            <div className="mb-8">
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
                <div className="overflow-x-auto">
                  <table className="w-full bg-library-panel rounded-xl overflow-hidden">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-4 text-gray-400">Book Title</th>
                        <th className="text-left p-4 text-gray-400">Borrowed Date</th>
                        <th className="text-left p-4 text-gray-400">Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myBorrowedBooks.map((borrowed) => (
                        <tr key={borrowed.id} className="border-b border-gray-700">
                          <td className="p-4 text-white">{borrowed.bookTitle}</td>
                          <td className="p-4 text-gray-300">{borrowed.borrowedDate}</td>
                          <td className="p-4 text-gray-300">{borrowed.dueDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
