import Sidebar from "@/components/sidebar/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Sheet, Menu, Link, Package2, Home, ShoppingCart, Badge, Package, Users, LineChart, Search, CircleUser } from "lucide-react";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
          <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <Sidebar />
            <div className="flex flex-col">
              <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                {children}
              </main>
            </div>
          </div>
  );
}
