import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Footer from './components/Footer';
import Header from './components/Header';
import Currency from './pages/currency';
import Home from './pages/home';


function App() {
    return (
        <>
            <Router>
                <div className="ctp-index">
                    <Header />
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/currency/:id' element={<Currency />} />
                    </Routes>
                    <Footer />
                </div>
            </Router>
        </>
    );
}

export default App;
