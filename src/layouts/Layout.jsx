import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import SearchBar from '../pages/SearchBar'


const Layout = ({ children }) => {
  return (
    <div className = "flex flex-col min-h-screen">
      <Header />
      {window.location.pathname === "/" && <Hero />}

      {children}
     
      <Footer/>
    </div>
  )
}

export default Layout
