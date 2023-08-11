import React from "react";
import { useState } from "react";
import axios from "axios";
import "./Signup.css";
import Swal from 'sweetalert2'
import {useNavigate , Link} from 'react-router-dom'

function Signup() {
  const [type, settype] = useState("password");
  const [icon, seticon] = useState("fa-solid fa-eye-slash");
  const [data, setData] = useState({});
  const navigate = useNavigate();

  const navigateTologin = () => {
    navigate('/Login');
  };

  const handlechange = (e) => {
    if (e.target.name === "pic") {
      const file = e.target.files[0];
      const formdata = new FormData();
      formdata.append("file", file);
      formdata.append("upload_preset", "mychat");
      axios
        .post(
          `https://api.cloudinary.com/v1_1/dzz7qkskb/image/upload`,
          formdata
        )
        .then((res) => {
          setData({ ...data, [e.target.name]: res.data.secure_url });
        });
    } else {
      setData({ ...data, [e.target.name]: e.target.value });
    }
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    addmember();
  };

  const addmember = async () => {
    try {
      const response = await axios.post("http://localhost:8080/", data);
      // localStorage.setItem("token", response.data.token);
      Swal.fire({
        title: 'Your account is successfully created',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      })
      navigateTologin();
    } catch (error) {
      Swal.fire({
        title: 'An error is occurred in creating user successfully',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      })
    }
  };

  const show = () => {
    if (type === "password" && icon === "fa-solid fa-eye-slash") {
      settype("text");
      seticon("fa-solid fa-eye");
    } else {
      settype("password");
      seticon("fa-solid fa-eye-slash");
    }
  };

  return (
    <div id="signup-container">
      <div className="signup-container">
        <h1>Signup</h1>
        <form>
          <div className="input-field">
            <input
              type="text"
              name="name"
              placeholder="Enter Your Name"
              onChange={handlechange}
              required
            />
          </div>
          <div className="input-field">
            <input
              type="email"
              name="email"
              placeholder="Enter Your Email"
              onChange={handlechange}
              required
            />
          </div>
          <div className="password-field">
            <input
              type={type}
              name="password"
              placeholder="Enter Your Password"
              onChange={handlechange}
              required
            />
            <div className="password-field-show-icon">
            <i className={icon} onClick={show}></i>
            </div>
          </div>
          <div className="file-field">
            <input
              type="file"
              name="pic"
              accept="image/*"
              onChange={handlechange}
            />
          </div>
          <div className="already">Already have an account? <Link to="/Login">Login</Link></div>
          <div className="button-field">
            <button type="submit" onClick={handlesubmit}>
              Submit
            </button>
            <button type="reset">Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
