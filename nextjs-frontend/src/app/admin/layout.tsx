/**
 * Admin layout — suppresses the public-facing site Header and Footer.
 * All /admin/* pages render inside this layout instead of the root layout.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-shell min-h-screen bg-amber-50">
      {children}
    </div>
  );
}
