package tju.vis.po;

import tju.vis.po.Issue;

import java.util.ArrayList;

/**
 * Created by gmy on 15/12/14.
 */
public class Volume {
    private ArrayList<Issue> issues;
    private String year;

    public ArrayList<Issue> getIssues() {
        return issues;
    }

    public void setIssues(ArrayList<Issue> issues) {
        this.issues = issues;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }
}
