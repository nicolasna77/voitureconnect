import Image from "next/image";
import SearchForm from "./search-form";

const HeroSection = () => {
  return (
    <div className="bg-[#f2f2f2]  relative">
      <div className="grid max-w-screen-xl  px-4 mx-auto lg:gap-8 xl:gap-0 py-12 md:py-24 lg:py-32 lg:grid-cols-12">
        <div className=" place-self-center lg:col-span-6">
          <h1 className="scroll-m-20 text-4xl text-secondary-foreground font-extrabold tracking-tight lg:text-5xl ">
            Trouvez votre voiture idéale
          </h1>
          <p className="mt-3 text-lg text-secondary-foreground">
            Découvrez notre sélection de véhicules et trouvez celui qui vous
            convient.
          </p>
          <div className="mt-7 sm:mt-12 mx-auto z-10 max-w-xl relative">
            <SearchForm />
            <div className="hidden md:block absolute top-0 end-0 -translate-y-12 translate-x-20">
              <svg
                className="w-16 h-auto text-orange-500"
                width={121}
                height={135}
                viewBox="0 0 121 135"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 16.4754C11.7688 27.4499 21.2452 57.3224 5 89.0164"
                  stroke="currentColor"
                  strokeWidth={10}
                  strokeLinecap="round"
                />
                <path
                  d="M33.6761 112.104C44.6984 98.1239 74.2618 57.6776 83.4821 5"
                  stroke="currentColor"
                  strokeWidth={10}
                  strokeLinecap="round"
                />
                <path
                  d="M50.5525 130C68.2064 127.495 110.731 117.541 116 78.0874"
                  stroke="currentColor"
                  strokeWidth={10}
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="hidden md:block absolute bottom-0 start-0 translate-y-10 -translate-x-32">
              <svg
                className="w-40 h-auto text-cyan-500"
                width={347}
                height={188}
                viewBox="0 0 347 188"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 82.4591C54.7956 92.8751 30.9771 162.782 68.2065 181.385C112.642 203.59 127.943 78.57 122.161 25.5053C120.504 2.2376 93.4028 -8.11128 89.7468 25.5053C85.8633 61.2125 130.186 199.678 180.982 146.248L214.898 107.02C224.322 95.4118 242.9 79.2851 258.6 107.02C274.299 134.754 299.315 125.589 309.861 117.539L343 93.4426"
                  stroke="currentColor"
                  strokeWidth={7}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="hidden lg:mt-0 lg:col-span-6 lg:flex items-center">
          <Image
            src="/data/illustration/car-insurance.svg" // Assurez-vous que ce chemin est correct
            alt="Fond de la section héros"
            quality={100}
            width={1200}
            height={900}
            layout="responsive" // Ajout de cette ligne pour rendre l'image responsive
          />
        </div>
      </div>
    </div>
  );
};
export default HeroSection;
