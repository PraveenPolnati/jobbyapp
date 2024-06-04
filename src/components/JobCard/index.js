import {Link} from 'react-router-dom'
import {FaStar} from 'react-icons/fa'
import {IoLocationSharp, IoBagHandle} from 'react-icons/io5'
import './index.css'

const JobCard = props => {
  const {job} = props
  const formatedJobs = {
    companyLogoUrl: job.company_logo_url,
    employmentType: job.employment_type,
    id: job.id,
    jobDescription: job.job_description,
    location: job.location,
    packagePerAnnum: job.package_per_annum,
    rating: job.rating,
    title: job.title,
  }
  return (
    <Link to={`/jobs/${formatedJobs.id}`} className="jobLink">
      <li className="jobListItem">
        <div className="jobCard1">
          <img
            src={formatedJobs.companyLogoUrl}
            alt="company logo"
            height={40}
          />
          <div className="jobCard3">
            <h3 className="title">{formatedJobs.title}</h3>
            <div className="jobCard2">
              <FaStar />
              <p>{formatedJobs.rating}</p>
            </div>
          </div>
        </div>
        <div className="locationAndType">
          <div className="jobLocation">
            <div className="jobLocation">
              <IoLocationSharp />
              <p>{formatedJobs.location}</p>
            </div>
            <div className="jobLocation">
              <IoBagHandle />
              <p>{formatedJobs.employmentType}</p>
            </div>
          </div>
          <div>
            <p>{formatedJobs.packagePerAnnum}</p>
          </div>
        </div>
        <div className="line">
          <hr width={500} />
        </div>
        <div className="description">
          <h2>Description</h2>
          <p className="des">{formatedJobs.jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}

export default JobCard
