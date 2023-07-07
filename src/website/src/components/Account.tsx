import logo from '../assets/mynt.png'

export function Account() {
  return (
    <>
      <h1 style={{ color: 'white' }}>This will be the home page</h1>
      <a href='/api/auth'>Login</a>
      <img src={logo} />
    </>
  )
}
