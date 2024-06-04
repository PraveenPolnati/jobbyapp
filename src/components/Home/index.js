import {Component} from 'react'
import Header from '../Header'
import './index.css'

class Home extends Component {
  findJobClick = () => {
    const {history} = this.props
    history.replace('/jobs')
  }

  render() {
    return (
      <div className="homeCard">
        <Header />
        <div className="homeContainer">
          <h1 className="homeHeading">Find The Job That Fits Your Life</h1>
          <p className="homeDescription">
            Millions of people are searching for jobs, salary information,
            company reviews. Find the job that fits your abilities and
            potential.
          </p>
          <button
            onClick={this.findJobClick}
            className="findJobBtn"
            type="button"
          >
            Find Jobs
          </button>
        </div>
      </div>
    )
  }
}

export default Home
