import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { books, borrowedBooks } from "@/data/mockData";
import BookDetailsCard from "@/components/BookDetailsCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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

const AdminBookDetails: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const book = books.find((b) => b.id === bookId);
  const [editedBook, setEditedBook] = useState<Book | null>(book || null);
  
  // Get borrowing history for this book
  const bookBorrowings = borrowedBooks.filter((b) => b.bookId === bookId);
  
  if (!book || !editedBook) {
    return (
      <div className="flex min-h-screen bg-library-background">
        <Sidebar userType="admin" />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Book Not Found</h1>
            <Button onClick={() => navigate("/admin/books")}>
              Go Back to Books
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };
  
  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };
  
  const handleSaveEdit = () => {
    // In a real app, this would be an API call
    toast.success("Book updated successfully!");
    setIsEditDialogOpen(false);
  };
  
  const handleConfirmDelete = () => {
    // In a real app, this would be an API call
    toast.success("Book deleted successfully!");
    navigate("/admin/books");
  };
  
  return (
    <div className="flex min-h-screen bg-library-background">
      <FloatingBooks />
      <Sidebar userType="admin" />
      
      <div className="flex-1 flex flex-col ml-64">
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="mb-6"
            >
              ← Back
            </Button>
            
            <BookDetailsCard 
              book={book} 
              onEdit={handleEdit} 
            />
            
            <div className="flex justify-end mt-6">
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="ml-2"
              >
                Delete Book
              </Button>
            </div>
            
            {bookBorrowings.length > 0 && (
              <div className="mt-10">
                <h2 className="text-2xl font-bold text-white mb-4">Borrowing History</h2>
                <div className="bg-library-panel rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-4 text-gray-400">Student</th>
                        <th className="text-left p-4 text-gray-400">Borrowed Date</th>
                        <th className="text-left p-4 text-gray-400">Due Date</th>
                        <th className="text-left p-4 text-gray-400">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookBorrowings.map((borrowed) => (
                        <tr key={borrowed.id} className="border-b border-gray-700">
                          <td className="p-4 text-white">{borrowed.studentName}</td>
                          <td className="p-4 text-gray-300">{borrowed.borrowedDate}</td>
                          <td className="p-4 text-gray-300">{borrowed.dueDate}</td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                borrowed.status === "active"
                                  ? "bg-green-800 text-green-200"
                                  : "bg-blue-800 text-blue-200"
                              }`}
                            >
                              {borrowed.status === "active" ? "Active" : "Returned"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
      
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
                value={editedBook.title}
                onChange={(e) => setEditedBook({ ...editedBook, title: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-author">Author</Label>
              <Input
                id="edit-author"
                value={editedBook.author}
                onChange={(e) => setEditedBook({ ...editedBook, author: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-publisher">Publisher</Label>
              <Input
                id="edit-publisher"
                value={editedBook.publisher}
                onChange={(e) => setEditedBook({ ...editedBook, publisher: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-isbn">ISBN</Label>
              <Input
                id="edit-isbn"
                value={editedBook.isbn}
                onChange={(e) => setEditedBook({ ...editedBook, isbn: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="flex items-center gap-4">
              <Label htmlFor="edit-available" className="text-gray-300">Availability</Label>
              <Switch
                id="edit-available"
                checked={editedBook.available}
                onCheckedChange={(checked) => setEditedBook({ ...editedBook, available: checked })}
              />
              <span className="text-sm text-gray-400">
                {editedBook.available ? "Available" : "Not Available"}
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
              onClick={handleSaveEdit}
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
              Are you sure you want to delete "{book.title}"? This action cannot be undone.
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
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBookDetails;
