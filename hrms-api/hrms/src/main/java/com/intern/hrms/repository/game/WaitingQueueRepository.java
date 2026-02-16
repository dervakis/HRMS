package com.intern.hrms.repository.game;

import com.intern.hrms.entity.game.WaitingQueue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WaitingQueueRepository extends JpaRepository<WaitingQueue, Integer> {
}
