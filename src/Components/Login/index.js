import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate, Navigate} from "react-router-dom";
import "./index.css";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("rahul");
  const [password, setPassword] = useState("rahul@2021");
  const [errorPara, setErrorPara] = useState("");

  const cookieData = Cookies.get("jwt_token");
  if (cookieData) {
    return <Navigate to="/" replace />
  }

  const submitFunc = async (e) => {
    e.preventDefault();
    const userLoginDetails = {
      username,
      password,
    };
    // console.log(userLoginDetails)
    if (!username || !password) {
      setErrorPara("*Username or password is invalid");
      return;
    }
    const url = "https://apis.ccbp.in/login";
    const options = {
      method: "POST",
      body: JSON.stringify(userLoginDetails),
    };
    const fetching = await fetch(url, options);
    const response = await fetching.json();
    if (fetching.ok) {
      resetFormInputs();
      // console.log(response)
      setErrorPara("");
      Cookies.set("jwt_token", response.jwt_token, {
        expires: 3,
      });
      moveToHomePage();
    } else {
      resetFormInputs();
      setErrorPara(`*${response.error_msg}`);
    }
  };

  const moveToHomePage = () => {
    navigate("/");
  };

  const updateInputUsername = (e) => {
    setUsername(e.target.value);
  };

  const updateInputPassword = (e) => {
    setPassword(e.target.value);
  };

  const resetFormInputs = () => {
    setUsername("");
    setPassword("");
    setErrorPara("");
  };

  const errorFormBoxStyle = !errorPara ? "" : "error-form-box";
  return (
    <div className="login-container">
      <div className={`login-form-box ${errorFormBoxStyle}`}>
        <form className="form" onSubmit={(e) => submitFunc(e)}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="form-logo"
          />
          <div className="input-box">
            <label htmlFor="username-input" className="input-label">
              USERNAME
            </label>
            <input
              type="text"
              id="username-input"
              className="form-input"
              placeholder="Username"
              value={username}
              onChange={updateInputUsername}
            />
          </div>
          <div className="input-box">
            <label htmlFor="password-input" className="input-label">
              PASSWORD
            </label>
            <input
              type="password"
              id="password-input"
              className="form-input"
              placeholder="Password"
              value={password}
              onChange={updateInputPassword}
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
          <p className="login-error-para">{errorPara}</p>
        </form>
      </div>
    </div>
  );
};

export default Login;
