import React from "react";


import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";

export default function siteLayout({ children }: { children: React.ReactNode }) {
	return (
        <>		  <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            </>

	);
}

