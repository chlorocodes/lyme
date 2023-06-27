import {
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter
} from 'react-router-dom'
import { Home } from './Home'
import { Page404 } from './Page404'

function Root() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='*' element={<Page404 />} />
    </Routes>
  )
}

const router = createBrowserRouter([{ path: '*', Component: Root }])

export function Router() {
  return <RouterProvider router={router} />
}
