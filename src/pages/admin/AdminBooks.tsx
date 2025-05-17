
import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { books as allBooks } from "@/data/mockData";
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

const AdminBooks: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // New book form state
  const [newBook, setNewBook] = useState<Partial<Book>>({
    title: "",
    author: "",
    publisher: "",
    isbn: "",
    available: true,
    coverImage: "/placeholder.svg"
  });
  
  // Filter books based on search
  const filteredBooks = allBooks.filter(
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
    setNewBook({
      title: "",
      author: "",
      publisher: "",
      isbn: "",
      available: true,
      coverImage: "/placeholder.svg"
    });
    setIsAddDialogOpen(true);
  };
  
  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setNewBook(book);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteBook = (book: Book) => {
    setSelectedBook(book);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle form submission
  const handleSaveBook = () => {
    // For a real app, this would be an API call
    toast.success(`Book ${isEditDialogOpen ? 'updated' : 'added'} successfully!`);
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteConfirm = () => {
    // For a real app, this would be an API call
    toast.success("Book deleted successfully!");
    setIsDeleteDialogOpen(false);
  };
  
  return (
    <div className="flex min-h-screen bg-library-background">
      <FloatingBooks />
      <Sidebar userType="admin" />
      
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
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
                value={newBook.title}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="publisher">Publisher</Label>
                <Input
                  id="publisher"
                  value={newBook.publisher}
                  onChange={(e) => setNewBook({ ...newBook, publisher: e.target.value })}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                value={newBook.isbn}
                onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="flex items-center gap-4">
              <Label htmlFor="available" className="text-gray-300">Availability</Label>
              <Switch
                id="available"
                checked={newBook.available}
                onCheckedChange={(checked) => setNewBook({ ...newBook, available: checked })}
              />
              <span className="text-sm text-gray-400">
                {newBook.available ? "Available" : "Not Available"}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-library-accent hover:bg-orange-600"
              onClick={handleSaveBook}
            >
              Save Book
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Book Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-library-panel text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update the book details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-title">Book Title</Label>
              <Input
                id="edit-title"
                value={newBook.title}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-author">Author</Label>
                <Input
                  id="edit-author"
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-publisher">Publisher</Label>
                <Input
                  id="edit-publisher"
                  value={newBook.publisher}
                  onChange={(e) => setNewBook({ ...newBook, publisher: e.target.value })}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-isbn">ISBN</Label>
              <Input
                id="edit-isbn"
                value={newBook.isbn}
                onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="flex items-center gap-4">
              <Label htmlFor="edit-available" className="text-gray-300">Availability</Label>
              <Switch
                id="edit-available"
                checked={newBook.available}
                onCheckedChange={(checked) => setNewBook({ ...newBook, available: checked })}
              />
              <span className="text-sm text-gray-400">
                {newBook.available ? "Available" : "Not Available"}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-blue-500 hover:bg-blue-600"
              onClick={handleSaveBook}
            >
              Update Book
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Book Confirmation Dialog */}
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
              variant="destructive"
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
