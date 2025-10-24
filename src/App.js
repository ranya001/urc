import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import Home from './user/Home';
import RegisterPage from './pages/RegisterPage';
import { LogoutButton } from './user/LogoutButton';

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Routes>

                {/* Le bouton est visible sur toutes les pages (optionnel) */}
                <div style={{ position: 'absolute', top: 20, right: 20 }}>
                    <LogoutButton />
                </div>
            </div>
        </Router>
    );
}

export default App;
