import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './pages/Layout';
import { Home } from './pages/Home';
import { MovieDetail } from './pages/MovieDetail';
import { Search } from './pages/Search';
import { Listing } from './pages/Listing';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="phim/:slug" element={<MovieDetail />} />
          <Route path="search" element={<Search />} />
          <Route path="movies" element={<Listing />} />
          <Route path="series" element={<Listing />} />
          <Route path="anime" element={<Listing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
