import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Book } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";
import FloatingBooks from "@/components/FloatingBooks";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-library-background">
      <FloatingBooks />
      
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="hidden md:flex flex-col items-center mx-8">
          <img src="/images/girl-reading.png" alt="Girl reading" className="h-64 w-auto" />
          <h2 className="text-xl font-bold text-white mt-2">Admin</h2>
        </div>

        <div className="w-full max-w-md animate-fade-in">
          <div className="flex justify-center mb-6">
            <Book className="h-12 w-12 text-library-accent" />
          </div>
          
          <h1 className="text-3xl font-bold text-center text-white mb-2">
            Online Library Management System
          </h1>
          <p className="text-center text-gray-400 mb-8">
            Read. Discover. Learn. Grow.
          </p>
          
          <Card className="bg-library-panel border-gray-700 text-white">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Login</CardTitle>
              <CardDescription className="text-gray-400 text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember" 
                      checked={remember}
                      onCheckedChange={(checked) => setRemember(checked === true)}
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remember me
                    </Label>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-library-accent hover:bg-orange-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-400">
                We always provide quality and fast access to books and resources for you
              </p>
            </CardFooter>
          </Card>
        </div>

        <div className="hidden md:flex flex-col items-center mx-8">
          <img src="/images/boy-student.png" alt="Boy student" className="h-64 w-auto" />
          <h2 className="text-xl font-bold text-white mt-2">Student</h2>
        </div>
      </div>
      
      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
};

export default LoginPage;
