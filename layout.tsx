export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center">
      {children}
    </div>
  );
}