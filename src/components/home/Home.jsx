import React from 'react'
import { Link } from "react-router-dom"
import MainHeader from '../layout/MainHeader'
import HotelService from '../common/HotelService'
import Parallax from '../common/Parallax'
import RoomCarousel from '../common/RoomCarousel'

function Home() {
  return (
        <section>
          <MainHeader/>
          <section className="container">
            <RoomCarousel />
            <Parallax />
            <RoomCarousel />
            <HotelService />
          </section>
        </section>
  )
}

export default Home
