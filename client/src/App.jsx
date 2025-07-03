import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import HomePage from "./pages/home/HomePage";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notifications/Notification";
import ProfilePage from "./pages/profile/ProfilePage";
import { Toaster } from "react-hot-toast";
import baseUrl from "./constatant/url";

const { data: authUser, isLoading } = useQuery({
  // we use queryKey to give a unique name to our query and refer to it later
  queryKey: ["authUser"],
  queryFn: async () => {
    try {
      const res = await fetch(`${baseUrl}/api/auth/me`, {
        method: "GET",
        credentials: "include", // to include cookies in the request
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) return null;
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      console.log("authUser is here:", data);
      return data;
    } catch (error) {
      throw new Error(error);
    }
  },
  retry: false,
});

if (isLoading) {
  return (
    <div className="h-screen flex justify-center items-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}

const App = () => {
  return (
    <div className="flex max-w-6xl mx-auto">
      <Sidebar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
      </Routes>
      <RightPanel />
      <Toaster />
    </div>
  );
};

export default App;
