package mothballs.randistrictr.model;

import javax.persistence.*;

@Entity
public class DistrictingPlanStatistics {

    @Id
    private String id;
    private String state;
    private int redistrictNumber;

    private double efficiencyGap;
    private double totalPopulationScore;
    private double cvapPopulationScore;
    private double vapPopulationScore;

    private int numCongressionalDistricts;

    private int numRepublicanCongressionalDistricts;
    private int numDemocraticCongressionalDistricts;

    public DistrictingPlanStatistics(){}

    public DistrictingPlanStatistics(String id, String state, int redistrictNumber,
                                     double efficiencyGap, double totalPopulationScore, double cvapPopulationScore,
                                     double vapPopulationScore, int numCongressionalDistricts, int numRepublicanCongressionalDistricts,
                                     int numDemocraticCongressionalDistricts) {
        this.id = id;
        this.state = state;
        this.redistrictNumber = redistrictNumber;
        this.efficiencyGap = efficiencyGap;
        this.totalPopulationScore = totalPopulationScore;
        this.cvapPopulationScore = cvapPopulationScore;
        this.vapPopulationScore = vapPopulationScore;
        this.numCongressionalDistricts = numCongressionalDistricts;
        this.numRepublicanCongressionalDistricts = numRepublicanCongressionalDistricts;
        this.numDemocraticCongressionalDistricts = numDemocraticCongressionalDistricts;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public int getRedistrictNumber() {
        return redistrictNumber;
    }

    public void setRedistrictNumber(int redistrictNumber) {
        this.redistrictNumber = redistrictNumber;
    }

    public double getEfficiencyGap() {
        return efficiencyGap;
    }

    public void setEfficiencyGap(double efficiencyGap) {
        this.efficiencyGap = efficiencyGap;
    }

    public double getTotalPopulationScore() {
        return totalPopulationScore;
    }

    public void setTotalPopulationScore(double totalPopulationScore) {
        this.totalPopulationScore = totalPopulationScore;
    }

    public double getCvapPopulationScore() {
        return cvapPopulationScore;
    }

    public void setCvapPopulationScore(double cvapPopulationScore) {
        this.cvapPopulationScore = cvapPopulationScore;
    }

    public double getVapPopulationScore() {
        return vapPopulationScore;
    }

    public void setVapPopulationScore(double vapPopulationScore) {
        this.vapPopulationScore = vapPopulationScore;
    }

    public int getNumCongressionalDistricts() {
        return numCongressionalDistricts;
    }

    public void setNumCongressionalDistricts(int numCongressionalDistricts) {
        this.numCongressionalDistricts = numCongressionalDistricts;
    }

    public int getNumRepublicanCongressionalDistricts() {
        return numRepublicanCongressionalDistricts;
    }

    public void setNumRepublicanCongressionalDistricts(int numRepublicanCongressionalDistricts) {
        this.numRepublicanCongressionalDistricts = numRepublicanCongressionalDistricts;
    }

    public int getNumDemocraticCongressionalDistricts() {
        return numDemocraticCongressionalDistricts;
    }

    public void setNumDemocraticCongressionalDistricts(int numDemocraticCongressionalDistricts) {
        this.numDemocraticCongressionalDistricts = numDemocraticCongressionalDistricts;
    }

    public DistrictingPlanStatistics deepClone() {
        return new DistrictingPlanStatistics(id, state, redistrictNumber, efficiencyGap,
                totalPopulationScore, cvapPopulationScore, vapPopulationScore, numCongressionalDistricts,
                numRepublicanCongressionalDistricts, numDemocraticCongressionalDistricts);
    }
}