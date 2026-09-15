package com.studysync.controller;

import com.studysync.service.StatisticsService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin(origins = "*")
public class StatisticsController {

    private final StatisticsService statisticsService;

    public StatisticsController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    @GetMapping("/{userId}")
    public Map<String, Object> getStatistics(@PathVariable Long userId) {

        return statisticsService.getUserStatistics(userId);

    }

}