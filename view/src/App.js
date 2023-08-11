import React from 'react'
import Signup from './components/Signup'
import Login from './components/Login'
import Chat from './components/Chat'
import { BrowserRouter as Router, Route , Routes} from "react-router-dom";

function App() {
  return (
    <>
    <Router>
        <Routes>
          <Route exact path="/" element={<Signup />} />
          <Route exact path="/Login" element={<Login />} />
          <Route exact path="/Chat" element={<Chat />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
