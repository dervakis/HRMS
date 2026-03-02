package com.intern.hrms.repository.game;

import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.game.Game;
import com.intern.hrms.entity.game.GameBooking;
import com.intern.hrms.entity.game.GameCycle;
import com.intern.hrms.enums.BookingStatusEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface GameBookingRepository extends JpaRepository<GameBooking, Integer> {
    List<GameBooking> findByGameAndBookingDateAndBookingTimeAndBookingStatus(Game game, LocalDate bookingDate, LocalTime bookingTime, BookingStatusEnum bookingStatus);

    List<GameBooking> findByBookingDateAndBookingTimeAndBookingStatus(LocalDate bookingDate, LocalTime bookingTime, BookingStatusEnum bookingStatus);
    boolean existsByGameAndBookingDateAndPlayersContainsAndBookingStatus(Game game,LocalDate bookingDate, Employee players, BookingStatusEnum bookingStatus);

    List<GameBooking> findByGameAndGameCycleAndBookingDateAndBookingStatus(Game game, GameCycle gameCycle, LocalDate bookingDate, BookingStatusEnum bookingStatus);

    @Query("select b from GameBooking b where b.game.gameId = :gameId and b.gameCycle.gameCycleId = :gameCycleId and (  b.bookedBy = :employee or :employee member of b.players )")
    List<GameBooking> findEmployeeGameBookingInCycle(@Param("gameId") Integer gameId, @Param("employee") Employee employee, @Param("gameCycleId") Integer gameCycleId );

    @Query("select b from GameBooking b where (b.bookedBy = :employee or :employee member of b.players)")
    Page<GameBooking> findAllEmployeeGameBooking(@Param("employee") Employee employee, Pageable pageable);

    boolean existsByGameAndBookingDateAndBookingTimeAndBookingStatus(Game game, LocalDate bookingDate, LocalTime bookingTime, BookingStatusEnum bookingStatus);

//    @Query("select count(gb) > 0 from GameBooking gb where gb.bookingDate = :bookingDate and gb.bookingTime = :bookingTime and gb.game.durationInMinute and gb.bookingStatus != BookingStatusEnum.Cancelled and (gb.bookedBy = :employee or :employee member of gb.players)")
//    boolean existsOverlappingBooking(LocalDate bookingDate,int durationInMinute ,LocalTime end, Employee employee);
    @Query(value = "select count(*) from game_booking gb join game g on gb.fk_game_id = g.pk_game_id\n" +
            "\twhere gb.booking_date = :bookingDate and gb.booking_status != 2 \n" +
            "\tand (gb.booking_time < :ending and DATEADD(minute, g.duration_in_minute, gb.booking_time) > :starting)\n" +
            "\tand ( gb.fk_booked_by_employee_id = :employeeId or exists (select 1 from player_in_slot pis where pis.fk_game_slot_booking_id = gb.pk_game_booking_id and pis.fk_employee_id = :employeeId) )",
            nativeQuery = true)
    int existsOverlappingBooking(@Param("bookingDate") LocalDate bookingDate, @Param("starting") LocalTime starting, @Param("ending") LocalTime ending, @Param("employeeId") Integer employeeId );

}
