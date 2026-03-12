package com.hotel.springbackend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hotel.springbackend.exception.InvalidBookingRequestException;
import com.hotel.springbackend.model.BookedRoom;
import com.hotel.springbackend.model.Room;
import com.hotel.springbackend.repository.BookingRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingService implements IBookingService {

	private final BookingRepository bookingRepository;
	private final IRoomService roomService;
	
	@Override
	public List<BookedRoom> getAllBookingsByRoomId(Long roomId) {
		return bookingRepository.findByRoomId(roomId);
	}

	@Override
	public List<BookedRoom> getAllBookings() {
		return bookingRepository.findAll();
	}

	@Override
	public BookedRoom findByBookingConfirmationCode(String confirmationCode) {
		return bookingRepository.findByBookingConfirmationCode(confirmationCode);
	}

	@Override
	public String saveBooking(Long roomId, BookedRoom bookingRequest) {
		if(bookingRequest.getCheckOutDate().isBefore(bookingRequest.getCheckInDate())) {
			throw new InvalidBookingRequestException("Check-in date must come before Check-out date.");
		}
		bookingRequest.setTotalNumOfGuests(
		        bookingRequest.getNumberOfAdults() +
		        bookingRequest.getNumberOfChildren()
		);
		Room room = roomService.getRoomById(roomId).get();
		List<BookedRoom> existingBookings = room.getBookings();
		boolean roomIsAvailable = roomIsAvailable(bookingRequest,existingBookings);
		if (roomIsAvailable) {
			room.addBooking(bookingRequest);
			bookingRepository.save(bookingRequest);
		}
		else {
			throw new InvalidBookingRequestException("Sorry, This room is not available for selected dates.");
		}
		return bookingRequest.getBookingConfirmationCode();
	}
	
	@Override
	public void cancelBooking(Long bookingId) {
		bookingRepository.deleteById(bookingId);
	}
	
	
	private boolean roomIsAvailable(BookedRoom request, List<BookedRoom> bookings) {
	    for (BookedRoom existing : bookings) {
	        boolean overlap =
	            request.getCheckInDate().isBefore(existing.getCheckOutDate()) &&
	            existing.getCheckInDate().isBefore(request.getCheckOutDate());
	        if (overlap) {
	            return false;
	        }
	    }
	    return true;
	}


}
