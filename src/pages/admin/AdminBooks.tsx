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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import FloatingBooks from "@/components/FloatingBooks";
import { Book } from "@/types";
import { useBooks } from "@/contexts/BookContext";

const AdminBooks: React.FC = () => {
  const { books, borrowedBooks, deleteBook, addBook, updateBook } = useBooks();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // New/Edit book form state
  const [bookFormData, setBookFormData] = useState<Partial<Book & { adminUnavailable?: boolean }>>({
    title: "",
    author: "",
    publisher: "",
    isbn: "",
    // Default available to true and adminUnavailable to false for new books
    available: true, 
    adminUnavailable: false, 
    coverImage: "/placeholder.svg"
  });
  
  // Determine if a book is currently borrowed
  const isBookBorrowed = (bookId: string) => {
    return borrowedBooks.some(borrowed => borrowed.bookId === bookId && borrowed.status === 'active');
  };

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
    setBookFormData({
      title: "",
      author: "",
      publisher: "",
      isbn: "",
      available: true,
      adminUnavailable: false,
      coverImage: "/placeholder.svg"
    });
    setSelectedBook(null); // Clear selected book for add
    setIsAddDialogOpen(true);
  };
  
  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    // Initialize form data based on the book's actual properties
    setBookFormData({ ...book, adminUnavailable: book.adminUnavailable ?? false });
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteBook = (book: Book) => {
    setSelectedBook(book);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle form submission
  const handleSaveBook = () => {
    if (isEditDialogOpen && selectedBook) {
      // When editing, update the book including the adminUnavailable flag
      // Note: The derived 'available' status is controlled by adminUnavailable and borrowed status
      updateBook({ ...selectedBook, ...bookFormData });
    } else if (bookFormData.title && bookFormData.author) { // Basic validation
      // When adding, ensure adminUnavailable defaults to false
      addBook({ ...bookFormData, adminUnavailable: bookFormData.adminUnavailable ?? false } as Omit<Book, 'id'> & { adminUnavailable: boolean });
    }
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteConfirm = () => {
    if (selectedBook) {
      deleteBook(selectedBook.id);
    }
    setIsDeleteDialogOpen(false);
  };

  // Update bookFormData when selectedBook changes (for editing)
  React.useEffect(() => {
    if (selectedBook) {
       setBookFormData({ ...selectedBook, adminUnavailable: selectedBook.adminUnavailable ?? false });
    } else {
       // Reset for adding new book
       setBookFormData({
          title: "",
          author: "",
          publisher: "",
          isbn: "",
          available: true,
          adminUnavailable: false,
          coverImage: "/placeholder.svg"
       });
    }
  }, [selectedBook]);
  
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
                              book.available // Use derived available status for display
                                ? "bg-green-800 text-green-200"
                                : "bg-red-800 text-red-200"
                            }`}
                          >
                            {/* Display status based on derived availability and adminUnavailable */}
                            {book.available ? "Available" : book.adminUnavailable ? "Unavailable (Admin)" : "Borrowed"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleEditBook(book)}
                              className="h-8 w-8 text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
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
                        className="mx-1"
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
                    className="ml-2"
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
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-library-panel text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter the details of the new book.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="title">Book Title</Label>
              <Input
                id="title"
                value={bookFormData.title}
                onChange={(e) => setBookFormData({ ...bookFormData, title: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={bookFormData.author}
                onChange={(e) => setBookFormData({ ...bookFormData, author: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="publisher">Publisher</Label>
              <Input
                id="publisher"
                value={bookFormData.publisher}
                onChange={(e) => setBookFormData({ ...bookFormData, publisher: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                value={bookFormData.isbn}
                onChange={(e) => setBookFormData({ ...bookFormData, isbn: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            {/* Admin Unavailable switch for new books */}
            <div className="flex items-center space-x-2">
              <Switch
                id="admin-unavailable-new"
                checked={!bookFormData.adminUnavailable}
                onCheckedChange={(checked) => setBookFormData({ ...bookFormData, adminUnavailable: !checked })}
              />
              <Label htmlFor="admin-unavailable-new">Available</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button className="bg-library-accent hover:bg-orange-600" onClick={handleSaveBook}>Add Book</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Book Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-library-panel text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription className="text-gray-400">
              Edit the details of the book.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-title">Book Title</Label>
              <Input
                id="edit-title"
                value={bookFormData.title}
                onChange={(e) => setBookFormData({ ...bookFormData, title: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-author">Author</Label>
              <Input
                id="edit-author"
                value={bookFormData.author}
                onChange={(e) => setBookFormData({ ...bookFormData, author: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-publisher">Publisher</Label>
              <Input
                id="edit-publisher"
                value={bookFormData.publisher}
                onChange={(e) => setBookFormData({ ...bookFormData, publisher: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-isbn">ISBN</Label>
              <Input
                id="edit-isbn"
                value={bookFormData.isbn}
                onChange={(e) => setBookFormData({ ...bookFormData, isbn: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            {/* Admin Unavailable switch for editing books */}
             <div className="flex items-center space-x-2">
              <Switch
                id="admin-unavailable-edit"
                // Switch should be ON if NOT adminUnavailable, and OFF if adminUnavailable
                checked={!bookFormData.adminUnavailable}
                // Update adminUnavailable based on switch position
                onCheckedChange={(checked) => setBookFormData({ ...bookFormData, adminUnavailable: !checked })}
                // Disable if the book is currently borrowed
                disabled={selectedBook ? isBookBorrowed(selectedBook.id) : false} 
              />
              <Label htmlFor="admin-unavailable-edit">Available</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button className="bg-library-accent hover:bg-orange-600" onClick={handleSaveBook}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Book Dialog */} 
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-library-panel text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete the book "{selectedBook?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleDeleteConfirm}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBooks;
