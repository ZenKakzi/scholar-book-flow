import React, { useState, useEffect } from "react";
import { Book } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// List of available book cover images
const AVAILABLE_COVERS = [
  "/images/irumbukaimayavi.png",
  "/images/The-Bright-Edge-of-the-World.png",
  "/images/harry-potter.png",
  "/images/girl-reading.png",
  "/images/boy-student.png"
];

interface AddBookDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (book: Omit<Book, 'id'>) => void;
  initialData?: Partial<Book>;
}

const AddBookDialog: React.FC<AddBookDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [bookData, setBookData] = useState<Partial<Book>>({
    title: "",
    author: "",
    publisher: "",
    isbn: "",
    available: true,
    coverImage: "/placeholder.svg",
    ...initialData
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");

  useEffect(() => {
    if (selectedFile) {
      setImagePreview(URL.createObjectURL(selectedFile));
      setImageUrl(""); // Clear URL if file is selected
    } else if (imageUrl) {
      setImagePreview(imageUrl);
      setSelectedFile(null); // Clear file if URL is entered
    } else {
      setImagePreview(null);
    }

    // Clean up the object URL when component unmounts or file changes
    return () => {
      if (imagePreview && selectedFile) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [selectedFile, imageUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(event.target.value);
    setSelectedFile(null); // Clear selected file when URL is typed
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalCoverImage = bookData.coverImage;

    if (selectedFile) {
      // Typically, you would upload this file to a server here
      // For this example, we'll just set the path to public/images
      const fileName = bookData.title
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '.png';
      finalCoverImage = `/images/${fileName}`;
      console.log("File selected:", selectedFile);
      console.log("Image will be saved as:", fileName);
      // *** File upload logic would go here ***
      // Example: uploadFile(selectedFile, fileName);

    } else if (imageUrl) {
      finalCoverImage = imageUrl;
      console.log("Image URL provided:", imageUrl);
    } else {
       finalCoverImage = "/placeholder.svg"; // Default if nothing is provided
    }

    const updatedBookData = {
      ...bookData,
      coverImage: finalCoverImage
    };

    onSave(updatedBookData as Omit<Book, 'id'>);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-library-panel text-white border-gray-700">
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
          <DialogDescription className="text-gray-400">
            Fill in the details for the new book
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={bookData.title}
              onChange={(e) => setBookData({ ...bookData, title: e.target.value })}
              required
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={bookData.author}
              onChange={(e) => setBookData({ ...bookData, author: e.target.value })}
              required
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="publisher">Publisher</Label>
            <Input
              id="publisher"
              value={bookData.publisher}
              onChange={(e) => setBookData({ ...bookData, publisher: e.target.value })}
              required
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="isbn">ISBN</Label>
            <Input
              id="isbn"
              value={bookData.isbn}
              onChange={(e) => setBookData({ ...bookData, isbn: e.target.value })}
              required
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label>Cover Image</Label>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "upload" | "url")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload Image</TabsTrigger>
                <TabsTrigger value="url">Image URL</TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="mt-4">
                <Input
                  id="coverImageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </TabsContent>
              <TabsContent value="url" className="mt-4">
                 <Input
                  id="coverImageUrl"
                  type="text"
                  placeholder="Enter image URL"
                  value={imageUrl}
                  onChange={handleUrlChange}
                  className="bg-gray-800 border-gray-700 text-white"
                 />
              </TabsContent>
            </Tabs>
            
            {imagePreview && (
              <div className="mt-4">
                <Label>Preview:</Label>
                <img
                  src={imagePreview}
                  alt="Cover preview"
                  className="w-32 h-32 object-cover rounded mt-2"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-library-accent hover:bg-orange-600"
            >
              Save Book
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookDialog; 