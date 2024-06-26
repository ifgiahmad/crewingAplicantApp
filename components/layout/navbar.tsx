// components/Toolbar.js
import Image from "next/image";

const Navbar = () => {
  return (
    <header className="bg-green-950 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex flex-col items-center bg-white p-1 rounded-md">
          <Image
            src="/LogoLMI.png"
            alt="Company Logo"
            className="h-10 mr-2"
            width={100} // Atur lebar logo sesuai kebutuhan
            height={100}
          />
          <div className="text-green-950 font-bold">
            PT. Lintas Maritim Indonesia
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
