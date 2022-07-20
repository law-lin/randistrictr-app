package mothballs.randistrictr.model;

import mothballs.randistrictr.enums.Basis;
import mothballs.randistrictr.enums.PopulationMeasure;

import javax.persistence.*;

@Entity
public class Population {

    @Id
    private String geoID20;

    private double totalTotalPopulation;
    private double totalWhitePopulation;
    private double totalBlackPopulation;
    private double totalHispanicPopulation;
    private double totalAmericanIndianPopulation;
    private double totalAsianPopulation;
    private double totalHawaiianPopulation;
    private double totalOtherPopulation;

    private double vapTotalPopulation;
    private double vapWhitePopulation;
    private double vapBlackPopulation;
    private double vapHispanicPopulation;
    private double vapAmericanIndianPopulation;
    private double vapAsianPopulation;
    private double vapHawaiianPopulation;
    private double vapOtherPopulation;

    private double cvapTotalPopulation;
    private double cvapWhitePopulation;
    private double cvapBlackPopulation;
    private double cvapHispanicPopulation;
    private double cvapAmericanIndianPopulation;
    private double cvapAsianPopulation;
    private double cvapHawaiianPopulation;
    private double cvapOtherPopulation;

    private double democratVoters;
    private double republicanVoters;
    private double otherVoters;

    @Transient
    private double[] allPopulations;

    public double getTotalTotalPopulation() {
        return totalTotalPopulation;
    }

    public void setTotalTotalPopulation(double totalTotalPopulation) {
        this.totalTotalPopulation = totalTotalPopulation;
    }

    public double getTotalWhitePopulation() {
        return totalWhitePopulation;
    }

    public void setTotalWhitePopulation(double totalWhitePopulation) {
        this.totalWhitePopulation = totalWhitePopulation;
    }

    public double getTotalBlackPopulation() {
        return totalBlackPopulation;
    }

    public void setTotalBlackPopulation(double totalBlackPopulation) {
        this.totalBlackPopulation = totalBlackPopulation;
    }

    public double getTotalHispanicPopulation() {
        return totalHispanicPopulation;
    }

    public void setTotalHispanicPopulation(double totalHispanicPopulation) {
        this.totalHispanicPopulation = totalHispanicPopulation;
    }

    public double getTotalAmericanIndianPopulation() {
        return totalAmericanIndianPopulation;
    }

    public void setTotalAmericanIndianPopulation(double totalAmericanIndianPopulation) {
        this.totalAmericanIndianPopulation = totalAmericanIndianPopulation;
    }

    public double getTotalAsianPopulation() {
        return totalAsianPopulation;
    }

    public void setTotalAsianPopulation(double totalAsianPopulation) {
        this.totalAsianPopulation = totalAsianPopulation;
    }

    public double getTotalHawaiianPopulation() {
        return totalHawaiianPopulation;
    }

    public void setTotalHawaiianPopulation(double totalHawaiianPopulation) {
        this.totalHawaiianPopulation = totalHawaiianPopulation;
    }

    public double getTotalOtherPopulation() {
        return totalOtherPopulation;
    }

    public void setTotalOtherPopulation(double totalOtherPopulation) {
        this.totalOtherPopulation = totalOtherPopulation;
    }

    public double getVapTotalPopulation() {
        return vapTotalPopulation;
    }

    public void setVapTotalPopulation(double vapTotalPopulation) {
        this.vapTotalPopulation = vapTotalPopulation;
    }

    public double getVapWhitePopulation() {
        return vapWhitePopulation;
    }

    public void setVapWhitePopulation(double vapWhitePopulation) {
        this.vapWhitePopulation = vapWhitePopulation;
    }

    public double getVapBlackPopulation() {
        return vapBlackPopulation;
    }

    public void setVapBlackPopulation(double vapBlackPopulation) {
        this.vapBlackPopulation = vapBlackPopulation;
    }

    public double getVapHispanicPopulation() {
        return vapHispanicPopulation;
    }

    public void setVapHispanicPopulation(double vapHispanicPopulation) {
        this.vapHispanicPopulation = vapHispanicPopulation;
    }

    public double getVapAmericanIndianPopulation() {
        return vapAmericanIndianPopulation;
    }

    public void setVapAmericanIndianPopulation(double vapAmericanIndianPopulation) {
        this.vapAmericanIndianPopulation = vapAmericanIndianPopulation;
    }

    public double getVapAsianPopulation() {
        return vapAsianPopulation;
    }

    public void setVapAsianPopulation(double vapAsianPopulation) {
        this.vapAsianPopulation = vapAsianPopulation;
    }

    public double getVapHawaiianPopulation() {
        return vapHawaiianPopulation;
    }

    public void setVapHawaiianPopulation(double vapHawaiianPopulation) {
        this.vapHawaiianPopulation = vapHawaiianPopulation;
    }

    public double getVapOtherPopulation() {
        return vapOtherPopulation;
    }

    public void setVapOtherPopulation(double vapOtherPopulation) {
        this.vapOtherPopulation = vapOtherPopulation;
    }

    public double getCvapTotalPopulation() {
        return cvapTotalPopulation;
    }

    public void setCvapTotalPopulation(double cvapTotalPopulation) {
        this.cvapTotalPopulation = cvapTotalPopulation;
    }

    public double getCvapWhitePopulation() {
        return cvapWhitePopulation;
    }

    public void setCvapWhitePopulation(double cvapWhitePopulation) {
        this.cvapWhitePopulation = cvapWhitePopulation;
    }

    public double getCvapBlackPopulation() {
        return cvapBlackPopulation;
    }

    public void setCvapBlackPopulation(double cvapBlackPopulation) {
        this.cvapBlackPopulation = cvapBlackPopulation;
    }

    public double getCvapHispanicPopulation() {
        return cvapHispanicPopulation;
    }

    public void setCvapHispanicPopulation(double cvapHispanicPopulation) {
        this.cvapHispanicPopulation = cvapHispanicPopulation;
    }

    public double getCvapAmericanIndianPopulation() {
        return cvapAmericanIndianPopulation;
    }

    public void setCvapAmericanIndianPopulation(double cvapAmericanIndianPopulation) {
        this.cvapAmericanIndianPopulation = cvapAmericanIndianPopulation;
    }

    public double getCvapAsianPopulation() {
        return cvapAsianPopulation;
    }

    public void setCvapAsianPopulation(double cvapAsianPopulation) {
        this.cvapAsianPopulation = cvapAsianPopulation;
    }

    public double getCvapHawaiianPopulation() {
        return cvapHawaiianPopulation;
    }

    public void setCvapHawaiianPopulation(double cvapHawaiianPopulation) {
        this.cvapHawaiianPopulation = cvapHawaiianPopulation;
    }

    public double getCvapOtherPopulation() {
        return cvapOtherPopulation;
    }

    public void setCvapOtherPopulation(double cvapOtherPopulation) {
        this.cvapOtherPopulation = cvapOtherPopulation;
    }

    public double getDemocratVoters() {
        return democratVoters;
    }

    public void setDemocratVoters(double democratVoters) {
        this.democratVoters = democratVoters;
    }

    public double getRepublicanVoters() {
        return republicanVoters;
    }

    public void setRepublicanVoters(double republicanVoters) {
        this.republicanVoters = republicanVoters;
    }

    public double getOtherVoters() {
        return otherVoters;
    }

    public void setOtherVoters(double otherVoters) {
        this.otherVoters = otherVoters;
    }

    public String getGeoID20() {
        return geoID20;
    }

    public void setGeoID20(String geoID20) {
        this.geoID20 = geoID20;
    }

    public void addPopulation(Population population) {
        totalTotalPopulation += population.getTotalTotalPopulation();
        totalWhitePopulation += population.getTotalWhitePopulation();
        totalBlackPopulation += population.getTotalBlackPopulation();
        totalHispanicPopulation += population.getTotalHispanicPopulation();
        totalAmericanIndianPopulation += population.getTotalAmericanIndianPopulation();
        totalAsianPopulation += population.getTotalAsianPopulation();
        totalHawaiianPopulation += population.getTotalHawaiianPopulation();
        totalOtherPopulation += population.getTotalOtherPopulation();

        vapTotalPopulation += population.getVapTotalPopulation();
        vapWhitePopulation += population.getVapWhitePopulation();
        vapBlackPopulation += population.getVapBlackPopulation();
        vapHispanicPopulation += population.getVapHispanicPopulation();
        vapAmericanIndianPopulation += population.getVapAmericanIndianPopulation();
        vapAsianPopulation += population.getVapAsianPopulation();
        vapHawaiianPopulation += population.getVapHawaiianPopulation();
        vapOtherPopulation += population.getVapOtherPopulation();

        cvapTotalPopulation += population.getCvapTotalPopulation();
        cvapWhitePopulation += population.getCvapWhitePopulation();
        cvapBlackPopulation += population.getCvapBlackPopulation();
        cvapHispanicPopulation += population.getCvapHispanicPopulation();
        cvapAmericanIndianPopulation += population.getCvapAmericanIndianPopulation();
        cvapAsianPopulation += population.getCvapAsianPopulation();
        cvapHawaiianPopulation += population.getCvapHawaiianPopulation();
        cvapOtherPopulation += population.getCvapOtherPopulation();

        democratVoters += population.getDemocratVoters();
        republicanVoters += population.getRepublicanVoters();
        otherVoters += population.getOtherVoters();

    }

    public void removePopulation(Population population) {
        totalTotalPopulation -= population.getTotalTotalPopulation();
        totalWhitePopulation -= population.getTotalWhitePopulation();
        totalBlackPopulation -= population.getTotalBlackPopulation();
        totalHispanicPopulation -= population.getTotalHispanicPopulation();
        totalAmericanIndianPopulation -= population.getTotalAmericanIndianPopulation();
        totalAsianPopulation -= population.getTotalAsianPopulation();
        totalHawaiianPopulation -= population.getTotalHawaiianPopulation();
        totalOtherPopulation -= population.getTotalOtherPopulation();

        vapTotalPopulation -= population.getVapTotalPopulation();
        vapWhitePopulation -= population.getVapWhitePopulation();
        vapBlackPopulation -= population.getVapBlackPopulation();
        vapHispanicPopulation -= population.getVapHispanicPopulation();
        vapAmericanIndianPopulation -= population.getVapAmericanIndianPopulation();
        vapAsianPopulation -= population.getVapAsianPopulation();
        vapHawaiianPopulation -= population.getVapHawaiianPopulation();
        vapOtherPopulation -= population.getVapOtherPopulation();

        cvapTotalPopulation -= population.getCvapTotalPopulation();
        cvapWhitePopulation -= population.getCvapWhitePopulation();
        cvapBlackPopulation -= population.getCvapBlackPopulation();
        cvapHispanicPopulation -= population.getCvapHispanicPopulation();
        cvapAmericanIndianPopulation -= population.getCvapAmericanIndianPopulation();
        cvapAsianPopulation -= population.getCvapAsianPopulation();
        cvapHawaiianPopulation -= population.getCvapHawaiianPopulation();
        cvapOtherPopulation -= population.getCvapOtherPopulation();

        democratVoters -= population.getDemocratVoters();
        republicanVoters -= population.getRepublicanVoters();
        otherVoters -= population.getOtherVoters();
    }

    @Override
    public String toString() {
        return String.format(
                "Population[geoID=%s, cvapTotalPopulation='%.2f', totalTotalPopulation='%.2f', totalAsianPopulation='%.2f', totalWhitePopulation='%.2f']",
                geoID20, cvapTotalPopulation, totalTotalPopulation, totalAsianPopulation, totalWhitePopulation);
    }

    public double[] getAllPopulations() {
        return allPopulations;
    }

    public void setAllPopulations(double[] allPopulations) {
        this.allPopulations = allPopulations;
    }

    public double getPopulationByBasis(Basis basis) {
        if(allPopulations == null) {
            allPopulations = new double[]{totalTotalPopulation, totalWhitePopulation, totalBlackPopulation, totalHispanicPopulation,
                    totalAmericanIndianPopulation, totalAsianPopulation, totalHawaiianPopulation, totalOtherPopulation, vapTotalPopulation,
                    vapWhitePopulation, vapBlackPopulation, vapHispanicPopulation, vapAmericanIndianPopulation, vapAsianPopulation,
                    vapHawaiianPopulation, vapOtherPopulation, cvapTotalPopulation, cvapWhitePopulation, cvapBlackPopulation,
                    cvapHispanicPopulation, cvapAmericanIndianPopulation, cvapAsianPopulation, cvapHawaiianPopulation, cvapOtherPopulation,
                    democratVoters, republicanVoters, otherVoters};
        }

        return allPopulations[basis.ordinal()];
    }
}
