package mothballs.randistrictr.model;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
public class State implements Serializable {

    @Id
    String state;
    String stateNumber;

    @OneToMany
    @JoinColumns({
            @JoinColumn(name="state", referencedColumnName="stateNumber")
    })
    List<DistrictingPlan> districtingPlans;

    @OneToMany
    @JoinColumns({
            @JoinColumn(name="state", referencedColumnName="stateNumber")
    })
    List<BoxAndWhisker> boxAndWhiskerPlots;

    @OneToOne
    @JoinColumns({
            @JoinColumn(name="state", referencedColumnName="geoID20")
    })
    Population population;

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getStateNumber() {
        return stateNumber;
    }

    public void setStateNumber(String stateNumber) {
        this.stateNumber = stateNumber;
    }

    public List<DistrictingPlan> getDistrictingPlans() {
        return districtingPlans;
    }

    public void setDistrictingPlans(List<DistrictingPlan> districtingPlans) {
        this.districtingPlans = districtingPlans;
    }

    public Population getPopulation() {
        return population;
    }

    public void setPopulation(Population population) {
        this.population = population;
    }
}
