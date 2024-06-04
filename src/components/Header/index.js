import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  const logoBtn = () => {
    const {history} = props
    history.replace('/')
  }

  return (
    <nav className="navContainer">
      <button type="button" className="logoBtn" onClick={logoBtn}>
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          height={40}
          width={120}
        />
      </button>
      <ul className="navList">
        <Link className="link" to="/">
          <li>Home</li>
        </Link>
        <Link className="link" to="/jobs">
          <li>Jobs</li>
        </Link>
      </ul>
      <button className="btnLogout" onClick={onLogout} type="button">
        Logout
      </button>
    </nav>
  )
}
export default withRouter(Header)
