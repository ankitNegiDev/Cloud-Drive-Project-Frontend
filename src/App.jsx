
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './component/Layout/Layout.jsx'
import Home from './pages/Home.jsx'

function App() {

    return (
        <>
            {/* <h1 className='bg-amber-300 m-10 text-center text-xl'>this is setup to test the tailwind</h1> */}
            <Routes>
                <Route path='/' element={<Layout/>}>
                    {/* these will render inside <Outlet /> */}
                    <Route index element={<Home />} />
                    {/* <Route path="about" element={<AboutPage />} /> */}
                    {/* <Route path="contact" element={<ContactPage />} /> */}
                    {/* <Route path="login" element={<LoginPage />} />  */}
                </Route>
            </Routes>
        </>
    )
}

export default App
