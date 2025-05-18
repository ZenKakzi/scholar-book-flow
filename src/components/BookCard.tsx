import React from "react";
import { Book } from "@/types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBooks } from "@/contexts/BookContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Import the image
import harryPotterImage from "/images/harry-potter.png";

interface BookCardProps {
  book: Book;
  isStudent?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ book, isStudent = false }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { borrowBook } = useBooks();
  const [showBorrowDialog, setShowBorrowDialog] = React.useState(false);

  // Function to get the correct image
  const getBookImage = (bookId: string) => {
    if (bookId === "1") {
      return harryPotterImage;
    }
    return book.coverImage;
  };

  const handleViewDetails = () => {
    if (isStudent) {
      navigate(`/student/books/${book.id}`);
    } else {
      navigate(`/admin/books/${book.id}`);
    }
  };

  const handleBorrow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowBorrowDialog(true);
  };

  const confirmBorrow = () => {
    if (user) {
      borrowBook(book.id, user.email, user.name);
      setShowBorrowDialog(false);
    }
  };

  return (
    <div className="book-container h-full">
      <div className="book bg-library-panel h-full rounded-xl overflow-hidden shadow-lg flex flex-col">
        <div className="h-48 overflow-hidden">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-bold text-white text-lg mb-1 line-clamp-2">{book.title}</h3>
          <p className="text-gray-300 text-sm mb-2">{book.author}</p>
          <div className="flex items-center mt-auto">
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                book.available
                  ? "bg-green-800 text-green-200"
                  : "bg-red-800 text-red-200"
              }`}
            >
              {book.available ? "Available" : "Borrowed"}
            </span>
          </div>
          <div className="flex gap-2 mt-3">
            <Button
              className="flex-1 bg-library-accent hover:bg-orange-600 text-white"
              onClick={handleViewDetails}
            >
              View Details
            </Button>
            {isStudent && book.available && (
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={handleBorrow}
              >
                Borrow
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog 
        open={showBorrowDialog}
        onOpenChange={setShowBorrowDialog}
      >
        <DialogContent className="bg-library-panel text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Borrow Book</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to borrow "{book.title}"? You will have 14 days to return it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBorrowDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-library-accent hover:bg-orange-600"
              onClick={confirmBorrow}
            >
              Confirm Borrow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookCard;
