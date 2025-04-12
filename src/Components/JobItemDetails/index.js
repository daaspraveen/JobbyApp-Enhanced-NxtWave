import { useState, useEffect } from 'react'
import { ClipLoader } from 'react-spinners'
import { Link, useParams } from 'react-router-dom'
import Cookies from 'js-cookie'

import { BsBriefcaseFill } from 'react-icons/bs'
import { HiExternalLink } from 'react-icons/hi'
import { IoLocationSharp } from 'react-icons/io5'
import { FaStar } from 'react-icons/fa'

import Header from '../Header'
import './index.css'

const apiStatusList = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const SimilarJobItem = ({ similarJobDetails }) => {
  const { id, location, title, rating, company_logo_url, employmentType, job_description } = similarJobDetails
  return (
    <Link to={`/jobs/${id}`} className="similar-jobcard-link">
      <li className="similar-li-jobCard">
        <div className="result-li-headbox">
          <img
            className="result-li-img similar-li-img"
            src={company_logo_url}
            alt="similar job company logo"
          />
          <div className="result-li-headsidebox">
            <h4 className="star-img-head">{title}</h4>
            <p className="star-img-box">
              <FaStar size={20} color="#fbbf24" />
              {rating}
            </p>
          </div>
        </div>
        <h2 className="result-desc-head">Description</h2>
        <p className="result-desc-para similar-li-descPara">{job_description}</p>
        <div className="result-li-spansBox similar-li-spansBox">
          <p className="result-li-spanPara similar-li-spanPara">
            <IoLocationSharp size={20} />
            {location}
          </p>
          <p className="result-li-spanPara similar-li-spanPara">
            <BsBriefcaseFill size={20} />
            {employmentType}
          </p>
        </div>
      </li>
    </Link>
  )
}

const JobItemDetails = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusList.initial)
  const [apiList, setApiList] = useState([])
  const { id } = useParams()

  useEffect(() => {
    startJobIdApi(id)
  }, [id])

  const startJobIdApi = async (id) => {
    setApiStatus(apiStatusList.loading)
    const url = `https://apis.ccbp.in/jobs/${id}`
    const cookieToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookieToken}`,
        'Content-Type': 'Application/json',
      },
    }
    const fetchJobIdData = await fetch(url, options)
    if (fetchJobIdData.ok) {
      const jobIdApiResp = await fetchJobIdData.json()
      setApiList(jobIdApiResp)
      setApiStatus(apiStatusList.success)
    } else {
      setApiStatus(apiStatusList.failure)
      setApiList([])
    }
  }

  const renderLoading = () => (
    <div className="result-container loader-container" data-testid="loader">
      <ClipLoader color="#ffffff" size={50} />
    </div>
  )

  const renderFailure = () => (
    <div className="result-container failure-container">
      <img
        className="result-main-img"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h3 className="result-heading">Oops! Something Went Wrong</h3>
      <p className="result-para">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="result-btn"
        onClick={() => startJobIdApi(id)}
      >
        Retry
      </button>
    </div>
  )

  const renderSuccess = () => {
    const { similar_jobs: similarJobsList, job_details } = apiList
    return (
      <div className="success-JobDetails-container">
        {renderJobIdMainBox(job_details)}
        <h2 className="similar-job-heading">Similar Jobs</h2>
        <ul className="similar-jobs-ul">
          {similarJobsList.map((eachItem) => (
            <SimilarJobItem key={eachItem.id} similarJobDetails={eachItem} />
          ))}
        </ul>
      </div>
    )
  }

  const renderJobIdMainBox = (jobDetailsList) => {
    const { location, title, rating, skills, company_logo_url, company_website_url, employment_type, job_description, life_at_company, package_per_annum } = jobDetailsList
    return (
      <div className="result-li-box">
        <div className="result-li-headbox">
          <img
            className="result-li-img"
            src={company_logo_url}
            alt="job details company logo"
          />
          <div className="result-li-headsidebox">
            <h4 className="star-img-head">{title}</h4>
            <p className="star-img-box">
              <FaStar size={20} color="#fbbf24" />
              {rating}
            </p>
          </div>
        </div>
        <div className="result-li-spansBox">
          <p className="result-li-spanPara">
            <IoLocationSharp size={20} />
            {location} &nbsp; &nbsp;
            <BsBriefcaseFill size={20} />
            {employment_type}
          </p>
          <p className="result-li-spanLpa">{package_per_annum}</p>
        </div>
        <hr className="jobs-line" />
        <div className="result-desc-head-box">
          <h3 className="result-desc-head job-skills-head">Description</h3>
          <a
            href={company_website_url}
            className="result-mainJob-Link"
            target="__blank"
          >
            Visit
            <HiExternalLink size={20} />
          </a>
        </div>
        <p className="result-desc-para">{job_description}</p>
        <h4 className="result-desc-head job-skills-head">Skills</h4>
        <ul className="job-skills-ul">
          {skills.map((eachItem) => (
            <li key={eachItem.name} className="skills-li-box">
              <img
                className="skills-li-img"
                src={eachItem.image_url}
                alt={eachItem.name}
                width="30px"
              />
              <p className="skills-li-para">{eachItem.name}</p>
            </li>
          ))}
        </ul>
        <h4 className="result-desc-head job-life-head">Life at Company</h4>
        <div className="job-lifeAtCompany-box">
          <p className="job-lifeAtCompany-descPara">{life_at_company.description}</p>
          <img
            className="job-lifeAtCompany-img"
            src={life_at_company.image_url}
            alt="life at company"
          />
        </div>
      </div>
    )
  }

  const rendersFunc = () => {
    switch (apiStatus) {
      case apiStatusList.loading:
        return renderLoading()
      case apiStatusList.success:
        return renderSuccess()
      case apiStatusList.failure:
        return renderFailure()
      default:
        return renderFailure()
    }
  }

  return (
    <div className="container">
      <Header />
      <div className="jobItem-container">{rendersFunc()}</div>
    </div>
  )
}

export default JobItemDetails
