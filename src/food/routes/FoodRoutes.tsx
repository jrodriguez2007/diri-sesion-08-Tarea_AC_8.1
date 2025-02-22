import { Navigate, Route, Routes } from "react-router-dom"
import FoodPage from "../pages/FoodPage"

export const FoodRoutes = () => {

  return (
    <Routes>
        <Route path="/" element={ <FoodPage /> } />
        <Route path="/*" element={ <Navigate to="/" /> } />
    </Routes>
  )

}
