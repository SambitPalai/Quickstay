import axios from "axios"

export const api = axios.create({
    baseURL :"https://localhost:9192"
})

// ------------ Attach JWT token to every request automatically ------------

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// --------Auth Functions -------------

/* Register a new user */
export async function registerUser(userData) {
    try {
        const response = await api.post("/auth/register", userData)
        return response.data
    } catch (error) {
        throw new Error(error.response?.data || "Registration failed")
    }
}

/* Login an existing user */
export async function loginUser(credentials) {
    try {
        const response = await api.post("/auth/login", credentials)
        return response.data   // { token, email, role, name }
    } catch (error) {
        throw new Error(error.response?.data || "Login failed")
    }
}

// ------- Room Functions -------------------- 

/* This function adds a new room to the database  */
export async function addRoom(photo, roomType, roomPrice) {

    const formData = new FormData()
    formData.append("photo",photo)
    formData.append("roomType",roomType)
    formData.append("roomPrice",roomPrice)

    await api.post("/rooms/add/new-room", formData)
    return true
}

/* This function gets all Room Types (room-types) */
export async function getRoomTypes() {

    try{
        const response =  await api.get("/rooms/room/types")
        return response.data
    }
    catch(error){
        throw new Error("Error fetching room types")   
    }

}

/* This function gets all Rooms from the database */
export async function getAllRooms() {
    try{
        const result = await api.get("/rooms/all-rooms")
        return result.data
    }
    catch(error){
        throw new Error("Error fetching rooms")
    }
}

/* This function deletes room by its Id  */
export async function deleteRoom(roomId) {
    try {
        const result = await api.delete(`/rooms/delete/room/${roomId}`)
        return result.data
    } catch (error) {
        throw new Error(`Error deleting room ${error.message}`)
    }
}

/* This function updates room */ 
export async function updateRoom(roomId, roomData) {
    const formData = roomData instanceof FormData ? roomData : (() => {
        const data = new FormData()
        data.append("roomType", roomData.roomType)
        data.append("roomPrice", roomData.roomPrice)
        if (roomData.photo instanceof File) {
            data.append("photo", roomData.photo)
        }
        return data
    })()
    const response = await api.put(`/rooms/update/${roomId}`, formData)
    return response.data
}

/* This function gets a room by the ID */
export async function getRoomById(roomId) {
    try {
        const result = await api.get(`/rooms/room/${roomId}`)
        return result.data
    } catch (error) {
        throw new Error(`Error fetching room ${error.message}`)        
    }
}

// ----- Booking Functions -------------------  

/* This function saves a new booking in the database */
export async function bookRoom(roomId, booking) {
    try {
        const response = await api.post(`/bookings/room/${roomId}/booking`,booking)
        return response.data
    } 
    catch (error) {
        if(error.response && error.response.data){
            throw new Error(error.response.data)
        }
        else{
            throw new Error(`Error booking room : ${error.message}`)
        }
    }
} 

/* this function gets all the booking from the database */
export async function getAllBookings() {
    try {
        const result = await api.get(`/bookings/all-bookings`)
        return result.data
    }
    catch (error) {
        throw new Error(`Error fetching bookings : ${error.message}`)
    }
}

/* This function gets booking by the confirmation code */
export async function getBookingByConfirmationCode(confirmationCode){
    try{
        const result = await api.get(`/bookings/confirmation/${confirmationCode}`)
        return result.data
    }
    catch(error){
        if(error.response && error.response.data){
            throw new Error(error.response.data)
        }
        else{
            throw new Error(`Error finding booking : ${error.message}`)
        }
    }
}

/* This function cancels booking */
export async function cancelBooking(bookingId){
    try{
        const result = await api.delete(`/bookings/booking/${bookingId}/delete`)
        return result.data
    }
    catch(error){
        throw new Error(`Error cancelling booking : ${error.message}`)
    }
}

/* Get logged-in user's own bookings — no email in URL */
export async function getMyBookings() {
    try {
        const result = await api.get("/bookings/my-bookings")
        return result.data
    } catch (error) {
        throw new Error(`Error fetching your bookings: ${error.message}`)
    }
}

/* Admin only — get bookings for any user by email */
export async function getUserBookingsByEmail(email) {
    try {
        const result = await api.get("/bookings/user", {
            params: { email }    // sends as ?email=user@quickstay.com
        })
        return result.data
    } catch (error) {
        throw new Error(`Error fetching bookings: ${error.message}`)
    }
}