import React from 'react';
import { Button } from "@/components/ui/button";
import { ZigzagDivider } from "@/components/ui/ZigzagDivider";

export const Footer = () => {
  return (
    <footer className="w-full bg-foreground text-white mt-20">
      <section className="relative">
        <ZigzagDivider className="text-foreground top-[1px] absolute translate-y-[-100%] left-0 w-full" />
      </section>
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
          <div className="space-y-2">
            <div className="font-semibold">NAVIGATION</div>
            <div>Home</div>
            <div>Whitepaper</div>
            <div>Marketplace</div>
            <div>About us</div>
          </div>
          <div className="space-y-2">
            <div className="font-semibold">CONTACT US</div>
            <div>Email</div>
            <div>Chat</div>
            <div>Mail</div>
          </div>
          <div className="space-y-2">
            <div className="font-semibold">NEWSLETTER</div>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full px-3 py-2 border rounded bg-background text-black"
            />
            <Button className="mt-2">Subscribe</Button>
          </div>
        </div>
      </section>
    </footer>
  );
}; 