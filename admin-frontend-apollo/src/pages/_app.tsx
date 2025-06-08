import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { client } from "@/services/apollo-client";
import "@/styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import AdminLogin from "@/components/AdminLogin";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {

  const router = useRouter()
  const isLoginPage = router.pathname === "/login"
  
  return (
    <ApolloProvider client={client}>
      <ChakraProvider>
        {/* messy ternary operator ensures someone without a valid admin login cannot access any page */}
        {isLoginPage ? (
          <div className = 'layout'>
              <Header/>
              <div className='content'>
                <div className='main'>
                  <Component {...pageProps} />
                </div>
              </div>
              <Footer/>
            </div>
        ) : (
          <AdminLogin>
            <div className = 'layout'>
              <Header/>
              <div className='content'>
                <div className='main'>
                  <Component {...pageProps} />
                </div>
              </div>
              <Footer/>
            </div>
          </AdminLogin>
        )}
      </ChakraProvider>
    </ApolloProvider>
  )
}
