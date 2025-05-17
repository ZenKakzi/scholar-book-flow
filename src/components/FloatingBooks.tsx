
import React from "react";

const FloatingBooks: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="floating-book top-10 left-[10%] opacity-20">
        <img src="/placeholder.svg" alt="Floating book" className="w-16 h-24 rotate-12" />
      </div>
      <div className="floating-book top-[30%] right-[5%] opacity-30 delay-1000">
        <img src="/placeholder.svg" alt="Floating book" className="w-20 h-28 -rotate-6" />
      </div>
      <div className="floating-book bottom-[15%] left-[8%] opacity-20 delay-300">
        <img src="/placeholder.svg" alt="Floating book" className="w-14 h-20 rotate-[15deg]" />
      </div>
      <div className="floating-book bottom-[25%] right-[12%] opacity-15 delay-700">
        <img src="/placeholder.svg" alt="Floating book" className="w-16 h-24 -rotate-[10deg]" />
      </div>
    </div>
  );
};

export default FloatingBooks;
