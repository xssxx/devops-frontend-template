"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { env } from "next-runtime-env";

function App() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [secret, setSecret] = useState("");

  const API_URL = env("NEXT_PUBLIC_API_URL")!;

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setPassword("");

    try {
      const response = await fetch(`${API_URL}/secret`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error("Invalid password");
      }

      const data = await response.json();
      setSecret(data.message);
    } catch {
      setError("Invalid password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-purple-700 px-3">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-2xl shadow-xl text-center w-full md:-1/2 lg:w-1/3"
      >
        <h1 className="text-3xl font-bold text-green-700">Secret Access</h1>
        {secret === "" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <p className="mt-3 text-gray-600">Enter the password to continue</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="mt-4 px-4 py-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-500"
            />
            {error && <p className="mt-2 text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-5 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg w-full transition-all duration-300 disabled:bg-gray-400 cursor-pointer"
            >
              {loading ? "Checking..." : "Submit"}
            </button>
          </form>
        ) : (
          <>
            <p className="mt-3 text-red-600 text-2xl">{secret}</p>
            <button
              onClick={() => setSecret("")}
              className="mt-5 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg w-full transition-all duration-300 cursor-pointer"
            >
              Hide
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default App;
