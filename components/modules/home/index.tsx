"use client"
import useAuth from "@/hooks/useAuth"

const Home = () => {
  const checkUser = useAuth()
  console.log("checkUser",checkUser);
  
  return (
    <div>Home</div>
  )
}
export default Home