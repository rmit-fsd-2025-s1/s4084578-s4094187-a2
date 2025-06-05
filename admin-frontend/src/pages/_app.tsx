import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { client } from "@/services/apollo-client";
import "@/styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  
  return (
    <ApolloProvider client={client}>
      <ChakraProvider>
        <div className = 'layout'>
          <Header/>
          <div className='content'>
            <div className='main'>
              <Component {...pageProps}/>
            </div>
          </div>
          <Footer/>
        </div>
      </ChakraProvider>
    </ApolloProvider>
  )
}
