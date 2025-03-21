export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-white">
      {children}
    </div>
  );
} 