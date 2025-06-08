import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface AdminLoginProps {
  children: React.ReactNode;
}

export default function AdminLogin({ children }: AdminLoginProps) {
  const router = useRouter()
  const [isVerified, setIsVerified] = useState<boolean | null>(null)

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin")
    console.log("Admin check:", isAdmin)
    if (isAdmin === "true") {
      console.log("Verified admin")
      setIsVerified(true)
    } else {
      console.log("Not an admin, redirecting to /login")
      setIsVerified(false)
      router.replace("/login")
    }
  }, [router])

  if (isVerified === null) return null

  return <>{children}</>
}
