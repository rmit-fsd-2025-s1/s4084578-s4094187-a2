import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface AdminLoginProps {
  children: React.ReactNode;
}

export default function AdminLogin({ children }: AdminLoginProps) {
  const router = useRouter()
  const [isVerified, setIsVerified] = useState<boolean | null>(null)

  useEffect(() => {
    // check for a valid login
    // login is automatically invalidated upon logout
    const isAdmin = localStorage.getItem("isAdmin")
    if (isAdmin === "true") {
      console.log("Verified admin")
      setIsVerified(true)
    } else {
      setIsVerified(false)
      // send user to login screen otherwise
      router.replace("/login")
    }
  }, [router])

  if (isVerified === null) return null

  return <>{children}</>
}
