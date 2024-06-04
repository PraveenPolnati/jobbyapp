import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class LoginForm extends Component {
  state = {username: '', password: '', isError: false, msg: ''}

  onSubmitSuccess = token => {
    Cookies.set('jwt_token', token, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  onSubmitFailure = msg => {
    this.setState({isError: true, msg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  userNameEnter = event => {
    this.setState({username: event.target.value})
  }

  passwordEnter = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {username, password, isError, msg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="LoginContainer">
        <form className="loginForm">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            height={40}
            width={120}
          />
          <ul className="inputList">
            <li className="inputItem">
              <label htmlFor="userName">USERNAME</label>
              <br />
              <input
                type="text"
                className="input"
                id="userName"
                placeholder="Username"
                onChange={this.userNameEnter}
                value={username}
              />
            </li>
            <br />
            <li className="inputItem">
              <label htmlFor="password">PASSWORD</label>
              <br />
              <input
                type="password"
                className="input"
                id="password"
                placeholder="Password"
                onChange={this.passwordEnter}
                value={password}
              />
            </li>
          </ul>
          <button
            className="btnSubmit"
            type="submit"
            onClick={this.onSubmitForm}
          >
            Login
          </button>
          {isError && <p className="error">*{msg}</p>}
        </form>
      </div>
    )
  }
}

export default LoginForm
