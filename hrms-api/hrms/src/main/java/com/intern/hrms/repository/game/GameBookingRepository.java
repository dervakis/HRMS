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

//    @Query("SELECT gb FROM GameBooking gb WHERE gb.game = :game AND gb.bookingDate = :date AND FUNCTION('CONVERT', gb.bookingTime, 'TIME') = :time AND gb.bookingStatus = :status")
//    List<GameBooking> findByGameAndBookingDateAndBookingTimeAndBookingStatus(
//            @Param("game") Game game,
//            @Param("date") LocalDate date,
//            @Param("time") LocalTime time,
//            @Param("status") BookingStatusEnum status);

    boolean existsByBookingDateAndPlayersContainsAndBookingStatus(LocalDate bookingDate, Employee players, BookingStatusEnum bookingStatus);

    List<GameBooking> findByGameAndGameCycleAndBookingDateAndBookingStatus(Game game, GameCycle gameCycle, LocalDate bookingDate, BookingStatusEnum bookingStatus);

    @Query("select b from GameBooking b where b.game.gameId = :gameId and b.gameCycle.gameCycleId = :gameCycleId and b.bookedBy = :employee or :employee member of b.players")
    List<GameBooking> findEmployeeGameBookingInCycle(@Param("gameId") Integer gameId, @Param("employee") Employee employee, @Param("gameCycleId") Integer gameCycleId );

    @Query("select b from GameBooking b where (b.bookedBy = :employee or :employee member of b.players)")
    Page<GameBooking> findAllEmployeeGameBooking(@Param("employee") Employee employee, Pageable pageable);

    boolean existsByGameAndBookingDateAndBookingTimeAndBookingStatus(Game game, LocalDate bookingDate, LocalTime bookingTime, BookingStatusEnum bookingStatus);
}
