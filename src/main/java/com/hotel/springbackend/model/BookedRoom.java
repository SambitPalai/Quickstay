package com.hotel.springbackend.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import com.fasterxml.jackson.annotation.JsonFormat;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BookedRoom {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long bookingId;
	
	@Column(name = "check_in")
	@JsonFormat(pattern = "dd-MM-yyyy")  
	private LocalDate checkInDate;
	
	@Column(name = "check_out")
	@JsonFormat(pattern = "dd-MM-yyyy")  
	private LocalDate checkOutDate;
	
	@Column(name = "guest_fullName")
	private String guestFullName;
	
	@Column(name = "guest_email")
	private String guestEmail;
	
	@Column(name = "adults")
	private int numberOfAdults;
	
	@Column(name = "children")
	private int numberOfChildren;
	
	@Column(name = "total_guests")
	private int totalNumOfGuests;
	
	@Column(name = "confirmation_code")
	private String bookingConfirmationCode;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "booking_status")
	private BookingStatus bookingStatus = BookingStatus.CONFIRMED;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "room_Id")
	private Room room;
	
	
	public void calculateTotalGuests() {
		this.totalNumOfGuests = this.numberOfAdults + this.numberOfChildren;
	}
	
	public void setBookingConfirmationCode(String bookingConfirmationCode) {
		this.bookingConfirmationCode = bookingConfirmationCode;	
	}

	public void setRoom(Room room) {
		this.room = room;
	}
	
	public enum BookingStatus {
	    PENDING, CONFIRMED, CANCELLED
	}
	
	
}
