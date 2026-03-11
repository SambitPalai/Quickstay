import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { Form, FormControl } from 'react-bootstrap'
import { getRoomById, bookRoom } from '../utils/ApiFunctions'
import BookingSummary from './BookingSummary'


const BookingForm = () => {
    const[isValidated, setIsValidated] = useState(false)
    const[isSubmitted, setIsSubmitted] = useState(false)
    const[errorMessage, setErrorMessage] = useState("")
    const[roomPrice, setRoomPrice] = useState(0)
    const[booking, setBooking] = useState({
        guestFullName: "",
        guestEmail: "",
        checkInDate: "",
        checkOutDate: "",
        numberOfAdults: "",
        numberOfChildren: ""
    })
    
    const[roomInfo, setRoomInfo] = useState({
            photo: "",
            roomType: "",
            roomPrice: ""
        })
    
    const{roomId} = useParams()

    const navigate = useNavigate()
    
    const handleInputChange = (e) => {
        const{name, value} = e.target 
        setBooking({...booking, [name]: value})
        setErrorMessage("")
    }

    const getRoomPriceById = async(roomId) =>{
        try {
            const response = await getRoomById(roomId)
            setRoomPrice(response.roomPrice)
        } catch (error) {
            throw new Error(error)
        }
    }

    useEffect(() =>{
        getRoomPriceById(roomId)
    }, [roomId])
    
    const calculatePayment = () =>{
        const checkInDate = moment(booking.checkInDate)
        const checkOutDate = moment(booking.checkOutDate)
        const diffInDays = checkOutDate.diff(checkInDate, "days")
        const price = roomPrice ? roomPrice : 0
        return diffInDays * price
    }
    
    const today = moment().format("YYYY-MM-DD")

    const isGuestCountValid = () => {
        const adultCount = parseInt(booking.numberOfAdults)
        const childrenCount = parseInt(booking.numberOfChildren)
        const totalCount = adultCount + childrenCount
        return totalCount>=1 && adultCount>=1
    }

    const isCheckOutDateValid = () => {
        if(!moment(booking.checkOutDate).isSameOrAfter(moment(booking.checkInDate))){
           setErrorMessage("Check-out date must come after Check-in date")
           return false 
        }
        else{
            setErrorMessage("")
            return true
        }
    }

    const handleSubmit = (e) =>{
        e.preventDefault()
        const form = e.currentTarget
        if(form.checkValidity() === false || !isGuestCountValid() || !isCheckOutDateValid()){
            e.stopPropagation()
        }
        else{
            setIsSubmitted(true)
        }
        setIsValidated(true)
    }

    const handleBooking = async() => {
        const adults = booking.numberOfAdults
        const children = booking.numberOfChildren
        const bookingPayload = {
            ...booking,
            checkInDate: moment(booking.checkInDate).format("DD-MM-YYYY"),
            checkOutDate: moment(booking.checkOutDate).format("DD-MM-YYYY"),
            numberOfAdults: parseInt(adults, 10),
            numberOfChildren: parseInt(children, 10)
        }
        try {
            const confirmationCode = await bookRoom(roomId, bookingPayload)
            setIsSubmitted(true)
            navigate("/booking-success", {state:{message: confirmationCode}})
        } 
        catch (error) {
            navigate("/booking-success", {state:{error: error.message}})
        }
    }

  return (
    <>
    <div className='container mb-5 booking-page'>
        <div className='row'>
            <div className='col-md-6'>
                <div className='card card-body mt-5 booking-card'>
                    <h4 className='card-title mb-3'>Reserve Room</h4>
                    <Form noValidate validated={isValidated} onSubmit={handleSubmit}>
                        <Form.Group className='mb-3'>
                            <Form.Label htmlFor="guestFullName"> Full Name :</Form.Label>
                            <FormControl
                                required
                                type="text"
                                id="guestFullName"
                                name="guestFullName"
                                value={booking.guestFullName}
                                placeholder="Enter your full name"
                                    onChange={handleInputChange} 
                                />   
                            <Form.Control.Feedback type="invalid">
                                Please enter your fullname
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Label htmlFor="guestEmail">Email :</Form.Label>
                            <FormControl
                                required
                                type="email"
                                id="guestEmail"
                                name="guestEmail"
                                value={booking.guestEmail}
                                placeholder="Enter your email"
                                    onChange={handleInputChange} 
                                />   
                            <Form.Control.Feedback type="invalid">
                                Please enter your email address
                            </Form.Control.Feedback>
                        </Form.Group>
                        <fieldset className='booking-fieldset'>
                            <legend className='booking-legend'>Lodging Period</legend>
                            <div className='row'>
                                <div className='col-6'>
                                    <Form.Label htmlFor="checkInDate">Check-In date :</Form.Label>
                                    <FormControl
                                        required
                                        type="date"
                                        id="checkInDate"
                                        name="checkInDate"
                                        value={booking.checkInDate}
                                        placeholder="Check-in date"
                                        min={today}
                                            onChange={handleInputChange} 
                                        />   
                                    <Form.Control.Feedback type="invalid">
                                        Please select your check-in date
                                    </Form.Control.Feedback>
                                </div>
                                <div className='col-6'>
                                    <Form.Label htmlFor="checkOutDate">Check-Out date :</Form.Label>
                                    <FormControl
                                        required
                                        type="date"
                                        id="checkOutDate"
                                        name="checkOutDate"
                                        value={booking.checkOutDate}
                                        placeholder="Check-out date"
                                        min={booking.checkInDate || today}
                                            onChange={handleInputChange} 
                                        />   
                                    <Form.Control.Feedback type="invalid">
                                        Please select your check-out date
                                    </Form.Control.Feedback>
                                </div>
                                {errorMessage && <p className='error-message text-danger'>{errorMessage}</p>}
                            </div>
                        </fieldset>
                        <fieldset className='booking-fieldset'>
                            <legend className='booking-legend'>Number of guests</legend>
                            <div className='row'>
                                <div className='col-6'>
                                    <Form.Label htmlFor="numberOfAdults">Number of adults :</Form.Label>
                                    <FormControl
                                        required
                                        type="number"
                                        id="numberOfAdults"
                                        name="numberOfAdults"
                                        value={booking.numberOfAdults}
                                        placeholder="0"
                                        min={1}
                                        onChange={handleInputChange} 
                                        />   
                                    <Form.Control.Feedback type="invalid">
                                        Please enter number of adults 
                                    </Form.Control.Feedback>
                                </div>
                                 <div className='col-6'>
                                    <Form.Label htmlFor="numberOfChildren">Number of children :</Form.Label>
                                    <FormControl
                                        required
                                        type="number"
                                        id="numberOfChildren"
                                        name="numberOfChildren"
                                        value={booking.numberOfChildren}
                                        placeholder="0"
                                        onChange={handleInputChange} 
                                        />   
                                </div>
                            </div>    
                        </fieldset>
                        <div className='form-group mt-2 mb-2'>
                            <button className='btn btn-hotel' type="submit">Continue</button>
                        </div>
                    </Form>
                </div>
            </div>
            <div className='col-md-6'>
                {isSubmitted && (
                    <BookingSummary 
                        booking={booking}
                        payment={calculatePayment()}
                        isFormValid={isValidated}
                        onConfirm={handleBooking}/>
                )}
            </div>
        </div>
    </div>
    </>
    
  )
}

export default BookingForm
