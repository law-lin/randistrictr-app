package mothballs.randistrictr.controller;

import mothballs.randistrictr.model.DistrictingPlan;
import mothballs.randistrictr.model.DistrictingPlanStatistics;
import mothballs.randistrictr.service.AlgorithmService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RequestMapping("randistrictr/algorithm")
@RestController
public class AlgorithmController {

    @Autowired
    AlgorithmService algorithmService;

    @PostMapping("/run")
    public String runAlgorithm(@RequestParam(value = "maxPopDiff") double maxPopDiff) {
        algorithmService.startImprovedDistrictingPlanAlgorithm(maxPopDiff);
        return "Success";
    }

    @PostMapping("/stop")
    public void stopAlgorithm() {
        algorithmService.stopAlgorithm();
    }

    @GetMapping("/getCurrentDistrictingPlan")
    public JSONObject getCurrentDistrictingPlan() {
        return algorithmService.getCurrentDistrictingPlan();
    }

    @GetMapping("/getCurrentDistrictingStatistics")
    public DistrictingPlanStatistics getCurrentDistrictingStatistics() {
        return algorithmService.getCurrentDistrictingStatistics();
    }

    @GetMapping("/getCurrentNumberOfIterations")
    public int getCurrentNumberOfIterations() {
        return algorithmService.getCurrentNumberOfIterations();
    }

    @GetMapping("/getAlgorithmStatus")
    public String checkAlgorithmStatus() {
        return algorithmService.checkAlgorithmStatus();
    }
}
