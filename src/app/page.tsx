import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Car } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="flex flex-col m-auto ">
      <header className="bg-primary text-primary-foreground px-4 lg:px-6 h-14 flex items-center">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <Car className="h-6 w-6" />
          <span className="text-xl font-bold">VoitureConnect</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Features
          </Link>
          <Link
            href="#"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Benefits
          </Link>
          <Link
            href="#"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6 grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Simplify Your Garage Management
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Garage Finder is your one-stop solution for buying, selling, and
                managing your garage. Easily post ads, connect with buyers, and
                streamline your garage operations.
              </p>
              <div className="flex gap-2">
                <Link
                  href="#"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Post an Ad
                </Link>
                <Link
                  href="#"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Manage Garage
                </Link>
              </div>
            </div>
            <Image
              src="/placeholder.svg"
              width="500"
              height="500"
              alt="Hero"
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
            />
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Key Features
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Garage Finder offers a comprehensive set of features to
                  streamline your garage management and buying/selling
                  experience.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Post Ads</h3>
                <p className="text-muted-foreground">
                  Easily create and publish ads for your garage or parts.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Manage Inventory</h3>
                <p className="text-muted-foreground">
                  Keep track of your garage inventory and sales history.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Connect with Buyers</h3>
                <p className="text-muted-foreground">
                  Communicate directly with potential buyers and close deals.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Scheduling Tools</h3>
                <p className="text-muted-foreground">
                  Manage your garage appointments and customer bookings.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Analytics</h3>
                <p className="text-muted-foreground">
                  Track your sales, inventory, and customer engagement.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Mobile App</h3>
                <p className="text-muted-foreground">
                  Manage your garage on-the-go with our mobile app.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="benefits" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Benefits of Using Garage Finder
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Garage Finder offers a range of benefits to help you
                  streamline your garage operations and connect with buyers.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Increased Visibility</h3>
                <p className="text-muted-foreground">
                  Reach a wider audience and get more exposure for your garage
                  and parts.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Time-Saving Tools</h3>
                <p className="text-muted-foreground">
                  Streamline your garage operations with our suite of management
                  tools.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Improved Efficiency</h3>
                <p className="text-muted-foreground">
                  Optimize your garage workflow and focus on serving your
                  customers.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Seamless Transactions</h3>
                <p className="text-muted-foreground">
                  Facilitate smooth and secure transactions between buyers and
                  sellers.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Comprehensive Support</h3>
                <p className="text-muted-foreground">
                  Get dedicated support from our team to help you succeed.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">Competitive Pricing</h3>
                <p className="text-muted-foreground">
                  Enjoy affordable pricing plans to fit your garage's needs.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="contact"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted"
        >
          <div className="container px-4 md:px-6 grid items-center justify-center gap-4 text-center">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Get in Touch
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Have any questions or need assistance? Contact our team and
                we'll be happy to help.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <form className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="max-w-lg flex-1"
                />
                <Button type="submit">Submit</Button>
              </form>
              <p className="text-xs text-muted-foreground">
                We'll get back to you as soon as possible.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; 2024 Garage Finder. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
