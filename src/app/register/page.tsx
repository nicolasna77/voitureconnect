import React from "react";
import RegisterForm from "../../components/auth/register-form";

const PageRegister = () => {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-md  flex-col space-y-2.5 p-4 md:-mt-32">
        <RegisterForm />
      </div>
    </main>
  );
};
export default PageRegister;
