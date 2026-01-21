export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout intentionally renders only children
  // to bypass the root layout's Header and Footer
  return <>{children}</>;
}
