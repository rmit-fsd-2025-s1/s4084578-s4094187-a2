// initial structure, including layout.tsx, navigation.tsx, header.tsx and footer.tsx were taken from week 3 tutorial
//  activity 1

import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout ({children }: LayoutProps) {
  return (
    <div className="layout">
      <Header />
      <div className="content">
        <div className="main">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  )
}