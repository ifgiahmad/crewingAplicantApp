import Link from "next/link";

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-green-900 text-white fixed">
      <div className="p-6">
        <h1 className="text-3xl font-semibold">My Sidebar</h1>
        <nav className="mt-6">
          <ul>
            <li className="my-4">
              <Link legacyBehavior href="/">
                <a className="text-lg hover:text-gray-400">Home</a>
              </Link>
            </li>
            <li className="my-4">
              <Link legacyBehavior href="/about">
                <a className="text-lg hover:text-gray-400">About</a>
              </Link>
            </li>
            <li className="my-4">
              <Link legacyBehavior href="/contact">
                <a className="text-lg hover:text-gray-400">Contact</a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
