import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Footer from './components/Footer';
import Header from './components/Header';
import NotFound from './components/NotFound';
import About from './pages/about';
import Buy from './pages/buy';
import Currency from './pages/currency';
import Home from './pages/home';


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
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Footer />
                </div>
            </Router>
        </>
    );
}

export default App;
