import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import SearchBox from "@/components/SearchBox";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Footer from "@/components/Footer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Book } from "@/types";
import { useBooks } from "@/contexts/BookContext";
import AddBookDialog from "@/components/AddBookDialog";

const AdminBooks: React.FC = () => {
  const { books, borrowedBooks, deleteBook, addBook, updateBook } = useBooks();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Filter books based on search
  const filteredBooks = books.filter(
    (book) => 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) || 
      book.isbn.includes(searchQuery)
  );
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  
  // Handle opening dialogs
  const handleAddBook = () => {
    setSelectedBook(null);
    setIsAddDialogOpen(true);
  };
  
  const handleDeleteBook = (book: Book) => {
    setSelectedBook(book);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle form submission
  const handleSaveBook = (bookData: Omit<Book, 'id'>) => {
    addBook(bookData);
    setIsAddDialogOpen(false);
  };
  
  const handleDeleteConfirm = () => {
    if (selectedBook) {
      deleteBook(selectedBook.id);
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-library-background">
      <FloatingBooks />
      <Sidebar userType="admin" />
      
      <div className="flex-1 flex flex-col ml-64">
        <main className="flex-1 p-6">
          <div className="">
            <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">Books Management</h1>
                <p className="text-gray-400">Manage your library's book collection</p>
              </div>
              <Button
                className="bg-library-accent hover:bg-orange-600"
                onClick={handleAddBook}
              >
                <Plus className="mr-2 h-4 w-4" /> Add New Book
              </Button>
            </header>
            
            <div className="mb-6">
              <SearchBox onSearch={setSearchQuery} placeholder="Search by title, author or ISBN..." />
            </div>
            
            <div className="bg-library-panel rounded-xl overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Title</TableHead>
                      <TableHead className="text-gray-300">Author</TableHead>
                      <TableHead className="text-gray-300">Publisher</TableHead>
                      <TableHead className="text-gray-300">ISBN</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentBooks.map((book) => (
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
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleDeleteBook(book)}
                              className="h-8 w-8 text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredBooks.length)} of {filteredBooks.length} entries
                </div>
                <div className="flex">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(curr => Math.max(curr - 1, 1))}
                    disabled={currentPage === 1}
                    className="mr-2"
                  >
                    Previous
                  </Button>
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
                    const pageNum = currentPage > 3 && totalPages > 5
                      ? currentPage - 3 + index + (index < 2 ? 0 : Math.max(0, currentPage - totalPages + 5))
                      : index + 1;
                    
                    if (pageNum > totalPages) return null;
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="mr-2"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(curr => Math.min(curr + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>

      {/* Add Book Dialog */}
      <AddBookDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleSaveBook}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-library-panel text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Delete Book</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete "{selectedBook?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBooks;
