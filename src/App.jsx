import { useLayoutEffect, useMemo } from 'react'
import {
  Routes,
  Route,
  useNavigationType,
  useLocation,
} from 'react-router-dom'
import Home from './pages/Home'

function App() {
  const [action, location] = useMemo(() => {
    return [useNavigationType(), useLocation()];
  }, []);
  
  const pathname = location.pathname;

  useLayoutEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

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

  return (
    <Routes>
      <Route path="/" element={<Home />} exact />
    </Routes>
  );
}
export default App;
