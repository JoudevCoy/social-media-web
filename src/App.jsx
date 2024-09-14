import { RouterProvider } from "react-router-dom";
import { router, gRoute } from "./lib/routes";

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}