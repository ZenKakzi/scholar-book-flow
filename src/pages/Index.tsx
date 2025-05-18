import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import FloatingBooks from "@/components/FloatingBooks";
import { books } from "@/data/mockData"; // Import book data

function Index() {
  // Take the first 5 books from the mock data
  const featuredBooks = books.slice(0, 5);

  return (
    <div className="flex min-h-screen bg-library-background text-white">
      <FloatingBooks />
      <div className="relative flex flex-col items-center justify-center w-full py-12 overflow-hidden z-10">
        <div className="text-center mb-12 px-4 mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">Welcome to the Library</h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Discover a world of knowledge at your fingertips.
          </p>
          <Link to="/login">
            <Button className="bg-library-accent hover:bg-orange-600 text-white text-lg px-8 py-4 rounded-full transition duration-300">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Featured Books Section */}
        <section className="w-full py-16 bg-library-background flex justify-center">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Featured Books</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {featuredBooks.map((book) => (
                <div key={book.id} className="book-container flex flex-col rounded-md overflow-hidden shadow-lg bg-library-panel">
                  <div className="w-full relative" style={{ paddingTop: '100%' }}> {/* Container for 1:1 aspect ratio (height is 100% of width - square) */}
                    <img 
                      src={book.coverImage} 
                      alt={book.title}
                      className="absolute top-0 left-0 w-full h-full object-cover rounded-t-md"
                    />
                  </div>
                  <div className="p-3 flex-grow flex flex-col justify-between">
                    <div className="text-sm font-semibold text-white mb-1 truncate">
                      {book.title}
                    </div>
                    {/* You might add author or other details here later */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}

export default Index;
