import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {FaStar} from 'react-icons/fa'
import {IoLocationSharp, IoBagHandleSharp} from 'react-icons/io5'
import {BsBoxArrowUpRight} from 'react-icons/bs'
import Header from '../Header'
import './index.css'

class JobView extends Component {
  state = {
    jobDetails: '',
    similarJobs: [],
    skills: [],
    lifeAtCompany: '',
    isLoading: true,
    isFailedToFetch: false,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  formatJobDetails = jobData => ({
    companyLogoUrl: jobData.company_logo_url,
    companyWebsiteUrl: jobData.company_website_url,
    employmentType: jobData.employment_type,
    id: jobData.id,
    jobDescription: jobData.job_description,
    location: jobData.location,
    packagePerAnnum: jobData.package_per_annum,
    rating: jobData.rating,
    title: jobData.title,
  })

  formatSimilarJobDetails = jobData => ({
    companyLogoUrl: jobData.company_logo_url,
    employmentType: jobData.employment_type,
    id: jobData.id,
    jobDescription: jobData.job_description,
    location: jobData.location,
    rating: jobData.rating,
    title: jobData.title,
  })

  formatJobSkills = skills => ({
    imageUrl: skills.image_url,
    name: skills.name,
  })

  getJobDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      const formatData = {
        jobDetails: data.job_details,
        similarJobs: data.similar_jobs,
      }

      const {jobDetails, similarJobs} = formatData

      const formatJobsDetails = {
        lifeAtCompany: jobDetails.life_at_company,
        skills: jobDetails.skills,
      }

      const {lifeAtCompany, skills} = formatJobsDetails

      const formatSimilarJobs = similarJobs.map(each =>
        this.formatSimilarJobDetails(each),
      )

      const formatSkills = skills.map(each => this.formatJobSkills(each))

      const formatLifeAtCompany = {
        description: lifeAtCompany.description,
        imageUrl: lifeAtCompany.image_url,
      }

      this.setState({
        jobDetails: this.formatJobDetails(jobDetails),
        similarJobs: formatSimilarJobs,
        skills: formatSkills,
        lifeAtCompany: formatLifeAtCompany,
        isLoading: false,
        isFailedToFetch: false,
      })
    } else {
      this.setState({isFailedToFetch: true})
    }
  }

  skillsContainer = skill => {
    const {imageUrl, name} = skill
    return (
      <div className="skill" key={name}>
        <img src={imageUrl} alt={name} height={50} />
        <p className="skillName">{name}</p>
      </div>
    )
  }

  similarJobsCard = similarJob => {
    const {
      companyLogoUrl,
      employmentType,
      id,
      jobDescription,
      location,
      rating,
      title,
    } = similarJob

    return (
      <Link to={`/jobs/${id}`} className="similarJobLink" target="_-parent">
        <div className="similarJob">
          <div className="similarJobLogo">
            <img
              src={companyLogoUrl}
              alt="similar job company logo"
              height={50}
            />
            <div className="similarJobTitleAndRating">
              <p className="similarJobTitle">{title}</p>
              <p>{rating}</p>
            </div>
          </div>
          <p>Description</p>
          <p>{jobDescription}</p>
          <div>
            <p>{location}</p>
            <p>{employmentType}</p>
          </div>
        </div>
      </Link>
    )
  }

  onSuccessJobDetails = () => {
    const {
      jobDetails,
      similarJobs,
      skills,
      lifeAtCompany,
      isLoading,
    } = this.state

    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetails

    const {description, imageUrl} = lifeAtCompany

    if (isLoading) {
      return (
        <div className="loader-container" data-testid="loader">
          <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </div>
      )
    }
    return (
      <div className="jobDetailsCard">
        <div className="logoCard">
          <img
            src={companyLogoUrl}
            alt="job details company logo"
            height={50}
          />
          <div className="titleAndRating">
            <p className="title">{title}</p>
            <div className="rating">
              <FaStar />
              <p>{rating}</p>
            </div>
          </div>
          {console.log(jobDetails, similarJobs, skills, lifeAtCompany)}
        </div>
        <div className="locationAndSalary">
          <div className="locationAndEmployementType">
            <div className="location">
              <IoLocationSharp />
              <p>{location}</p>
            </div>
            <div className="location">
              <IoBagHandleSharp />
              <p>{employmentType}</p>
            </div>
          </div>
          <p>{packagePerAnnum}</p>
        </div>
        <hr />
        <div>
          <div className="descriptionAndVisit">
            <h3>Description</h3>
            <a href={companyWebsiteUrl} className="visit">
              <p className="visitHeading">Visit</p>
              <BsBoxArrowUpRight />
            </a>
          </div>
          <p>{jobDescription}</p>
        </div>
        <div className="skillCard">
          <h3>Skills</h3>
          <div className="skillsList">
            {skills.map(each => this.skillsContainer(each))}
          </div>
        </div>
        <div className="lifeAtCompany">
          <div className="lifeAtCompanyDescription">
            <h3>Life at Company</h3>
            <p>{description}</p>
          </div>
          <img src={imageUrl} alt="life at company" height={180} />
        </div>
      </div>
    )
  }

  retryJobData = () => {
    this.getJobDetails()
  }

  isSuccess = () => {
    const {similarJobs, isFailedToFetch} = this.state
    if (isFailedToFetch) {
      return (
        <div>
          <Header />
          <div className="similarJobsFailure">
            <img
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
              alt="failure view"
            />
            <h2>Oops! Something Went Wrong</h2>
            <p>We cannot seem to find the page you are looking for.</p>
            <button onClick={this.retryJobData} type="button">
              Retry
            </button>
          </div>
        </div>
      )
    }
    return (
      <div className="jobDetailsContainer">
        <Header />
        {this.onSuccessJobDetails()}
        <div>
          <h3>Similar Jobs</h3>
          <div className="similarJobsContainer">
            {similarJobs.map(each => this.similarJobsCard(each))}
          </div>
        </div>
      </div>
    )
  }

  render() {
    return this.isSuccess()
  }
}

export default JobView
