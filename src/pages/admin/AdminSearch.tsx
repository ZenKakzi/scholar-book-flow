import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { books, borrowedBooks, users } from "@/data/mockData";
import SearchBox from "@/components/SearchBox";
import Footer from "@/components/Footer";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FloatingBooks from "@/components/FloatingBooks";

const AdminSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("books");
  
  // Filter books
  const filteredBooks = books.filter(
    (book) => 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) || 
      book.publisher.toLowerCase().includes(searchQuery.toLowerCase()) || 
      book.isbn.includes(searchQuery)
  );
  
  // Filter borrowed books
  const filteredBorrowings = borrowedBooks.filter(
    (borrowed) => 
      borrowed.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      borrowed.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) || 
      borrowed.bookTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter students (users with role "student")
  const filteredStudents = users.filter(
    (user) => 
      user.role === "student" && (
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
  );
  
  return (
    <div className="flex min-h-screen bg-library-background">
      <FloatingBooks />
      <Sidebar userType="admin" />
      
      <div className="flex-1 flex flex-col ml-64">
        <main className="flex-1 p-6">
          <div className="">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-white">Search</h1>
              <p className="text-gray-400">Search for books, borrowings, or students</p>
            </header>
            
            <div className="mb-6">
              <SearchBox 
                onSearch={setSearchQuery} 
                placeholder={`Search ${searchCategory}...`} 
              />
            </div>
            
            <Tabs defaultValue="books" className="mb-8" onValueChange={setSearchCategory}>
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="books">Books</TabsTrigger>
                <TabsTrigger value="borrowings">Borrowings</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
              </TabsList>
              
              <TabsContent value="books" className="bg-library-panel rounded-xl overflow-hidden">
                {filteredBooks.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-700">
                          <TableHead className="text-gray-300">Title</TableHead>
                          <TableHead className="text-gray-300">Author</TableHead>
                          <TableHead className="text-gray-300">Publisher</TableHead>
                          <TableHead className="text-gray-300">ISBN</TableHead>
                          <TableHead className="text-gray-300">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBooks.map((book) => (
                          <TableRow key={book.id} className="border-gray-700">
                            <TableCell className="font-medium text-white">
                              {book.title}
                            </TableCell>
                            <TableCell className="text-gray-300">{book.author}</TableCell>
                            <TableCell className="text-gray-300">{book.publisher}</TableCell>
                            <TableCell className="text-gray-300">{book.isbn}</TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  book.available
                                    ? "bg-green-800 text-green-200"
                                    : "bg-red-800 text-red-200"
                                }`}
                              >
                                {book.available ? "Available" : "Borrowed"}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-gray-400">No books found matching your search.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="borrowings" className="bg-library-panel rounded-xl overflow-hidden">
                {filteredBorrowings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-700">
                          <TableHead className="text-gray-300">Student Name</TableHead>
                          <TableHead className="text-gray-300">Book</TableHead>
                          <TableHead className="text-gray-300">Borrowed Date</TableHead>
                          <TableHead className="text-gray-300">Due Date</TableHead>
                          <TableHead className="text-gray-300">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBorrowings.map((borrowed) => (
                          <TableRow key={borrowed.id} className="border-gray-700">
                            <TableCell className="font-medium text-white">
                              {borrowed.studentName}
                            </TableCell>
                            <TableCell className="text-gray-300">{borrowed.bookTitle}</TableCell>
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
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-gray-400">No borrowings found matching your search.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="students" className="bg-library-panel rounded-xl overflow-hidden">
                {filteredStudents.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-700">
                          <TableHead className="text-gray-300">Name</TableHead>
                          <TableHead className="text-gray-300">Username</TableHead>
                          <TableHead className="text-gray-300">Email</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStudents.map((student) => (
                          <TableRow key={student.id} className="border-gray-700">
                            <TableCell className="font-medium text-white">
                              {student.name}
                            </TableCell>
                            <TableCell className="text-gray-300">{student.username}</TableCell>
                            <TableCell className="text-gray-300">{student.email}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-gray-400">No students found matching your search.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AdminSearch;
