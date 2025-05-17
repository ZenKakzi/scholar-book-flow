
import React from "react";
import { Book } from "@/types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface BookCardProps {
  book: Book;
  isStudent?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ book, isStudent = false }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    if (isStudent) {
      navigate(`/student/books/${book.id}`);
    } else {
      navigate(`/admin/books/${book.id}`);
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
          <Button
            className="mt-3 bg-library-accent hover:bg-orange-600 text-white"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
