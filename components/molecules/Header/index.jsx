"use client";

const Header = ({ isLogin = false }) => {
  return (
    <header
      style={{
        background: "linear-gradient(90deg, #4591AE 27.89%, #3F467A 77.3%)",
      }}
      className="fixed w-full top-0 bg-blue-500 text-white z-10"
    >
      <div className="relative p-4">
        <div className="lg:flex gap-8 w-full">test</div>
      </div>
    </header>
  );
};

export default Header;
