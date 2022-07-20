package mothballs.randistrictr.service;

import mothballs.randistrictr.model.*;
import mothballs.randistrictr.enums.Basis;
import mothballs.randistrictr.enums.PopulationMeasure;
import mothballs.randistrictr.repository.*;
import org.hibernate.Hibernate;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileReader;
import java.util.*;

@Service
public class DistrictService {
    final String ENACTED_DISTRICTING_PLAN = "00";
    @Autowired
    DistrictRepository districtRepository;
    @Autowired
    PopulationRepository populationRepository;
    @Autowired
    StateRepository stateRepository;
    @Autowired
    CensusBlockRepository censusBlockRepository;
    @Autowired
    DissolvingService dissolvingService;
    @Autowired
    DistrictingPlanStatisticsRepository districtingPlanStatisticsRepository;
    @Autowired
    BoxAndWhiskerRepository boxAndWhiskerRepository;

    private State currentState;
    private DistrictingPlan currentDistrictingPlan;
    private DistrictingPlan seawulfDistrictingPlan;

    private boolean hasInitializedCensusBlocks;
    private JSONObject enactedDistrictPlan;
    PopulationMeasure populationMeasure = PopulationMeasure.TOTAL;

    public Population getPopulation(String id) {
        return populationRepository.findByGeoID20(id);
    }

    public void selectState(String state) {
        hasInitializedCensusBlocks = false;
        this.currentState = stateRepository.findStateByState(state);
        Hibernate.initialize(this.currentState.getDistrictingPlans());
    }

    public JSONObject getEnactedDistricting() {
        return readEnactedDistrictingPlan(currentState.getState());
    }

    public List<DistrictingPlanStatistics> getAllDistrictingPlanStatistics() {
        if(this.currentState.getDistrictingPlans() != null) {
            Collections.sort(this.currentState.getDistrictingPlans(), (a, b) -> a.getDistrictingPlan() - b.getDistrictingPlan());
        }

        List<DistrictingPlanStatistics> districtingPlanStatistics = new ArrayList<>();
        for(DistrictingPlan districtingPlan : currentState.getDistrictingPlans()) {
            districtingPlanStatistics.add(districtingPlan.getDistrictingPlanStatistics());
        }
        return districtingPlanStatistics;
    }

    public JSONObject getDistrictingPlan(int districtPlanNumber) {
        if(!hasInitializedCensusBlocks || (this.currentDistrictingPlan != null && districtPlanNumber != this.currentDistrictingPlan.getDistrictingPlan())){
            List<DistrictingPlan> districtPlans = currentState.getDistrictingPlans();
            int i = 0;
            for(; i < districtPlans.size(); i++) {
                if(districtPlanNumber == districtPlans.get(i).getDistrictingPlan()) {
                    break;
                }
            }
            districtPlanNumber = i;
            this.currentDistrictingPlan = stateRepository.findStateByState(this.currentState.getState()).getDistrictingPlans().get(districtPlanNumber);
            this.seawulfDistrictingPlan = stateRepository.findStateByState(this.currentState.getState()).getDistrictingPlans().get(districtPlanNumber);
            hasInitializedCensusBlocks = true;
        }

        return dissolvingService.getDistrictingJSON(this.currentDistrictingPlan);
    }

    public DistrictingPlanStatistics getDistrictingPlanStatistics() {
        return currentDistrictingPlan.getDistrictingPlanStatistics();
    }

    public DistrictingPlanStatistics getEnactedDistrictingPlanStatistics() {
        return districtingPlanStatisticsRepository.findById(ENACTED_DISTRICTING_PLAN + currentState.getStateNumber());
    }

    public DistrictingPlan getCurrentDistrictingPlan() {
        return currentDistrictingPlan;
    }

    public void setCurrentDistrictingPlan(DistrictingPlan currentDistrictingPlan) {
        this.currentDistrictingPlan = currentDistrictingPlan;
    }


    public JSONObject readEnactedDistrictingPlan(String stateName) {
        try {
            JSONParser jsonParser = new JSONParser();
            FileReader reader = new FileReader("src/main/java/mothballs/randistrictr/constants/" + stateName.toLowerCase() + "_congressional_districts.json");
            Object obj = jsonParser.parse(reader);
            JSONObject jsonObject = (JSONObject) obj;
            enactedDistrictPlan = jsonObject;
            return jsonObject;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public void resetState() {
        this.hasInitializedCensusBlocks = false;
        this.currentState = null;
        this.currentDistrictingPlan = null;
        this.seawulfDistrictingPlan = null;
        this.enactedDistrictPlan = null;
    }

    public JSONObject getBoxAndWhisker(Basis basis) {
        if(currentState == null) {
            return null;
        }
        return getBoxAndWhiskerJSONData(boxAndWhiskerRepository.findByBasisAndState(basis, currentState.getStateNumber()), basis);
    }

    public JSONObject getBoxAndWhiskerJSONData(BoxAndWhisker boxAndWhisker, Basis basis) {

        List<BoxPlot> allBoxes = boxAndWhisker.getBoxes();
        Collections.sort(allBoxes, (a, b) -> a.getWhiskerPosition() - b.getWhiskerPosition());
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("type", "boxPlot");
        jsonObject.put("name", "box");
        JSONArray boxPlotArray = new JSONArray();
        for(BoxPlot boxPlot : allBoxes) {
            JSONObject box = new JSONObject();
            box.put("x", boxPlot.getWhiskerPosition());
            JSONArray numbers = new JSONArray();
            numbers.add(boxPlot.getMinimum());
            numbers.add(boxPlot.getFirstQuartile());
            numbers.add(boxPlot.getMedian());
            numbers.add(boxPlot.getThirdQuartile());
            numbers.add(boxPlot.getMaximum());
            box.put("y", numbers);
            boxPlotArray.add(box);
        }

        jsonObject.put("data", boxPlotArray);
        JSONArray componentArray = new JSONArray();
        componentArray.add(jsonObject);
        if(enactedDistrictPlan != null) {
            componentArray.add(getEnactedDistrictingOverlay(basis));
        }
        if(currentDistrictingPlan != null) {
            componentArray.add(getCurrentDistrictingOverlay(basis));
        }
        if(seawulfDistrictingPlan != null) {
            componentArray.add(getSeawulfDistrictingOverlay(basis));
        }

        JSONObject retJSONObject = new JSONObject();
        retJSONObject.put("series", componentArray);
        return retJSONObject;
    }

    public State getCurrentState() {
        return currentState;
    }

    public void setCurrentState(State currentState) {
        this.currentState = currentState;
    }

    public PopulationMeasure getPopulationMeasure() {
        return populationMeasure;
    }

    public void setPopulationMeasure(PopulationMeasure populationMeasure) {
        this.populationMeasure = populationMeasure;
    }

    public JSONObject getCurrentDistrictingOverlay(Basis basis) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("type", "scatter");
        jsonObject.put("name", "current districting plan");
        JSONArray scatterArray = new JSONArray();
        List<District> allDistricts = currentDistrictingPlan.getDistricts();
        Collections.sort(allDistricts, (a, b) -> (int)(a.getPopulation().getPopulationByBasis(basis) - b.getPopulation().getPopulationByBasis(basis)));
        int position = 1;
        for(District district : allDistricts) {
            JSONObject box = new JSONObject();
            box.put("x", position);
            box.put("y", district.getPopulation().getPopulationByBasis(basis));
            position++;
            scatterArray.add(box);
        }
        jsonObject.put("data", scatterArray);
        return jsonObject;
    }

    public JSONObject getSeawulfDistrictingOverlay(Basis basis) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("type", "scatter");
        jsonObject.put("name", "seawulf districting plan");
        JSONArray scatterArray = new JSONArray();
        List<District> allDistricts = seawulfDistrictingPlan.getDistricts();
        Collections.sort(allDistricts, (a, b) -> (int)(a.getPopulation().getPopulationByBasis(basis) - b.getPopulation().getPopulationByBasis(basis)));
        int position = 1;
        for(District district : allDistricts) {
            JSONObject box = new JSONObject();
            box.put("x", position);
            box.put("y", district.getPopulation().getPopulationByBasis(basis));
            position++;
            scatterArray.add(box);
        }
        jsonObject.put("data", scatterArray);
        return jsonObject;
    }

    public JSONObject getEnactedDistrictingOverlay(Basis basis) {
        JSONArray districts = (JSONArray)enactedDistrictPlan.get("features");
        List<Long> currPops = new ArrayList<>();
        for(int i = 0; i < districts.size(); i++) {
            JSONObject properties = (JSONObject)((JSONObject)(districts.get(i))).get("properties");
            if(properties.get(basis.name()) instanceof Double) {
                double temp = (Double)properties.get(basis.name());
                currPops.add((long)(temp));
            }
            else if(properties.get(basis.name()) instanceof Long) {
                currPops.add((long)(properties.get(basis.name())));
            }
            else {
                currPops.add((long)0);
            }
        }
        Collections.sort(currPops);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("type", "scatter");
        jsonObject.put("name", "enacted districting plan");
        JSONArray scatterArray = new JSONArray();
        int position = 1;
        for(Long pop : currPops) {
            JSONObject box = new JSONObject();
            box.put("x", position);
            box.put("y", pop);
            position++;
            scatterArray.add(box);
        }
        jsonObject.put("data", scatterArray);
        return jsonObject;
    }
}