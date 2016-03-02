package tju.vis.po;

import java.util.ArrayList;

/**
 * Created by gmy on 15/12/14.
 */
public class Issue {
    private ArrayList<Paper> papers;
    private int issueNo;

    public ArrayList<Paper> getPapers() {
        return papers;
    }

    public void setPapers(ArrayList<Paper> papers) {
        this.papers = papers;
    }

    public int getIssueNo() {
        return issueNo;
    }

    public void setIssueNo(int issueNo) {
        this.issueNo = issueNo;
    }
}
