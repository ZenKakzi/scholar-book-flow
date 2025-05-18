
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBoxProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  onSearch,
  placeholder = "Search books..."
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-library-panel border-gray-700 text-white placeholder:text-gray-500"
        />
      </div>
      <Button type="submit" className="bg-library-accent hover:bg-orange-600">
        Search
      </Button>
    </form>
  );
};

export default SearchBox;
