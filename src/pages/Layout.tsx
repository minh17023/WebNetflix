import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-textPrimary">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-black py-8 text-center text-gray-500 mt-12">
        <p>&copy; {new Date().getFullYear()} PhimFlix. All rights reserved.</p>
        <p className="text-sm mt-2">Data provided by phimapi.com</p>
      </footer>
    </div>
  );
};
