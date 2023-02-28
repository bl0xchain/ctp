import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/Footer';
import NotFound from './components/NotFound';
import About from './pages/about';
import Buy from './pages/buy';
import Currency from './pages/currency';
import Home from './pages/home';
import CreateUser from './pages/create-user';

function App() {
    
    return (
        <>
            <Router>
                <div className="ctp-index">
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/about' element={<About />} />
                        <Route path='/buy' element={<Buy />} />
                        <Route path='/currency/:id' element={<Currency />} />
                        <Route path='/create-user' element={<CreateUser />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Footer />
                </div>
            </Router>
            <ToastContainer />
        </>
    );
}

export default App;
