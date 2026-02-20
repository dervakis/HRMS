package com.intern.hrms.repository.game;

import com.intern.hrms.entity.game.EmployeeInterest;
import com.intern.hrms.entity.game.Game;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeInterestRepository extends JpaRepository<EmployeeInterest, Integer> {
    List<EmployeeInterest> findAllByGame(Game game);

    void deleteByEmployee_EmployeeIdAndGame_GameId(int employeeEmployeeId, int gameGameId);

    List<EmployeeInterest> getEmployeeInterestByEmployee_EmployeeId(int employeeEmployeeId);

    List<EmployeeInterest> findAllByGame_GameId(int gameGameId);

    EmployeeInterest getEmployeeInterestByEmployee_EmployeeIdAndGame_GameId(int employeeEmployeeId, int gameGameId);
}
