package tju.vis.po;

import java.util.ArrayList;
import java.util.HashSet;

/**
 * Created by gmy on 15/12/14.
 */
public class Paper {
    private String name;
    private ArrayList<String> reference;
    private HashSet<String> keyword;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ArrayList<String> getReference() {
        return reference;
    }

    public void setReference(ArrayList<String> reference) {
        this.reference = reference;
    }


    public HashSet<String> getKeyword() {
        return keyword;
    }

    public void setKeyword(HashSet<String> keyword) {
        this.keyword = keyword;
    }

}
