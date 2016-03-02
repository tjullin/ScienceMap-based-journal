package tju.vis.util;

import com.google.gson.Gson;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import tju.vis.po.Issue;
import tju.vis.po.Magazine;
import tju.vis.po.Paper;
import tju.vis.po.Volume;

import java.io.*;
import java.util.ArrayList;
import java.util.HashSet;

/**
 * Created by gmy on 15/12/14.
 * 获取IEEE网站上杂志的相应信息
 */
public class IEEEDataUtil {

        private String getContent(String url, String encode) throws ClientProtocolException, IOException {
            DefaultHttpClient httpclient = new DefaultHttpClient();
            HttpGet httpget = new HttpGet(url);
            HttpResponse response = null;
            try {
                response = httpclient.execute(httpget);
            } catch (IOException e) {
                return null;
//                e.printStackTrace();
            }
            HttpEntity entity = response.getEntity();
            String resultStr ="";
            BufferedReader reader = new BufferedReader(new InputStreamReader(
                    entity.getContent(), encode));
            String line = null;
            while ((line = reader.readLine()) != null) {
                resultStr+=line;
            }
            return resultStr;
        }

    Issue getIssueData(String issueURL) throws IOException {
        ArrayList<Paper> papers = new ArrayList<>();
        String content = getContent(issueURL, "UTF-8");
        if (content == null) {
            return new Issue();
        }
//        System.out.println(content);
        Document doc = Jsoup.parse(content);
        Issue issue = new Issue();
        String issueInfo = doc.select("div#jrnl-issue-hdr").select("h2").get(0).text();
        issueInfo = issueInfo.substring(issueInfo.indexOf(' ')+1);
        String issueNum = issueInfo.substring(0, issueInfo.indexOf(' '));
        issue.setIssueNo(Integer.parseInt(issueNum));
        String year = issueInfo.substring(issueInfo.lastIndexOf(' ') + 1, issueInfo.length());
        Elements li = doc.select("ul.results").select("li");
        for (Element i : li) {
            Paper paper = new Paper();
            Elements element = i.select("div").select("h3").select("a");
            if (element.size()!=0) {
                System.out.println(element.text());
                paper.setName(element.select("span").text());
                String paperURL = element.attr("href");
                paperURL = "http://ieeexplore.ieee.org"+paperURL;
                String paperContent = getContent(paperURL, "GBK");
                Document paperDoc = Jsoup.parse(paperContent);
                //获取关键字
                Elements select = paperDoc.select("div#abstractKeywords").select("div.section");
                HashSet<String> keyword = new HashSet<>();
                for (Element s : select) {
                    Elements select1 = s.select("ul").select("li");
                    for (Element ss : select1) {
                        keyword.add(ss.select("a").text());
                    }
                }
                paper.setKeyword(keyword);
                //获取引用文章
                Element select2 = paperDoc.select("a#abstract-references-tab").get(0);
                String refURL = select2.attr("href");
                refURL = "http://ieeexplore.ieee.org" + refURL;
                String refContent = getContent(refURL, "UTF-8");
                if (refContent == null) {
                    continue;
                }
                Document refDoc = Jsoup.parse(refContent);
                Elements select1 = refDoc.select("div.tab-content").get(0).select("ol.docs li");
                ArrayList<String> refList = new ArrayList<>();
                for (Element e : select1) {
                    refList.add(e.text());
                }
                paper.setReference(refList);
                papers.add(paper);
            }
        }
        issue.setPapers(papers);
        System.out.println("issue " + issueNum + " of " + year + " has Done!");
        return issue;
    }
    Volume getVolumeData(Document doc,String year) throws IOException {
        Volume volume = new Volume();
        volume.setYear(year);
        ArrayList<Issue> issueList = new ArrayList<>();
        Elements li = doc.select("ul#pi-" + year).select("li");
        /*for (int i = 1; i < 5; i++) {
            issueList.add(getIssueData("http://ieeexplore.ieee.org" + li.get(i).select("a").attr("href")));
        }*/
        issueList.add(getIssueData("http://ieeexplore.ieee.org" + li.get(0).select("a").attr("href")));
        /*
        for (Element e : li) {
            issueList.add(getIssueData("http://ieeexplore.ieee.org" + e.select("a").attr("href")));
            break;
        }
        */
        volume.setIssues(issueList);
        System.out.println("Volume " + year + " has Done!");
        System.out.printf("*****************************");
        return volume;
    }

    Magazine getMagazineData(String name,String punumber) throws IOException {
        Magazine magazine = new Magazine();
        magazine.setName(name);
        ArrayList<Volume> volumes = new ArrayList<>();
        String content = getContent("http://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=" + punumber, "UTF-8");
        if (content == null) {
            return new Magazine();
        }
        Document doc = Jsoup.parse(content);
        for (int i = 2006; i <= 2014; i++) {
            volumes.add(getVolumeData(doc, i + ""));
        }
        magazine.setVolumes(volumes);
        System.out.println("Magazine " + name + " has Done!");
        return magazine;
    }

    void getData(String name, String punumber) throws IOException {
        Magazine magazine = getMagazineData(name, punumber);
        Gson gson = new Gson();
        String json = gson.toJson(magazine);
//        System.out.println(json);
        File file = new File("/Users/imac/Desktop/vis/" + magazine.getName());
        if (!file.exists()) {
            file.mkdirs();
        }
        file = new File(file.getPath() + File.separator + "data1.txt");
        if (!file.exists()) {
            file.createNewFile();
        }
        BufferedWriter bw;
        try {
            bw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(file, true)));
            bw.append(json);
            bw.newLine();
            bw.flush();
            bw.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }



    public static void main(String[] args) throws IOException {
//        new IEEEDataUtil().getData("TKDE","69");
//        new IEEEDataUtil().getData("TVCG","2945");
        new IEEEDataUtil().getData("TMM","6046");
    }
}
