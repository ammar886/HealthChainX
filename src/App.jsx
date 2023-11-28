import { useLayoutEffect, useState } from 'react'
import {
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar';
import Login from './components/Login';

function App() {
  const location = useLocation();
  const pathname = location.pathname;

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useLayoutEffect(() => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/":
        title = "";
        metaDescription = "";
        break;
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag = document.querySelector(
        'head > meta[name="description"]'
      );
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);

  const [showLogin, setShowLogin] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  return (
    <div>
      <Navbar onLoginClick={handleLoginClick} />
      <Routes>
        <Route path="/" element={<Home />} exact />
      </Routes>
      {showLogin && <Login onClose={handleCloseLogin} />}
    </div>
  );
}

export default App;