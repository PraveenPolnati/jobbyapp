import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import JobCard from '../JobCard'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    profileData: {},
    employmentType: [],
    minimumPackage: '',
    search: '',
    jobsList: [],
    isLoading: true,
    isProfileError: false,
    isJobsError: false,
  }

  componentDidMount() {
    this.getProfile()
    this.getJobDetails()
  }

  formatProfileData = data => ({
    name: data.profile_details.name,
    profileImageUrl: data.profile_details.profile_image_url,
    shortBio: data.profile_details.short_bio,
  })

  getProfile = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const result = await fetch(url, options)
    if (result.ok) {
      const data = await result.json()
      const updateData = this.formatProfileData(data)
      this.setState({profileData: updateData, isProfileError: false})
    } else {
      this.setState({isProfileError: true})
    }
  }

  getJobDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const {employmentType, minimumPackage, search} = this.state
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join()}&minimum_package=${minimumPackage}&search=${search}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      this.setState({jobsList: data.jobs, isLoading: false})
    } else {
      this.setState({isJobsError: true, isLoading: false})
    }
  }

  onProfileRetry = () => {
    this.getProfile()
  }

  onRetryJobs = () => {
    this.getJobDetails()
  }

  onSuccessJobs = () => {
    const {jobsList, isJobsError} = this.state

    if (isJobsError) {
      return (
        <div className="noJobsFoundCard">
          <img
            className="noJobsFound"
            src="https://assets.ccbp.in/frontend/react-js/failure-img.png "
            alt="failure view"
          />
          <h1>Oops! Something Went Wrong</h1>
          <p>We cannot seem to find the page you are looking for.</p>
          <button type="button" onClick={this.onRetryJobs}>
            Retry
          </button>
        </div>
      )
    }
    if (jobsList.length === 0) {
      return (
        <div className="noJobsFoundCard">
          <img
            className="noJobsFound"
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
          />
          <h1>No Jobs Found</h1>
          <p>We could not find any jobs. Try another filters.</p>
        </div>
      )
    }
    return (
      <ul className="jobsListCard">
        {jobsList.map(each => (
          <JobCard job={each} key={each.id} />
        ))}
      </ul>
    )
  }

  searchInput = event => {
    this.setState({search: event.target.value})
  }

  searchBtnClicked = () => {
    this.getJobDetails()
  }

  checkboxClicked = event => {
    const {employmentType} = this.state
    if (!employmentType.includes(event.target.value)) {
      this.setState(
        prevState => ({
          employmentType: [event.target.value, ...prevState.employmentType],
        }),
        this.getJobDetails,
      )
    } else {
      const filterType = employmentType.filter(
        each => each !== event.target.value,
      )
      this.setState({employmentType: filterType}, this.getJobDetails)
    }
  }

  onRadioBtnClicked = event => {
    this.setState({minimumPackage: event.target.value}, this.getJobDetails)
  }

  render() {
    const {profileData, isLoading, isProfileError} = this.state
    return (
      <div className="jobsContainer">
        <Header />
        <div className="jobsCard">
          <div className="profileAndFilters">
            {isProfileError ? (
              <div className="profile">
                <button type="button" onClick={this.onProfileRetry}>
                  Retry
                </button>
              </div>
            ) : (
              <div className="profile">
                <img
                  src={profileData.profileImageUrl}
                  alt="profile"
                  height={30}
                />
                <h1>{profileData.name}</h1>
                <p>{profileData.shortBio}</p>
              </div>
            )}
            <hr className="line" />
            <div>
              <h2>Type of Employment</h2>
              <div className="employeeType">
                {employmentTypesList.map(each => (
                  <li className="employeeListCard" key={each.employmentTypeId}>
                    <input
                      type="checkbox"
                      id={each.employmentTypeId}
                      className="input"
                      value={each.employmentTypeId}
                      onClick={this.checkboxClicked}
                    />
                    <label htmlFor={each.employmentTypeId}>{each.label}</label>
                  </li>
                ))}
              </div>
            </div>
            <hr className="line" />
            <div className="employeeType">
              <h2>Salary Range</h2>
              {salaryRangesList.map(each => (
                <div className="employeeListCard" key={each.salaryRangeId}>
                  <input
                    type="radio"
                    name="salary"
                    id={each.salaryRangeId}
                    className="input"
                    value={each.salaryRangeId}
                    onClick={this.onRadioBtnClicked}
                  />
                  <label htmlFor={each.salaryRangeId}>{each.label}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="jobsList">
            <div className="jobsSearchCard">
              <input
                type="search"
                className="searchJob"
                placeholder="Search"
                onChange={this.searchInput}
              />
              <button
                type="button"
                onClick={this.searchBtnClicked}
                data-testid="searchButton"
                className="btn"
              >
                {` `}
                <BsSearch className="search-icon" />
              </button>
            </div>
            {isLoading ? (
              <div className="loader-container" data-testid="loader">
                <Loader
                  type="ThreeDots"
                  color="#ffffff"
                  height="50"
                  width="50"
                />
              </div>
            ) : (
              this.onSuccessJobs()
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
