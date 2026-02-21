package com.intern.hrms.service.game;

import com.intern.hrms.dto.game.request.GameBookingRequestDTO;
import com.intern.hrms.dto.game.response.GameBookingResponseDTO;
import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.game.*;
import com.intern.hrms.enums.BookingStatusEnum;
import com.intern.hrms.repository.EmployeeRepository;
import com.intern.hrms.repository.game.*;
import com.intern.hrms.utility.MailSend;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class GameBookingService {

    private final GameCycleRepository gameCycleRepository;
    private final GameRepository gameRepository;
    private final GameBookingRepository gameBookingRepository;
    private final EmployeeRepository employeeRepository;
    private final EmployeeInterestRepository employeeInterestRepository;
    private final ModelMapper modelMapper;
    private final MailSend mailSend;
    private final WaitingQueueRepository waitingQueueRepository;

    public GameBookingService(GameCycleRepository gameCycleRepository, GameRepository gameRepository, GameBookingRepository gameBookingRepository, EmployeeRepository employeeRepository, EmployeeInterestRepository employeeInterestRepository, ModelMapper modelMapper, MailSend mailSend, WaitingQueueRepository waitingQueueRepository) {
        this.gameCycleRepository = gameCycleRepository;
        this.gameRepository = gameRepository;
        this.gameBookingRepository = gameBookingRepository;
        this.employeeRepository = employeeRepository;
        this.employeeInterestRepository = employeeInterestRepository;
        this.modelMapper = modelMapper;
        this.mailSend = mailSend;
        this.waitingQueueRepository = waitingQueueRepository;
    }

    private void validateSlotTime(Game game, LocalTime time){
        LocalTime start = game.getStartTime();
        boolean valid = false;
        while (!start.plusMinutes(game.getDurationInMinute()).isAfter(game.getEndTime())){
            if(start.equals(time)){
                valid = true;
                break;
            }
            start = start.plusMinutes(game.getDurationInMinute());
        }
        if(!valid){
            throw new RuntimeException("Invalid slot time");
        }
    }

    private double calculatePriority(GameBooking booking) {
        List<Employee> participants = new ArrayList<>(booking.getPlayers());
        participants.add(booking.getBookedBy());
        int total = 0;
        for (Employee emp : participants) {
            EmployeeInterest interest = employeeInterestRepository.findByGameAndEmployee(booking.getGame(), emp);
            total += interest.getSlotPlayed();
        }
        if(total == 0.0)
            return total;
        return (double) total / participants.size();
    }

    public GameBooking createGameBooking(GameBookingRequestDTO dto){
        Game game = gameRepository.findById(dto.getGame()).orElseThrow();
        if(dto.getPlayers().isEmpty() || dto.getPlayers().size() > game.getMaxPlayer()){
            throw new RuntimeException("Invalid No. of player");
        }
        GameCycle gameCycle = gameCycleRepository.findById(dto.getGameCycle()).orElseThrow();

        if(dto.getBookingDate().isBefore(gameCycle.getStartDate()) || dto.getBookingDate().isAfter(gameCycle.getEndDate())){
            throw new RuntimeException("Booking date is outside cycle");
        }
        validateSlotTime(game, dto.getBookingTime());

        Employee bookedBy = employeeRepository.findById(dto.getBookedBy()).orElseThrow();
        List<Employee> players = employeeRepository.findAllById(dto.getPlayers());
        List<Employee> allParticipants = new ArrayList<>(players);
        allParticipants.add(bookedBy);

        List<String> emails = new ArrayList<>();
        for(Employee participant : allParticipants){
            boolean alreadyBooked = gameBookingRepository.existsByBookingDateAndPlayersContainsAndBookingStatus(dto.getBookingDate(), participant, BookingStatusEnum.Booked);
            emails.add(participant.getEmail());
            if(alreadyBooked){
                throw  new RuntimeException("Employee already booked for today, Name "+participant.getFirstName()+" "+participant.getLastName());
            }
        }

        boolean allZero = true;
        for (Employee emp : allParticipants){
            EmployeeInterest interest = employeeInterestRepository.findByGameAndEmployee(game,emp);
            if(interest.getSlotPlayed() > 0){
                allZero = false;
                break;
            }
        }
        boolean exist = gameBookingRepository.existsByGameAndBookingDateAndBookingTimeAndBookingStatus(game, dto.getBookingDate(), dto.getBookingTime(), BookingStatusEnum.Booked);
        GameBooking booking = new GameBooking(dto.getBookingDate(),dto.getBookingTime(),bookedBy,game,players,gameCycle);
        if(allZero && !exist){
            booking.setBookingStatus(BookingStatusEnum.Booked);
            for(Employee emp : allParticipants){
                EmployeeInterest interest = employeeInterestRepository.findByGameAndEmployee(game, emp);
                interest.setSlotPlayed(interest.getSlotPlayed()+1);
                employeeInterestRepository.save(interest);
            }
        }else{
            booking.setBookingStatus(BookingStatusEnum.Waiting);
        }
//        System.out.println(emails.size());
        mailSend.sendMail(emails,null,
                "Booking Confirmation",
                "Your Booking Request received successfully\n"
                + "Game : " + booking.getGame().getGameName()
                +"\nBooking Date : " + booking.getBookingDate()
                + "\nTime : " + booking.getBookingTime()
                +"\nStatus : " + booking.getBookingStatus()
                +"\nBooked By : " + bookedBy.getFirstName() + " " + bookedBy.getLastName()
                ,null);
        booking =  gameBookingRepository.save(booking);
        if(booking.getBookingStatus() == BookingStatusEnum.Waiting)
            waitingQueueRepository.save(new WaitingQueue(booking));
        return booking;
    }
    public void allotFromWaiting(Game game, LocalDate date, LocalTime time) {

        List<GameBooking> waitingBooking = gameBookingRepository.findByGameAndBookingDateAndBookingTimeAndBookingStatus(game,date,LocalTime.of(10, 0, 0),BookingStatusEnum.Waiting);
        if(waitingBooking.isEmpty()){
            return;
        }
        GameBooking selected =  waitingBooking.stream().min(Comparator.comparingDouble(this::calculatePriority)).get();
        selected.setBookingStatus(BookingStatusEnum.Booked);

        List<Employee> participants =  new ArrayList<>(selected.getPlayers());
        participants.add(selected.getBookedBy());
        List<String> emails = new ArrayList<>();
        for (Employee emp : participants) {
            emails.add(emp.getEmail());
            EmployeeInterest interest = employeeInterestRepository.findByGameAndEmployee(game, emp);
            interest.setSlotPlayed(interest.getSlotPlayed() + 1);
        }
        gameBookingRepository.save(selected);
        mailSend.sendMail(emails,null,
                "Booking Status Updated",
                "Your Slot Booked successfully\n"
                        + "Game : " + selected.getGame().getGameName()
                        +"\nBooking Date : " + selected.getBookingDate()
                        + "\nTime : " + selected.getBookingTime()
                        +"\nStatus : " + selected.getBookingStatus()
                        +"\nBooked By : " + selected.getBookedBy().getFirstName() + " " + selected.getBookedBy().getLastName()
                ,null);
    }

    public void cancelBooking(int bookingId) {
        GameBooking booking = gameBookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        if (booking.getBookingStatus() == BookingStatusEnum.Cancelled) {
            throw new RuntimeException("Already cancelled");
        }
        if (booking.getBookingStatus() == BookingStatusEnum.Waiting) {
            booking.setBookingStatus(BookingStatusEnum.Cancelled);
            gameBookingRepository.save(booking);
            return;
        }

        if (booking.getBookingStatus() == BookingStatusEnum.Booked) {
            List<Employee> participants = new ArrayList<>(booking.getPlayers());
            participants.add(booking.getBookedBy());
            for (Employee emp : participants) {
                EmployeeInterest interest = employeeInterestRepository
                        .findByGameAndEmployee(booking.getGame(), emp);
                interest.setSlotPlayed(interest.getSlotPlayed() - 1);
                employeeInterestRepository.save(interest);
            }
            booking.setBookingStatus(BookingStatusEnum.Cancelled);
            gameBookingRepository.save(booking);

            allotFromWaiting(
                    booking.getGame(),
                    booking.getBookingDate(),
                    booking.getBookingTime()
            );
        }
    }

    public List<GameBookingResponseDTO> getTodayBookedForGame(int gameId) {
        Game game = gameRepository.findById(gameId).orElseThrow();
        GameCycle cycle = gameCycleRepository.findByGameAndIsActive(game, true).orElseThrow();
        List<GameBooking> bookings = gameBookingRepository.findByGameAndGameCycleAndBookingDateAndBookingStatus(game, cycle, LocalDate.now(), BookingStatusEnum.Booked);
        return modelMapper.map(bookings, new TypeToken<List<GameBookingResponseDTO>>(){}.getType());
    }

    public List<GameBookingResponseDTO> getEmployeeBookingsInCurrentCycle(int gameId, int employeeId) {
        GameCycle cycle = gameCycleRepository.findByGame_GameIdAndIsActive(gameId, true);
        Employee employee = employeeRepository.findById(employeeId).orElseThrow();
        List<GameBooking> bookings = gameBookingRepository.findEmployeeGameBookingInCycle(gameId,employee, cycle.getGameCycleId());
        return modelMapper.map(bookings, new TypeToken<List<GameBookingResponseDTO>>(){}.getType());
    }

    public Page<GameBookingResponseDTO> getAllEmployeeBookings(int employeeId, int page, int size) {
        Employee employee = employeeRepository.findById(employeeId).orElseThrow();
        Pageable pageable = PageRequest.of(page, size, Sort.by("bookingDate").descending());
        Page<GameBooking> bookings = gameBookingRepository.findAllEmployeeGameBooking(employee, pageable);
        return bookings.map(booking -> modelMapper.map(booking, GameBookingResponseDTO.class));
    }
}




