import { Link, useNavigate } from "react-router-dom";
import Header from "../Header";

import "./index.css";

const Home = () => {
  const navigate = useNavigate();
  const redirectJobs = () => {
    navigate("/jobs");
  };
  return (
    <>
      <div className="container">
        <Header />
        <div className="home-container">
          <div className="home-content-box">
            <h1 className="home-heading">Find The Job That Fits Your Life</h1>
            <p className="home-para">
              Millions of people are searching for jobs, salary information,
              company reviews. Find the job that fits your abilities and
              potential.
            </p>
            <Link to="/jobs" className="find-jobs-link">
              <button
                type="button"
                className="home-btn"
                onClick={() => redirectJobs}
              >
                Find Jobs
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
