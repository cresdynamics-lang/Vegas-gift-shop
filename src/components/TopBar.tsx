const TopBar = () => {
  return (
    <div className="bg-red-600 text-white py-2 px-4 border-b border-red-700 text-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
        <div>Call us on: +254 740 282041 to place your order.</div>
        <div className="hidden md:block">Same day delivery in Nairobi.</div>
      </div>
    </div>
  );
};

export default TopBar;
