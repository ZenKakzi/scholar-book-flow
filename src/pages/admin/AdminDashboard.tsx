import React from "react";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book as BookIcon, Users, Clock } from "lucide-react";
// import { books, borrowedBooks, users } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";
import FloatingBooks from "@/components/FloatingBooks";
import { useBooks } from "@/contexts/BookContext";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { books, borrowedBooks } = useBooks();
  const adminName = user?.name || "Administrator";
  
  // Assuming users data might still be needed for total student count if not in context
  // const studentsCount = users.filter(u => u.role === "student").length;
  
  const availableBooks = books.filter(b => b.available).length;
  const borrowedBooksCount = borrowedBooks.filter(b => b.status === "active").length;

  // Calculate borrowed books specifically for student1 and student2
  const student1BorrowedCount = borrowedBooks.filter(
    (b) => b.studentEmail === "student1@example.com" && b.status === "active"
  ).length;
  const student2BorrowedCount = borrowedBooks.filter(
    (b) => b.studentEmail === "student2@example.com" && b.status === "active"
  ).length;
  
  // Get the most recent borrowed books
  const recentBorrowings = [...borrowedBooks]
    .sort((a, b) => {
      // Assuming borrowedDate is in DD/MM/YYYY format
      const [dayA, monthA, yearA] = a.borrowedDate.split('/');
      const [dayB, monthB, yearB] = b.borrowedDate.split('/');
      const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
      const dateB = new Date(`${yearB}-${monthB}-${dayB}`);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);
  
  return (
    <div className="flex min-h-screen bg-library-background">
      <FloatingBooks />
      <Sidebar userType="admin" />
      
      <div className="flex-1 flex flex-col ml-64">
        <main className="flex-1 p-6">
          <div className="">
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Welcome, {adminName}
                </h1>
                <p className="text-gray-400">
                  Here's what's happening in your library
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-library-accent flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-400">Librarian</p>
                    <p className="text-white font-medium">{adminName}</p>
                  </div>
                </div>
              </div>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-library-panel border-gray-700 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Total Books</CardTitle>
                  <BookIcon className="h-5 w-5 text-library-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{books.length}</div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-400">Available</p>
                    <p className="text-green-400">{availableBooks}</p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Assuming student count might come from a different context or remains static for now */}
              {/* <Card className="bg-library-panel border-gray-700 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Students</CardTitle>
                  <Users className="h-5 w-5 text-library-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{studentsCount}</div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-400">Registered</p>
                    <p className="text-blue-400">{studentsCount}</p>
                  </div>
                </CardContent>
              </Card> */}

              <Card className="bg-library-panel border-gray-700 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Borrowed Books</CardTitle>
                  <Clock className="h-5 w-5 text-library-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{borrowedBooksCount}</div>
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>Active</span>
                    <span className="text-orange-400">{borrowedBooksCount}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-400 mt-1">
                    <span>Student 1 Borrowed</span>
                    <span className="text-orange-400">{student1BorrowedCount}</span>
                  </div>
                   <div className="flex justify-between items-center text-sm text-gray-400 mt-1">
                    <span>Student 2 Borrowed</span>
                    <span className="text-orange-400">{student2BorrowedCount}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
              <div className="bg-library-panel rounded-xl overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-4 text-gray-400">Student</th>
                      <th className="text-left p-4 text-gray-400">Book</th>
                      <th className="text-left p-4 text-gray-400">Borrowed Date</th>
                      <th className="text-left p-4 text-gray-400">Due Date</th>
                      <th className="text-left p-4 text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBorrowings.map((borrowed) => (
                      <tr key={borrowed.id} className="border-b border-gray-700">
                        <td className="p-4 text-white">{borrowed.studentName}</td>
                        <td className="p-4 text-white">{borrowed.bookTitle}</td>
                        <td className="p-4 text-gray-300">{borrowed.borrowedDate}</td>
                        <td className="p-4 text-gray-300">{borrowed.dueDate}</td>
                        <td className="p-4">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-800 text-green-200">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AdminDashboard;
