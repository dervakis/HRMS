package com.intern.hrms.repository.game;

import com.intern.hrms.entity.game.GameSlotBooking;
import com.intern.hrms.enums.SlotBookingStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface GameSlotBookingRepository extends JpaRepository<GameSlotBooking, Integer> {
    List<GameSlotBooking> findByBookingDateAndGameSlot_GameSlotId(LocalDate bookingDate, int gameSlotGameSlotId);

    List<GameSlotBooking> findByBookingDateAndGameSlot_GameSlotIdAndBookingStatus(LocalDate bookingDate, int gameSlotGameSlotId, SlotBookingStatusEnum bookingStatus);
}
