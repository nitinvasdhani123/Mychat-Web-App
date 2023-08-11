import React, { useState } from "react";
import axios from "axios";
import { useNavigate , Link } from "react-router-dom";
import Swal from 'sweetalert2'
import "./Signup.css";

function Login() {
  const [type, settype] = useState("password");
  const [icon, seticon] = useState("fa-solid fa-eye-slash");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();

  const show = () => {
    if (type === "password" && icon === "fa-solid fa-eye-slash") {
      settype("text");
      seticon("fa-solid fa-eye");
    } else {
      settype("password");
      seticon("fa-solid fa-eye-slash");
    }
  };

    const handlesubmit = (e) => {
      e.preventDefault();
      verifymember();
    };
    
  const verifymember = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/login` , {
        email:email,
        password:password,
        // token : localStorage.getItem("token")
      });
      if(response) {
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("Myid", response.data._id)
        navigate("/Chat");
      }
    } catch (error) {
      Swal.fire({
        title: 'Your account is not created yet, create your account first',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      })
      setemail("")
      setpassword("")
    }
  };
  return (
    <>
      <div id="signup-container">
        <div className="signup-container">
          <h1>Loginup</h1>
          <form>
            <div className="input-field">
              <input
                type="email"
                name="email"
                placeholder="Enter Your Email"
                onChange={(e) => {
                  setemail(e.target.value);
                }}
                value={email}
                required
              />
            </div>
            <div className="password-field">
              <input
                type={type}
                name="password"
                placeholder="Enter Your Password"
                onChange={(e) => {
                  setpassword(e.target.value);
                }}
                value={password}
                required
              />
              <div className="password-field-show-icon">
                <i className={icon} onClick={show}></i>
              </div>
            </div>
            <div className="already">Don't have an account? <Link to="/">Signup</Link></div>
            <div className="button-field">
              <button type="submit" onClick={handlesubmit}>
                Submit
              </button>
              <button type="reset">Reset</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
