package tju.vis.util;

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

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;

/**
 * Created by gmy on 15/12/16.
 */
public class ACMDataUtil {

        private String getContent(String url, String encode) throws ClientProtocolException, IOException {
            DefaultHttpClient httpclient = new DefaultHttpClient();
            HttpGet httpget = new HttpGet(url);
            HttpResponse response = httpclient.execute(httpget);
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
        Issue getIssueOfACM(String issueURL) throws IOException {
            Issue issue = new Issue();
            ArrayList<Paper> papers = new ArrayList<>();
            String content = getContent(issueURL, "UTF-8");
            Document doc = Jsoup.parse(content);
            Element element = doc.select("tbody").get(0).select("div.large-text").get(0);
            String issueInfo = element.text();
            issueInfo = issueInfo.substring(issueInfo.indexOf("tju.vis.po.Issue"));
            issueInfo = issueInfo.substring(issueInfo.indexOf(' ')+1);
            String issueNum = issueInfo.substring(0, issueInfo.indexOf(','));
            issue.setIssueNo(Integer.parseInt(issueNum));
            String year = issueInfo.substring(issueInfo.lastIndexOf(' ') + 1, issueInfo.length());
            System.out.println(issueNum+" "+year);
            Elements tr = doc.select("table.text12").select("tr");
            for (Element e : tr) {
                Paper paper = new Paper();
                String paperURL = e.select("a").attr("href");
                paperURL = "http://dl.acm.org" + paperURL;
                System.out.println(paperURL);
                String paperContent = getContent(paperURL,"UTF-8");
                Document paperdoc = Jsoup.parse(paperContent);
                paper.setName(paperdoc.select("strong").get(0).text());
                Elements dt = paperdoc.select("div#related_concepts").get(0).select("dt");
                HashSet<String> keyword = new HashSet<>();
                for (Element key : dt) {
                    keyword.add(key.text());
                }
                paper.setKeyword(keyword);
                Elements tr1 = paperdoc.select("div#references").get(0).select("tr");
                ArrayList<String> refList = new ArrayList<>();
                for (Element ref : tr1) {
                    refList.add(ref.select("td").get(2).text());
                }
                paper.setReference(refList);
                papers.add(paper);
            }
            issue.setPapers(papers);
            return issue;
        }

        Volume getVolumeOfACM(String year,ArrayList<String> linkList) throws IOException {
            Volume volume = new Volume();
            volume.setYear(year);
            ArrayList<Issue> issues = new ArrayList<>();
            for (String link : linkList) {
                issues.add(getIssueOfACM("http://dl.acm.org" + link));
            }
            volume.setIssues(issues);
            return volume;
        }

        Magazine getTOGData() throws IOException {
            Magazine magazine = new Magazine();
            magazine.setName("TOG");
            ArrayList<Volume> volumes = new ArrayList<>();
            String content = getContent("http://dl.acm.org/citation.cfm?id=J778&picked=prox&cfid=737873561&cftoken=68292961", "UTF-8");
            System.out.println(content);
            Document doc = Jsoup.parse(content);
            Element table = doc.select("table").get(0);
            Elements links = table.select("a");
            HashMap<String, ArrayList<String>> linkMap = new HashMap<>();
            for (Element link : links) {
                String info = link.text();
                String year = info.substring(info.lastIndexOf(' ')+1,info.length());
                if (linkMap.containsKey(year)) {
                    linkMap.get(year).add(link.attr("href"));
                }
                else linkMap.put(year, new ArrayList<>(Arrays.asList(link.attr("href"))));
            }
            for (int i = 2006; i <= 2006; i++) {
                String year = i + "";
                volumes.add(getVolumeOfACM(year, linkMap.get(year)));
            }
            magazine.setVolumes(volumes);
            return magazine;
        }

        public static void main(String[] args) {
        }
}
