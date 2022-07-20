package mothballs.randistrictr.model;

import javax.persistence.*;
import java.io.Serializable;

@Entity
public class CensusBlock implements Serializable {
    @Id
    private String geoID20;

    private String state;
    private String congressionalDistrict;

    private String adjacentCongressionalDistrict;

    private int districtingPlan;
    private String precinctID;

    private String geometryType;

    private String congressionalDistrictID;

    @Lob
    private String geometry;

    public int getDistrictingPlan() {
        return districtingPlan;
    }

    public void setDistrictingPlan(int districtingPlan) {
        this.districtingPlan = districtingPlan;
    }

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumns({
            @JoinColumn(name="geoID20", referencedColumnName="geoID20")
    })
    private Population population;

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

    public String getPrecinctID() {
        return precinctID;
    }

    public void setPrecinctID(String precinctID) {
        this.precinctID = precinctID;
    }

    public String getGeometryType() {
        return geometryType;
    }

    public void setGeometryType(String geometryType) {
        this.geometryType = geometryType;
    }

    public String getGeometry() {
        return geometry;
    }

    public void setGeometry(String geometry) {
        this.geometry = geometry;
    }

    public Population getPopulation() {
        return population;
    }

    public void setPopulation(Population population) {
        this.population = population;
    }

    public String getAdjacentCongressionalDistrict() {
        return adjacentCongressionalDistrict;
    }

    public void setAdjacentCongressionalDistrict(String adjacentCongressionalDistrict) {
        this.adjacentCongressionalDistrict = adjacentCongressionalDistrict;
    }

    public String getCongressionalDistrictID() {
        return congressionalDistrictID;
    }

    public void setCongressionalDistrictID(String congressionalDistrictID) {
        this.congressionalDistrictID = congressionalDistrictID;
    }
}