
import React, { useRef } from 'react';
import { BrowserRouter as Router, Link,Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import SignUp from './pages/signup';
import Login from './pages/login';
import Search from './pages/search';
import AddReview from './pages/addReview';
import User from './pages/users';
import AddReport from './pages/createReport';
import EvalReport from './pages/evalReport';
import Department from './pages/department';
import Professor from './pages/professor';
import Course from './pages/course';
import Turma from './pages/class';
import Report from './pages/report';
import Review from './pages/review';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<Login />} />
        <Route path='/search' element={<Search />} />
        <Route path='/add' element={<AddReview />} />
        <Route path='/make_report' element={<AddReport />} />
        <Route path='/eval_report' element={<EvalReport />} />
        <Route path="/department/:id"element={<Department />}  />
        <Route path="/user/:id" element={<User />} />
        <Route path="/professor/:id" element={<Professor />} />
        <Route path="/class/:id" element={<Turma />} />
        <Route path="/course/:id" element={<Course />} /> 
        <Route path="/review/:id" element={<Review />} /> 
        <Route path="/report/:id" element={<Report />} /> 
      </Routes>
    </Router>
  );
}

const Layout = () => {
  return (
    <ul>
    <li>
      <Link to="/signup">Signup</Link>
    </li>
    <li>
      <Link to="/login">Login</Link>
    </li>
    <li>
      <Link to="/search">Search</Link>
    </li>
    <li>
      <Link to="/add">Add Review</Link>
    </li>
    <li>
      <Link to="/make_report">Add Report</Link>
    </li>
    <li>
      <Link to="/eval_report">Eval Report</Link>
    </li>
  </ul>
  );
};

export default App;

