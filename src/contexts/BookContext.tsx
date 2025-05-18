import React, { createContext, useContext, useState, useEffect } from "react";
import { Book, BorrowedBook } from "@/types";
import { books as initialBooks, borrowedBooks as initialBorrowedBooks } from "@/data/mockData";
import { toast } from "sonner";

interface BookContextType {
  books: Book[];
  borrowedBooks: BorrowedBook[];
  returnBook: (borrowedBookId: string) => void;
  borrowBook: (bookId: string, userEmail: string, userName: string) => void;
  deleteBook: (bookId: string) => void;
  addBook: (book: Omit<Book, 'id'> & { adminUnavailable?: boolean }) => void;
  updateBook: (book: Book & { adminUnavailable?: boolean }) => void;
  addOrUpdateBorrowedBook: (borrowedBook: BorrowedBook) => void;
  deleteBorrowedBook: (borrowedBookId: string) => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export function BookProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<Book[]>(initialBooks.map(book => ({ ...book, adminUnavailable: false }))); // Initialize adminUnavailable
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>(initialBorrowedBooks);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedBorrowedBooks = localStorage.getItem("libraryBorrowedBooks");
    const savedBooks = localStorage.getItem("libraryBooks"); // Also load books state
    
    if (savedBorrowedBooks) {
      try {
        const parsedBorrowed = JSON.parse(savedBorrowedBooks);
        // Explicitly filter out 'active' entries for problematic books (It, Carrie, Origin of Species) on load
        const filteredBorrowed = parsedBorrowed.filter((borrowed: BorrowedBook) => 
          !(borrowed.bookId === '6' || borrowed.bookId === '9' || borrowed.bookId === '2') || borrowed.status !== 'active'
        );
        setBorrowedBooks(filteredBorrowed);
      } catch (error) {
        console.error("Failed to parse borrowed books from localStorage", error);
        setBorrowedBooks([]); // Start with empty if parsing fails
      }
    }

    if (savedBooks) {
        try {
            const parsedBooks = JSON.parse(savedBooks);
             // Ensure adminUnavailable is present, default to false if not
            const booksWithUnavailableFlag = parsedBooks.map((book: Book) => ({ ...book, adminUnavailable: book.adminUnavailable ?? false }));
            setBooks(booksWithUnavailableFlag);
        } catch (error) {
            console.error("Failed to parse books from localStorage", error);
            // If parsing fails, use initial books but ensure flag is present
            setBooks(initialBooks.map(book => ({ ...book, adminUnavailable: false })));
        }
    }

  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("libraryBorrowedBooks", JSON.stringify(borrowedBooks));
    localStorage.setItem("libraryBooks", JSON.stringify(books));
  }, [borrowedBooks, books]);

  // Function to get books with derived availability
  const getBooksWithAvailability = (currentBooks: Book[], currentBorrowedBooks: BorrowedBook[]) => {
    const activeBorrowedBookIds = new Set(
      currentBorrowedBooks
        .filter(borrowed => borrowed.status === "active")
        .map(borrowed => borrowed.bookId)
    );
    return currentBooks.map(book => ({
      ...book,
      // Book is available if not actively borrowed AND not adminUnavailable
      available: !activeBorrowedBookIds.has(book.id) && !book.adminUnavailable,
    }));
  };

  const borrowBook = (bookId: string, userEmail: string, userName: string) => {
    const bookToBorrow = books.find(b => b.id === bookId);
    if (!bookToBorrow) return;

    // Check if book is available based on derived status
    const derivedAvailableStatus = getBooksWithAvailability(books, borrowedBooks).find(b => b.id === bookId)?.available;

    if (!derivedAvailableStatus) {
       toast.error("This book is not available for borrowing");
       return;
    }

    // Check if user has already borrowed this book (redundant check but good for clarity)
    const alreadyBorrowedByUser = borrowedBooks.some(
      b => b.bookId === bookId && b.studentEmail === userEmail && b.status === "active"
    );
    if (alreadyBorrowedByUser) {
      toast.error("You have already borrowed this book");
      return;
    }

    // Create new borrowed book record
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 14); // 2 weeks borrowing period

    const newBorrowedBook: BorrowedBook = {
      id: Date.now().toString(), // Simple unique ID
      studentName: userName,
      studentEmail: userEmail,
      bookTitle: bookToBorrow.title,
      bookId: bookToBorrow.id,
      borrowedDate: today.toLocaleDateString(),
      dueDate: dueDate.toLocaleDateString(),
      status: "active"
    };

    // Update borrowed books list
    setBorrowedBooks(prev => [...prev, newBorrowedBook]);

    toast.success("Book borrowed successfully!");
  };

  const returnBook = (borrowedBookId: string) => {
    const borrowedBook = borrowedBooks.find(b => b.id === borrowedBookId);
    if (!borrowedBook) return;

    // Update borrowed books list status
    setBorrowedBooks(prev => 
      prev.map(book => 
        book.id === borrowedBookId 
          ? { ...book, status: "returned" }
          : book
      )
    );

    toast.success("Book returned successfully!");
  };

  const deleteBook = (bookId: string) => {
    // Remove from books list
    setBooks(prev => prev.filter(book => book.id !== bookId));
    // Also remove any corresponding borrowed entries (optional, depending on desired behavior)
    setBorrowedBooks(prev => prev.filter(borrowed => borrowed.bookId !== bookId));
    toast.success("Book deleted successfully!");
  };

  const addBook = (book: Omit<Book, 'id'> & { adminUnavailable?: boolean }) => {
    const newBook: Book = { ...book, id: Date.now().toString(), adminUnavailable: book.adminUnavailable ?? false };
    setBooks(prev => [...prev, newBook]);
    toast.success("Book added successfully!");
  };

  const updateBook = (updatedBook: Book & { adminUnavailable?: boolean }) => {
     // Ensure adminUnavailable defaults to false if not provided
     const bookToUpdate = { ...updatedBook, adminUnavailable: updatedBook.adminUnavailable ?? false };
     setBooks(prev => prev.map(book => book.id === bookToUpdate.id ? bookToUpdate : book));
     toast.success("Book updated successfully!");
  };

  // New function to add or update a borrowed book record from admin
  const addOrUpdateBorrowedBook = (borrowedBook: BorrowedBook) => {
    setBorrowedBooks(prev => {
      const existingIndex = prev.findIndex(b => b.id === borrowedBook.id);
      if (existingIndex > -1) {
        // Update existing record
        const newState = [...prev];
        newState[existingIndex] = borrowedBook;
        return newState;
      } else {
        // Add new record
        return [...prev, borrowedBook];
      }
    });
  };

  // New function to delete a borrowed book record
  const deleteBorrowedBook = (borrowedBookId: string) => {
    setBorrowedBooks(prev => prev.filter(borrowed => borrowed.id !== borrowedBookId));
    toast.success("Borrowed book record deleted successfully!");
  };

  // Provide books with derived availability
  const booksWithAvailability = React.useMemo(() => 
    getBooksWithAvailability(books, borrowedBooks),
    [books, borrowedBooks]
  );

  return (
    <BookContext.Provider value={{
      books: booksWithAvailability,
      borrowedBooks,
      returnBook,
      borrowBook,
      deleteBook,
      addBook,
      updateBook,
      addOrUpdateBorrowedBook,
      deleteBorrowedBook,
    }}>
      {children}
    </BookContext.Provider>
  );
}

export const useBooks = () => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error("useBooks must be used within a BookProvider");
  }
  return context;
}; 