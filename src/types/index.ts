
export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // In real app, this would be hashed
  role: 'student' | 'admin';
  name?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  coverImage: string;
  
  available: boolean;
}

export interface BorrowedBook {
  id: string;
  studentName: string;
  studentEmail: string;
  bookTitle: string;
  bookId: string;
  borrowedDate: string;
  dueDate: string;
  status: 'active' | 'returned';
}
