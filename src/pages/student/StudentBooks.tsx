import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import BookCard from "@/components/BookCard";
import SearchBox from "@/components/SearchBox";
import Footer from "@/components/Footer";
import { useBooks } from "@/contexts/BookContext";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevPage,
  PaginationNextPage,
  PaginationPage
} from "@/components/ui/pagination";
import FloatingBooks from "@/components/FloatingBooks";

const StudentBooks: React.FC = () => {
  const { books, borrowedBooks } = useBooks();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Effect to log borrowedBooks state changes - for debugging
  useEffect(() => {
    console.log("Borrowed Books state updated in Books section:", borrowedBooks);
  }, [borrowedBooks]);

  const filteredBooks = books.filter(
    (book) => book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
              book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  return (
    <div className="flex min-h-screen bg-library-background">
      <FloatingBooks />
      <Sidebar userType="student" />
      
      <div className="flex-1 flex flex-col ml-64">
        <main className="flex-1 p-6">
          <div className="">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-white">All Books</h1>
              <p className="text-gray-400">Browse and search all books in our library</p>
            </header>
            
            <div className="mb-6">
              <SearchBox onSearch={setSearchQuery} placeholder="Search by title or author..." />
            </div>
            
            {currentBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
                {currentBooks.map((book) => (
                   <BookCard 
                     key={book.id + '-' + book.available}
                     book={book} 
                     isStudent={true} 
                   />
                ))}
              </div>
            ) : (
              <div className="bg-library-panel p-6 rounded-xl text-center">
                <p className="text-gray-400">No books found matching your search.</p>
              </div>
            )}
            
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevPage
                        onClick={() => setCurrentPage(curr => Math.max(curr - 1, 1))}
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationPage
                          onClick={() => setCurrentPage(index + 1)}
                          isActive={currentPage === index + 1}
                        >
                          {index + 1}
                        </PaginationPage>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNextPage
                        onClick={() => setCurrentPage(curr => Math.min(curr + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default StudentBooks;
