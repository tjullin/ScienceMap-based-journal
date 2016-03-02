package tju.vis.po;

import java.util.ArrayList;

/**
 * Created by gmy on 15/12/14.
 */
public class Magazine {
    private ArrayList<Volume> volumes;
    private String name;

    public ArrayList<Volume> getVolumes() {
        return volumes;
    }

    public void setVolumes(ArrayList<Volume> volumes) {
        this.volumes = volumes;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
