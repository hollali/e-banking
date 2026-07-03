import MobileNav from "@/components/mobileNav";
import Sidebar from "@/components/sidebar";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn: User = {firstName: 'Hollali', lastName:'Kelvin', $id:'1', id:'1', email:'hollali@example.com', address:'', city:'', postalCode:'', dateOfBirth:'', ssn:''};
  return (
    <main className="flex h-screen w-full font-inter">
        <Sidebar user={loggedIn}/>
        <div className="flex size-full flex-col">
          <div className="root-layout">
            <Image src="/icons/logo.svg" width={30} height={30} alt="logo"/>
            <div>
              <MobileNav user={loggedIn}/>
            </div>
          </div>
          {children}
        </div>    
    </main>
  );
}
