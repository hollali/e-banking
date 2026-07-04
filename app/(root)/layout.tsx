import MobileNav from "@/components/mobileNav";
import Sidebar from "@/components/sidebar";
import { getLoggedInUser } from "@/lib/actions/auth.actions";
import Image from "next/image";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = await getLoggedInUser();
  const fallbackUser: User = { firstName: 'Guest', lastName: '', email: '', $id: '0', id: '0', address: '', city: '', postalCode: '', dateOfBirth: '', ssn: '' };
  return (
    <main className="flex h-screen w-full font-inter">
        <Sidebar user={loggedIn || fallbackUser} />
        <div className="flex size-full flex-col">
          <div className="root-layout">
            <Image src="/icons/logo.svg" width={30} height={30} alt="logo"/>
            <div>
              <MobileNav user={loggedIn} />
            </div>
          </div>
          {children}
        </div>    
    </main>
  );
}
