import React from "react";
import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./../pages/LoginPage";
import RegisterPage from "./../pages/RegisterPage";
import HomePage from "./../pages/HomePage";
import ProfilePage from "./../pages/ProfilePage";

export const gRoute = {
  ROOT: "/",
  LOGIN: "/login",
  SIGNIN: "/signin",
  PROFILE: "/profile"
}
export const router = createBrowserRouter([
  {
    path: gRoute.ROOT,
    element: <HomePage />
  },
  {
    path: gRoute.LOGIN,
    element: <LoginPage />
  },
  {
    path: gRoute.SIGNIN,
    element: <RegisterPage />
  },
  {
    path: gRoute.PROFILE,
    element: <ProfilePage />
  }
  /*{
    path: "/posts/:postId",
    element: <Postingan />
  }*/
]);