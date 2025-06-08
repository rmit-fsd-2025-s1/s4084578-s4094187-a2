import { useState } from "react";
import { useRouter } from "next/router";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";

export default function AdminLogin() {

  // useState for form values
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // router to reroute upon successful login
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      // save valid login
      localStorage.setItem("isAdmin", "true");
      router.push("/");
    } else {
      alert("Invalid login details");
    }
  };

  return (
    <>
      <FormControl>
        <FormLabel fontWeight="bold">Admin Login</FormLabel>
        <br/>
        <FormLabel fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" color="gray.600">User</FormLabel>
        <Input
          placeholder="User"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <FormLabel fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" color="gray.600">Password</FormLabel>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>

      <br/>
      <Button onClick={handleLogin}>Login</Button>
    </>
  );
}
