import { ToastContainer } from 'react-toastify'
import Home from './pages/home'
import { Route, Routes } from "react-router-dom"
import NotFound404 from './pages/not_found_404'
import Cart from './pages/cart'
import PageLayout from './components/layouts/page_layout'
import Product from './pages/product'
import SearchResult from './pages/search_result'
import LoadingApp from './components/loading_app'
import Auth from './pages/auth'
import Account from './pages/account'
import { BrowserRouter } from "react-router-dom"
import ProtectedRoute from './utils/protected_route'

function App() {
  return (
    <div id="React-App">
      <BrowserRouter>
        <Routes>

          <Route path='/' element={<PageLayout />}>

            <Route index element={<Home />} />

            <Route
              path='/cart'
              element={<ProtectedRoute> <Cart /> </ProtectedRoute>}
            />

            <Route path='/productDetail/:productId' element={<Product />} />

            <Route path='/search/:keyword' element={<SearchResult />} />

            <Route
              path='/account/*'
              element={<ProtectedRoute> <Account /> </ProtectedRoute>}
            />

          </Route>

          <Route path='/auth/*' element={<Auth />} />

          <Route path='*' element={<NotFound404 />} />

        </Routes>
      </BrowserRouter>

      <ToastContainer limit={3} autoClose={2000} pauseOnHover={true} draggable={false} />
      <LoadingApp />
    </div>
  )
}

export default App
