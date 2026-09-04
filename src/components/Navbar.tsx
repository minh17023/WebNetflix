import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shows', path: '/series' },
    { name: 'Movies', path: '/movies' },
    { name: 'New & Popular', path: '/' },
    { name: 'My List', path: '/' },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-colors duration-500 ${isScrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'}`}>
      <div className="px-4 md:px-12 flex items-center h-[68px]">
        {/* Logo and primary nav */}
        <div className="flex items-center gap-8">
          <Link to="/" className="text-[#E50914] text-2xl md:text-3xl font-black tracking-wider uppercase" style={{fontFamily: 'Arial, sans-serif'}}>
            PHIMFLIX
          </Link>
          <nav className="hidden md:flex gap-5 text-sm font-medium">
            {navLinks.map((link, idx) => (
              <Link key={idx} to={link.path} className="text-[#e5e5e5] hover:text-[#b3b3b3] transition-colors">
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Secondary nav (right) */}
        <div className="flex items-center gap-6 ml-auto">
          <div className="flex items-center">
            {isSearchOpen ? (
              <motion.form 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 250, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                onSubmit={handleSearch} 
                className="flex items-center bg-black/60 border border-white/80 px-2 py-1"
              >
                <Search className="text-white w-5 h-5 cursor-pointer mr-2" onClick={() => setIsSearchOpen(false)} />
                <input
                  type="text"
                  placeholder="Titles, people, genres"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-white text-sm outline-none w-full placeholder:text-gray-400"
                  autoFocus
                />
              </motion.form>
            ) : (
              <Search className="text-white w-6 h-6 cursor-pointer" onClick={() => setIsSearchOpen(true)} />
            )}
          </div>
          
          <span className="hidden md:block text-sm text-white cursor-pointer">Kids</span>
          <Bell className="text-white w-6 h-6 cursor-pointer hidden md:block" />
          
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center overflow-hidden">
               <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <span className="text-white text-xs border-transparent border-t-4 border-l-4 border-r-4 border-t-white mt-2 hidden md:block" style={{width: 0, height: 0, borderLeftColor: 'transparent', borderRightColor: 'transparent'}}></span>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#141414] border-t border-gray-800 p-4"
          >
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link, idx) => (
                <Link key={idx} to={link.path} onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-white font-medium">
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
