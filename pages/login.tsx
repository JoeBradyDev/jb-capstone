import { AiFillCar as CarIcon } from "react-icons/ai";
import type { NextPage } from "next";
import { Button } from "../components/Button";
import { useEffect, useState } from "react";
import { useSession } from "../utils/SessionProvider.client";
import { useRouter } from "next/router";

const LoginPage: NextPage = () => {
  const router = useRouter();
  const { login, loggedIn } = useSession();
  const [error, setError] = useState(false);

  if (login === null || loggedIn) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputs = e.currentTarget.getElementsByTagName("input");
    const username = inputs[0].value;
    const password = inputs[1].value;
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const { loggedIn, tokenExpiration } = await response.json();
      if (!!loggedIn && !!tokenExpiration) {
        login(tokenExpiration);
      } else {
        setError(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-full mt-6 md:-mt-16">
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg overflow-hidden">
        <div className="relative flex items-center text-4xl text-white font-medium px-8 py-6">
          <div className="-mx-8 absolute w-full h-full bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-400 opacity-90 drop-shadow-lg" />
          <CarIcon className="mr-5 h-24 w-24 drop-shadow-lg" />
          <div className="drop-shadow-lg">
            Car Sales Price <br />
            Prediction Engine
          </div>
        </div>
        <form
          className="flex flex-col mx-12 mb-12 mt-8 space-y-4"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col">
            <label className="text-lg">Username:</label>
            <input
              className={`${error ? "ring ring-rose-400" : ""}`}
              name="username"
              type="text"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-lg">Password:</label>
            <input
              className={`${error ? "ring ring-rose-400" : ""}`}
              name="password"
              type="password"
            />
          </div>
          <div className="relative">
            {!!error && (
              <div className="-top-2 absolute text-xs text-rose-700">
                Username or password incorrect. Please try again.
              </div>
            )}
          </div>
          <div className="pt-4 w-full h-full">
            <Button className="w-full h-full py-3 text-2xl text-white drop-shadow-lg">
              <span className="font-medium drop-shadow"> Login</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
