export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex items-center justify-center min-h-[calc(100vh_-_theme(spacing.16))]">
      <div className="relative mx-auto flex w-full max-w-md flex-col p-4 md:-mt-20">
        {children}
      </div>
    </main>
  );
}
