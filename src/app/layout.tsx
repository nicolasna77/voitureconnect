import { ReactNode } from "react";
type Props = {
  children: ReactNode;
};

const RootLayout = ({ children }: Props) => children;

export default RootLayout;
