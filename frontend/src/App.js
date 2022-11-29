import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Footer from './components/Footer';
import Header from './components/Header';
import NotFound from './components/NotFound';
import Currency from './pages/currency';
import Home from './pages/home';


function App() {
    const [logoColor, setLogoColor] = useState("")

    return (
        <>
            <Router>
                <div className="ctp-index">
                    <Header logoColor={logoColor} />
                    <Routes>
                        <Route path='/' element={<Home setLogoColor={setLogoColor} />} />
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
