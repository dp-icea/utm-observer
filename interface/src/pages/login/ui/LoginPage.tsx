import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import LogoBRUTM from "@/shared/assets/icon-br-utm.svg";
import { useToast } from "@/shared/lib/hooks";
import { useAuth } from "@/shared/lib/hooks";

export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  const generateJWT = () => {
    // Generate a simple fake JWT token
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(
      JSON.stringify({
        sub: "icea",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      }),
    );
    const signature = btoa(Math.random().toString(36).substring(2, 15));
    return `${header}.${payload}.${signature}`;
  };

  const verifyCredentials = (username: string, password: string): boolean => {
    // Simulate credential verification
    const credentials = `${username}:${password}`;
    return credentials === import.meta.env.VITE_CREDENTIALS;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login delay
    setTimeout(() => {
      if (verifyCredentials(username, password)) {
        const token = generateJWT();
        sessionStorage.setItem("accessToken", token);
        toast({
          title: "Login Successful",
          description: "Welcome to the BR-UTM monitoring system",
        });

        login();

        navigate(from, { replace: true });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="space-y-1 items-center">
          <img
            src={LogoBRUTM}
            alt="BR-UTM Logo"
            className="h-30 w-30 rounded-full"
          />
          <CardTitle className="text-2xl text-center text-white">
            BR-UTM
          </CardTitle>
          <p className="text-sm text-center text-gray-400">
            Sign in to access the monitoring system
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
