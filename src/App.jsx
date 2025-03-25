import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';

import SignUp from './SignUp';
import Dashboard from './Dashboard'; // create this component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
       
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
