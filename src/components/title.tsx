const Title = ({ children }: { children: React.ReactNode }) => {
  return (
    <h2 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
      {children}
    </h2>
  );
};

export default Title;
