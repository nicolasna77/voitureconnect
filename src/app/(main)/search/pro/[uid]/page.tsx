import Image from "next/image";

const DetailPro = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground py-4 px-6 shadow">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/placeholder.svg"
              alt="Garage Logo"
              width={40}
              height={40}
              className="w-10 h-10"
              style={{ aspectRatio: "40/40", objectFit: "cover" }}
            />
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Garage Acme</h1>
              <div className="flex gap-2">
                <Image
                  src="/placeholder.svg"
                  alt="Toyota Logo"
                  width={30}
                  height={30}
                  className="w-8 h-8"
                  style={{ aspectRatio: "30/30", objectFit: "cover" }}
                />
                <Image
                  src="/placeholder.svg"
                  alt="Honda Logo"
                  width={30}
                  height={30}
                  className="w-8 h-8"
                  style={{ aspectRatio: "30/30", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-sm">123 Main St, Anytown USA 12345</p>
            <p className="text-sm">Tel: (123) 456-7890</p>
            <p className="text-sm">Open 9am - 6pm, Mon - Sat</p>
          </div>
        </div>
      </header>
      <main className="flex-1 py-8 px-6">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-4">Inventory</h2>
        </div>
      </main>
    </div>
  );
};

export default DetailPro;
