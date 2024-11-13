import { Ad, Address, Car, Picture } from "@prisma/client";

export type AdWithCar = Omit<Ad, "updatedAt" | "createdAt"> & {
  car: Car & { pictures: Picture[] };
  address: Address | null;
  isLiked: boolean;
  idLike: string | null;
  updatedAt: string;
  createdAt: string;
};

export type AdResponse = {
  data: AdWithCar[];
  page: number;
  totalPages: number;
  total: number;
};
