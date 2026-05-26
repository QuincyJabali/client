
import './App.css';
import SignIn from './components/SignIn';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import SignUp from './components/SignUp';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ButtonScrollGroup from './components/ButtonScrollGroup';
import PaymentPage from './components/PaymentPage';
import MyItems from './components/MyItems';
import AddItem from './components/AddItem';
import Profile from './components/Profile';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<ButtonScrollGroup />} />
        <Route path="/pay" element={<PaymentPage />} />
        <Route path="/myitems" element={<MyItems />} />
        <Route path="/additem" element={<AddItem />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
