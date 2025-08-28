const Section: React.FC<{ title?: string; children: React.ReactNode }> = ({ title, children }) => {
  return (
    <section className="bg-white shadow-md rounded-lg p-6 space-y-4">
      {title && <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">{title}</h2>}
      {children}
    </section>
  );
};

export default Section;