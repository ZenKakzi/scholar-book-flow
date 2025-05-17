
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";
import Footer from "@/components/Footer";
import FloatingBooks from "@/components/FloatingBooks";

const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-library-background">
      <FloatingBooks />
      
      <main className="flex flex-col items-center justify-center flex-1 p-4">
        <div className="max-w-4xl w-full text-center animate-fade-in">
          <div className="flex justify-center mb-6">
            <Book className="h-16 w-16 text-library-accent" />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Online Library Management System
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            We Always Provide Quality and Fast Access to Books and Resources for You
          </p>
          
          <h2 className="text-2xl font-semibold text-library-accent mb-8">
            Read. Discover. Learn. Grow.
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/login")}
              className="bg-library-accent hover:bg-orange-600 text-white px-6 py-6 text-lg"
            >
              Get Started
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              "Harry Potter",
              "Origin of Species",
              "Last Words",
              "Bright Edge of the World",
              "The Shining"
            ].map((title, index) => (
              <div key={index} className="book-container">
                <div className="book bg-library-panel p-2 rounded-md shadow-lg">
                  <img 
                    src="/placeholder.svg" 
                    alt={title} 
                    className="w-full h-32 object-cover rounded-sm mb-2" 
                  />
                  <p className="text-xs text-center text-gray-300 truncate">{title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
