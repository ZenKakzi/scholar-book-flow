
import React from "react";
import { Book } from "@/types";
import { Button } from "@/components/ui/button";

interface BookDetailsCardProps {
  book: Book;
  isStudent?: boolean;
  onBorrow?: () => void;
  onEdit?: () => void;
}

const BookDetailsCard: React.FC<BookDetailsCardProps> = ({ 
  book, 
  isStudent = false,
  onBorrow,
  onEdit
}) => {
  return (
    <div className="bg-library-panel rounded-xl overflow-hidden shadow-lg">
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <div className="book-container">
              <div className="book">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-bold text-white mb-2">{book.title}</h2>
            <p className="text-gray-300 mb-4">by {book.author}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="text-gray-400 text-sm">Publisher</h4>
                <p className="text-white">{book.publisher}</p>
              </div>
              <div>
                <h4 className="text-gray-400 text-sm">ISBN</h4>
                <p className="text-white">{book.isbn}</p>
              </div>
              <div>
                <h4 className="text-gray-400 text-sm">Status</h4>
                <p className={`font-medium ${book.available ? "text-green-400" : "text-red-400"}`}>
                  {book.available ? "Available" : "Borrowed"}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {isStudent && book.available && onBorrow && (
                <Button 
                  onClick={onBorrow}
                  className="bg-library-accent hover:bg-orange-600 text-white"
                >
                  Borrow Book
                </Button>
              )}
              
              {!isStudent && onEdit && (
                <Button 
                  onClick={onEdit}
                  variant="outline"
                  className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                >
                  Edit Book
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsCard;
