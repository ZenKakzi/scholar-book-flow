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
import { BorrowedBook } from "@/types";
import { useBooks } from "@/contexts/BookContext";

const AdminBorrowed: React.FC = () => {
  const { borrowedBooks, addOrUpdateBorrowedBook, deleteBorrowedBook } = useBooks();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBorrowing, setSelectedBorrowing] = useState<BorrowedBook | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // New borrowed book form state
  const [newBorrowing, setNewBorrowing] = useState<Partial<BorrowedBook>>({
    studentName: "",
    studentEmail: "",
    bookTitle: "",
    bookId: "",
    borrowedDate: "",
    dueDate: "",
    status: "active"
  });
  
  // Filter borrowed books based on search
  const filteredBorrowings = borrowedBooks.filter(
    (borrowed) => 
      borrowed.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      borrowed.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
      borrowed.studentEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBorrowings = filteredBorrowings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBorrowings.length / itemsPerPage);
  
  // Handle opening dialogs
  const handleAddBorrowing = () => {
    setNewBorrowing({
      studentName: "",
      studentEmail: "",
      bookTitle: "",
      bookId: "",
      borrowedDate: formatDate(new Date()),
      dueDate: formatDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)), // 2 weeks later
      status: "active"
    });
    setIsAddDialogOpen(true);
  };
  
  const handleEditBorrowing = (borrowed: BorrowedBook) => {
    setSelectedBorrowing(borrowed);
    setNewBorrowing(borrowed);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteBorrowing = (borrowed: BorrowedBook) => {
    setSelectedBorrowing(borrowed);
    setIsDeleteDialogOpen(true);
  };
  
  // Format date as DD/MM/YYYY
  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  // Handle form submission
  const handleSaveBorrowing = () => {
    // For a real app, this would be an API call
    
    // Create a complete BorrowedBook object
    const borrowingToSave: BorrowedBook = {
      // If editing, use the existing ID; otherwise, generate a new one
      id: isEditDialogOpen && selectedBorrowing ? selectedBorrowing.id : Date.now().toString(), 
      studentName: newBorrowing.studentName || "",
      studentEmail: newBorrowing.studentEmail || "",
      bookTitle: newBorrowing.bookTitle || "",
      bookId: newBorrowing.bookId || "", // Assuming bookId is added to the form
      borrowedDate: newBorrowing.borrowedDate || formatDate(new Date()),
      dueDate: newBorrowing.dueDate || formatDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)), // Default to 2 weeks later
      status: newBorrowing.status || "active",
    };

    addOrUpdateBorrowedBook(borrowingToSave); // Use the new context function

    toast.success(`Borrowing record ${isEditDialogOpen ? 'updated' : 'added'} successfully!`);
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteConfirm = () => {
    // For a real app, this would be an API call
    if (selectedBorrowing) {
      deleteBorrowedBook(selectedBorrowing.id); // Use the new context function
    }
    toast.success("Borrowing record deleted successfully!");
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
                <h1 className="text-3xl font-bold text-white">Borrowed Books Management</h1>
                <p className="text-gray-400">Track and manage all borrowed books</p>
              </div>
              <Button
                className="bg-library-accent hover:bg-orange-600"
                onClick={handleAddBorrowing}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Borrowing
              </Button>
            </header>
            
            <div className="mb-6">
              <SearchBox onSearch={setSearchQuery} placeholder="Search by student name, email or book..." />
            </div>
            
            <div className="bg-library-panel rounded-xl overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Student Name</TableHead>
                      <TableHead className="text-gray-300">Student Email</TableHead>
                      <TableHead className="text-gray-300">Book</TableHead>
                      <TableHead className="text-gray-300">Borrowed Date</TableHead>
                      <TableHead className="text-gray-300">Due Date</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentBorrowings.map((borrowed) => (
                      <TableRow key={borrowed.id} className="border-gray-700">
                        <TableCell className="font-medium text-white">
                          {borrowed.studentName}
                        </TableCell>
                        <TableCell className="text-gray-300">{borrowed.studentEmail}</TableCell>
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
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleEditBorrowing(borrowed)}
                              className="h-8 w-8 text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleDeleteBorrowing(borrowed)}
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
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredBorrowings.length)} of {filteredBorrowings.length} entries
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
      
      {/* Add Borrowing Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-library-panel text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Add New Borrowing</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter the details of the new borrowing record.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="studentName">Student Name</Label>
              <Input
                id="studentName"
                value={newBorrowing.studentName}
                onChange={(e) => setNewBorrowing({ ...newBorrowing, studentName: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="studentEmail">Student Email</Label>
              <Input
                id="studentEmail"
                value={newBorrowing.studentEmail}
                onChange={(e) => setNewBorrowing({ ...newBorrowing, studentEmail: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="bookTitle">Book Title</Label>
              <Input
                id="bookTitle"
                value={newBorrowing.bookTitle}
                onChange={(e) => setNewBorrowing({ ...newBorrowing, bookTitle: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="bookId">Book ID</Label>
              <Input
                id="bookId"
                value={newBorrowing.bookId}
                onChange={(e) => setNewBorrowing({ ...newBorrowing, bookId: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="borrowedDate">Borrowed Date</Label>
              <Input
                id="borrowedDate"
                value={newBorrowing.borrowedDate}
                onChange={(e) => setNewBorrowing({ ...newBorrowing, borrowedDate: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                value={newBorrowing.dueDate}
                onChange={(e) => setNewBorrowing({ ...newBorrowing, dueDate: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button className="bg-library-accent hover:bg-orange-600" onClick={handleSaveBorrowing}>Add Borrowing</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Borrowing Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-library-panel text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Edit Borrowing</DialogTitle>
            <DialogDescription className="text-gray-400">
              Edit the details of the borrowing record.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-studentName">Student Name</Label>
              <Input
                id="edit-studentName"
                value={newBorrowing.studentName}
                onChange={(e) => setNewBorrowing({ ...newBorrowing, studentName: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-studentEmail">Student Email</Label>
              <Input
                id="edit-studentEmail"
                value={newBorrowing.studentEmail}
                onChange={(e) => setNewBorrowing({ ...newBorrowing, studentEmail: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-bookTitle">Book Title</Label>
              <Input
                id="edit-bookTitle"
                value={newBorrowing.bookTitle}
                onChange={(e) => setNewBorrowing({ ...newBorrowing, bookTitle: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-bookId">Book ID</Label>
              <Input
                id="edit-bookId"
                value={newBorrowing.bookId}
                onChange={(e) => setNewBorrowing({ ...newBorrowing, bookId: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-borrowedDate">Borrowed Date</Label>
              <Input
                id="edit-borrowedDate"
                value={newBorrowing.borrowedDate}
                onChange={(e) => setNewBorrowing({ ...newBorrowing, borrowedDate: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-dueDate">Due Date</Label>
              <Input
                id="edit-dueDate"
                value={newBorrowing.dueDate}
                onChange={(e) => setNewBorrowing({ ...newBorrowing, dueDate: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button className="bg-library-accent hover:bg-orange-600" onClick={handleSaveBorrowing}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Borrowing Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-library-panel text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete the borrowing record for "{selectedBorrowing?.bookTitle}"? This action cannot be undone.
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

export default AdminBorrowed;
