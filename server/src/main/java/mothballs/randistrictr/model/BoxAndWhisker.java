package mothballs.randistrictr.model;

import mothballs.randistrictr.enums.Basis;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
public class BoxAndWhisker implements Serializable {

    @Id
    String id;

    private Basis basis;
    private String state;

    @OneToMany
    @JoinColumns({
            @JoinColumn(name="state", referencedColumnName="state"),
            @JoinColumn(name="basis", referencedColumnName="basis")
    })
    List<BoxPlot> boxes;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Basis getBasis() {
        return basis;
    }

    public void setBasis(Basis basis) {
        this.basis = basis;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public List<BoxPlot> getBoxes() {
        return boxes;
    }

    public void setBoxes(List<BoxPlot> boxes) {
        this.boxes = boxes;
    }
}