import './App.css';
import './styles.css';
import Logo from './SVG/Asset22.svg'
import React , { memo, useEffect, useState } from "react";
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route, Link, useParams} from "react-router-dom";
import { Navigate } from 'react-router-dom';

const Fetch = React.memo((props) => {
  const [count , setCount] = useState({})

  useEffect(() => {
    fetch(`http://localhost:8001/${props.mail}/${props.password}`, {mode:'cors'})
      .then(request => request.json())
      .then(data => setCount(data))
      .catch(e => setCount(undefined))
  }, [props.page , props.link])
  return(props.children(count))
})

function signup(){
  const mail = document.querySelector('#email').value
  const pass = document.querySelector("#password").value
  fetch(`http://localhost:8001/${mail}/${pass}`, {mode:'cors'})
}

function signin(){
  let status
  const mail = document.querySelector('#email').value
  const pass = document.querySelector("#password").value
  fetch(`http://localhost:8001/signin/${mail}/${pass}`, {mode:'cors'})
    .then(req => req.json())
    .then(data => status = data)
    .catch(e => status = undefined)
  alert(status)
  if(status !== false){
    return <Navigate replace to="/profile" />
  }else{
    console.log(status)
  }
}

function Signup(){

  return(
    <>
    <header>
    </header>

    <main className="container">
      <form className="form__reg">
            <img src={Logo} alt="logo"></img>
            <input name="login" type="text" placeholder="Ваш логин" id="email"></input>
            <input name="password" type="password" placeholder="Ваш пароль" id="password"></input>
            <button onClick={signup}>Регестрация</button>
            <Link to="/signin">Войти</Link>
      </form>
    </main>

    <footer>
    </footer>
    </>
  )
}

function Signin(){

  return(
    <>
    <header>
    </header>

    <main className="container">
      <form className="form__reg">
            <img src={Logo} alt="logo"></img>
            <input name="login" type="text" placeholder="Ваш логин" id="email"></input>
            <input name="password" type="password" placeholder="Ваш пароль" id="password"></input>
            <button onClick={signin}>Войти</button>
            <Link to="/signup">Регестрация</Link>
      </form>
    </main>

    <footer>
    </footer>
    </>
  )
}

function Profile(){
  return(
    <>
      <h1>Template</h1>
    </>
  )
}

function App(){
  return(
    <Routes>
      <Route path="signup" element={<Signup />} />
      <Route path="signin"element={<Signin />} />
      <Route path="profile"element={<Profile />} /> 
    </Routes>
  )
} 

ReactDOM.render(
  <BrowserRouter>
    <App /> 
  </BrowserRouter>

, document.body)


export default App;
