import { Button } from "@/components/ui/button";
import SearchSection from "@/components/component/search-section";
import { Input } from "@/components/ui/input";
import PriceSection from "@/components/component/price-section";
import { FeatureSection } from "@/components/component/feature-section";
import HeroSection from "@/components/component/hero-section";

export default function Home() {
  return (
    <div className="flex flex-col w-full ">
      <main className="m-auto w-full">
        <HeroSection />
        <SearchSection />
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted"
        >
          <div className="container m-auto px-4 md:px-6">
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
          <div className="container m-auto px-4 md:px-6">
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
                  Enjoy affordable pricing plans to fit your garages needs.
                </p>
              </div>
            </div>
          </div>
        </section>
        <FeatureSection />
        <PriceSection />

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
                Have any questions or need assistance? Contact our team and we
                ll be happy to help.
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
                We ll get back to you as soon as possible.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
