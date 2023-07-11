import logo from '../assets/lyme.png'

export function Home() {
  return (
    <>
      <h1 style={{ color: 'white' }}>This will be the home page</h1>
      <a href='/api/auth'>Login</a>
      <img src={logo} />
    </>
  )
}
