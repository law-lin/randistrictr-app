package mothballs.randistrictr.model;

import mothballs.randistrictr.enums.PopulationMeasure;

import javax.persistence.*;
import java.io.Serializable;
import java.util.*;

@Entity
public class District implements Serializable {

    @Id
    private String geoID20;

    private String state;
    private String congressionalDistrict;
    private int districtingPlan;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumns({
            @JoinColumn(name="geoID20", referencedColumnName="geoID20")
    })
    private Population population;

    @OneToMany
    @JoinColumns({
            @JoinColumn(name="congressionalDistrictID", referencedColumnName="geoID20")
    })
    private Set<CensusBlock> censusBlocks;

    @Transient
    private boolean initializedCensusBlocks = false;

    @Transient
    private List<District> adjacentDistricts;

    @Transient
    private Map<District, Set<CensusBlock>> movableCensusBlocks;

    public String getGeoID20() {
        return geoID20;
    }

    public void setGeoID20(String geoID20) {
        this.geoID20 = geoID20;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCongressionalDistrict() {
        return congressionalDistrict;
    }

    public void setCongressionalDistrict(String congressionalDistrict) {
        this.congressionalDistrict = congressionalDistrict;
    }

    public int getDistrictingPlan() {
        return districtingPlan;
    }

    public void setDistrictingPlan(int districtingPlan) {
        this.districtingPlan = districtingPlan;
    }

    public List<District> getAdjacentDistricts() {
        return adjacentDistricts;
    }

    public void setAdjacentDistricts(List<District> adjacentDistricts) {
        this.adjacentDistricts = adjacentDistricts;
    }

    public Set<CensusBlock> getCensusBlocks() {
        return censusBlocks;
    }

    public void setCensusBlocks(Set<CensusBlock> censusBlocks) {
        this.censusBlocks = censusBlocks;
    }

    public Map<District, Set<CensusBlock>> getMovableCensusBlocks() {
        return movableCensusBlocks;
    }

    public void setMovableCensusBlocks(Map<District, Set<CensusBlock>> movableCensusBlocks) {
        this.movableCensusBlocks = movableCensusBlocks;
    }

    public Population getPopulation() {
        return population;
    }

    public void setPopulation(Population population) {
        this.population = population;
    }

    public boolean isInitializedCensusBlocks() {
        return initializedCensusBlocks;
    }

    public void setInitializedCensusBlocks(boolean initializedCensusBlocks) {
        this.initializedCensusBlocks = initializedCensusBlocks;
    }

    public CensusBlock selectCensusBlock(PopulationMeasure populationMeasure) {
        District randomNeighboringDistrict = selectAdjacentDistrict(populationMeasure);
        if(randomNeighboringDistrict == null) return null;
        Set<CensusBlock> selectedCensusBlocks = movableCensusBlocks.get(randomNeighboringDistrict);
        if(selectedCensusBlocks == null || selectedCensusBlocks.size() == 0) return null;
        int randomIndex = (int)Math.random() * selectedCensusBlocks.size();
        int iter = 0;
        for(CensusBlock cB : selectedCensusBlocks) {
            if(iter == randomIndex) {
                return cB;
            }
            iter++;
        }
        return null;
    }

    public District selectAdjacentDistrict(PopulationMeasure populationMeasure) {
//        District smallestDistrict = null;
//        double smallestPop = Double.MAX_VALUE;
//        for(District district: adjacentDistricts) {
//            if(populationMeasure == PopulationMeasure.TOTAL) {
//                if(district.getPopulation().getTotalTotalPopulation() < smallestPop) {
//                    smallestDistrict = district;
//                    smallestPop = district.getPopulation().getTotalTotalPopulation();
//                }
//            }
//            else if(populationMeasure == PopulationMeasure.CVAP) {
//                if(district.getPopulation().getCvapTotalPopulation() < smallestPop) {
//                    smallestDistrict = district;
//                    smallestPop = district.getPopulation().getCvapTotalPopulation();
//                }
//            }
//            else if(populationMeasure == PopulationMeasure.VAP) {
//                if(district.getPopulation().getVapTotalPopulation() < smallestPop) {
//                    smallestDistrict = district;
//                    smallestPop = district.getPopulation().getVapTotalPopulation();
//                }
//            }
//        }
//        return smallestDistrict;
        if(adjacentDistricts.size() == 0) return null;
        return adjacentDistricts.get((int)Math.random() * adjacentDistricts.size());
    }

    public void addCensusBlock(CensusBlock censusBlock, District neighboringDistrict) {
        if(!movableCensusBlocks.containsKey(neighboringDistrict)) {
            movableCensusBlocks.put(neighboringDistrict, new HashSet<>());
            adjacentDistricts.add(neighboringDistrict);
        }
        movableCensusBlocks.get(neighboringDistrict).add(censusBlock);

        censusBlocks.add(censusBlock);
        population.addPopulation(censusBlock.getPopulation());
    }

    public void removeCensusBlock(CensusBlock censusBlock, District neighboringDistrict) {
        if(movableCensusBlocks.containsKey(neighboringDistrict) && movableCensusBlocks.get(neighboringDistrict).contains(censusBlock)) {
            movableCensusBlocks.get(neighboringDistrict).remove(censusBlock);

            if(movableCensusBlocks.get(neighboringDistrict).size() == 0) {
                movableCensusBlocks.remove(neighboringDistrict);
                adjacentDistricts.remove(neighboringDistrict);
            }
        }

        if(censusBlocks.contains(censusBlock)) {
            censusBlocks.remove(censusBlock);
        }
        population.removePopulation(censusBlock.getPopulation());
    }

    public boolean dataStructuresInstantiated() {
        return adjacentDistricts != null && movableCensusBlocks != null;
    }
}