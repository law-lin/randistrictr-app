package mothballs.randistrictr.model;

import mothballs.randistrictr.enums.Basis;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.io.Serializable;

@Entity
public class BoxPlot implements Serializable {

    @Id
    private String id;

    private int whiskerPosition;
    private Basis basis;
    private String state;
    private double minimum;
    private double firstQuartile;
    private double median;
    private double thirdQuartile;
    private double maximum;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getWhiskerPosition() {
        return whiskerPosition;
    }

    public void setWhiskerPosition(int whiskerPosition) {
        this.whiskerPosition = whiskerPosition;
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

    public double getMinimum() {
        return minimum;
    }

    public void setMinimum(double minimum) {
        this.minimum = minimum;
    }

    public double getFirstQuartile() {
        return firstQuartile;
    }

    public void setFirstQuartile(double firstQuartile) {
        this.firstQuartile = firstQuartile;
    }

    public double getMedian() {
        return median;
    }

    public void setMedian(double median) {
        this.median = median;
    }

    public double getThirdQuartile() {
        return thirdQuartile;
    }

    public void setThirdQuartile(double thirdQuartile) {
        this.thirdQuartile = thirdQuartile;
    }

    public double getMaximum() {
        return maximum;
    }

    public void setMaximum(double maximum) {
        this.maximum = maximum;
    }
}