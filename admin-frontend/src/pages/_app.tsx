import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  
  return  (
    <div className = 'layout'>
      <Header/>
      <div className='content'>
        <div className='main'>
          <Component {...pageProps}/>
        </div>
      </div>
      <Footer/>
    </div>
  )
}
