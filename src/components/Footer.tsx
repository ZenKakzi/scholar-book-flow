import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-library-panel mt-auto py-3 px-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <span className="text-white">Team-OLMS</span>
        </div>
        <div className="text-gray-400 text-sm mb-4 md:mb-0">
          <p>Contact: +371 22473340</p>
        </div>
        <div className="text-gray-400 text-sm">
          <p>©2025 Online Library Management System. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
