import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import XSvg from "../../components/svgs/X.jsx";

import { MdOutlineMail, MdPassword } from "react-icons/md";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import baseUrl from "../../constatant/url.js";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate: loginMutation,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ username, password }) => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // to include cookies in the request
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Login failed. Please try again.");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Logged in successfully");
      navigate("/");
    },
    onError: (err) => {
      toast.error(err.message || "Login failed");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="flex gap-4 flex-col w-80" onSubmit={handleSubmit}>
          <XSvg className="w-24 lg:hidden fill-white mx-auto" />
          <h1 className="text-4xl font-extrabold text-white text-center">
            Let's go.
          </h1>

          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="text"
              className="grow"
              placeholder="Username"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
              required
            />
          </label>

          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
              required
            />
          </label>

          <button
            type="submit"
            className="btn rounded-full btn-primary text-white"
            disabled={isPending}>
            {isPending ? "Loading..." : "Login"}
          </button>

          {isError && (
            <p className="text-red-500 text-center text-sm">
              {error?.message || "Login failed"}
            </p>
          )}
        </form>

        <div className="flex flex-col gap-2 mt-4 w-80">
          <p className="text-white text-lg text-center">
            Don't have an account?
          </p>
          <Link to="/signup">
            <button className="btn rounded-full btn-outline text-white w-full">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
