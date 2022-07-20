package mothballs.randistrictr.service;

import mothballs.randistrictr.model.CensusBlock;
import mothballs.randistrictr.model.District;
import mothballs.randistrictr.model.DistrictingPlan;
import mothballs.randistrictr.model.Population;
import mothballs.randistrictr.repository.CensusBlockRepository;
import org.hibernate.Hibernate;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.List;
import java.util.Set;

@Service
public class DissolvingService {

    @Autowired
    CensusBlockRepository censusBlockRepository;

    public JSONObject getDistrictingJSON(DistrictingPlan districtingPlan) {
        writeDistrictingJSON(districtingPlan);
        dissolveCensusBlocks();
        try {
            JSONParser jsonParser = new JSONParser();
            FileReader reader = new FileReader("output.json");
            Object obj = jsonParser.parse(reader);
            JSONObject jsonObject = (JSONObject) obj;
            return jsonObject;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public void writeDistrictingJSON(DistrictingPlan districtingPlan) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("type", "FeatureCollection");
        JSONArray censusBlockArray = new JSONArray();
        List<District> districts = districtingPlan.getDistricts();
        for(District district : districts) {
            Set<CensusBlock> censusBlocks;
            if(!district.isInitializedCensusBlocks()) {
                Hibernate.initialize(district.getCensusBlocks());
                district.setInitializedCensusBlocks(true);
            }
            censusBlocks = district.getCensusBlocks();
            for(CensusBlock cB : censusBlocks) {
                Population censusBlockPopulation = cB.getPopulation();
                JSONObject cBJSON = new JSONObject();
                cBJSON.put("type", "Feature");
                JSONObject properties = new JSONObject();
                properties.put("GEOID20", cB.getGeoID20());
                properties.put("STATE", cB.getState());
                properties.put("CD", cB.getCongressionalDistrict());
                properties.put("DISTRICT_PLAN", cB.getDistrictingPlan());
                properties.put("PRECINCT_ID", cB.getPrecinctID());
                properties.put("TOTAL_TOTAL", censusBlockPopulation.getTotalTotalPopulation());
                properties.put("TOTAL_WHITE", censusBlockPopulation.getTotalWhitePopulation());
                properties.put("TOTAL_BLACK", censusBlockPopulation.getTotalBlackPopulation());
                properties.put("TOTAL_HISPANIC", censusBlockPopulation.getTotalHispanicPopulation());
                properties.put("TOTAL_AMERICANINDIAN", censusBlockPopulation.getTotalAmericanIndianPopulation());
                properties.put("TOTAL_ASIAN", censusBlockPopulation.getTotalAsianPopulation());
                properties.put("TOTAL_HAWAIIAN", censusBlockPopulation.getTotalHawaiianPopulation());
                properties.put("TOTAL_OTHER", censusBlockPopulation.getTotalOtherPopulation());
                properties.put("VAP_TOTAL", censusBlockPopulation.getVapTotalPopulation());
                properties.put("VAP_WHITE", censusBlockPopulation.getVapWhitePopulation());
                properties.put("VAP_BLACK", censusBlockPopulation.getVapBlackPopulation());
                properties.put("VAP_HISPANIC", censusBlockPopulation.getVapHispanicPopulation());
                properties.put("VAP_AMERICANINDIAN", censusBlockPopulation.getVapAmericanIndianPopulation());
                properties.put("VAP_ASIAN", censusBlockPopulation.getVapAsianPopulation());
                properties.put("VAP_HAWAIIAN", censusBlockPopulation.getVapHawaiianPopulation());
                properties.put("VAP_OTHER", censusBlockPopulation.getVapOtherPopulation());
                properties.put("CVAP_TOTAL", censusBlockPopulation.getCvapTotalPopulation());
                properties.put("CVAP_WHITE", censusBlockPopulation.getCvapWhitePopulation());
                properties.put("CVAP_BLACK", censusBlockPopulation.getCvapBlackPopulation());
                properties.put("CVAP_HISPANIC", censusBlockPopulation.getCvapHispanicPopulation());
                properties.put("CVAP_AMERICANINDIAN", censusBlockPopulation.getCvapAmericanIndianPopulation());
                properties.put("CVAP_ASIAN", censusBlockPopulation.getCvapAsianPopulation());
                properties.put("CVAP_HAWAIIAN", censusBlockPopulation.getCvapHawaiianPopulation());
                properties.put("CVAP_OTHER", censusBlockPopulation.getCvapOtherPopulation());
                properties.put("DEMOCRAT", censusBlockPopulation.getDemocratVoters());
                properties.put("REPUBLICAN", censusBlockPopulation.getRepublicanVoters());
                properties.put("OTHER", censusBlockPopulation.getOtherVoters());
                cBJSON.put("properties", properties);
                JSONObject geometry = new JSONObject();
                geometry.put("type", cB.getGeometryType());
                try {
                    JSONParser parser = new JSONParser();
                    JSONArray json = (JSONArray) parser.parse(cB.getGeometry());
                    geometry.put("coordinates", json);
                } catch (Exception e){
                    e.printStackTrace();
                }
                cBJSON.put("geometry", geometry);
                censusBlockArray.add(cBJSON);
            }
        }
        jsonObject.put("features", censusBlockArray);
        try {
            FileWriter file = new FileWriter("preprocessedCensusBlocks.json");
            file.write(jsonObject.toJSONString());
            file.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void dissolveCensusBlocks() {
        Runtime r = Runtime.getRuntime();
        String os = System.getProperty("os.name");
        String[] commands;
        if(os.contains("Windows")){
            commands = new String[]{"cmd.exe", "/c", "mapshaper -i preprocessedCensusBlocks.json -dissolve CD " +
                    "sum-fields='TOTAL_TOTAL','TOTAL_WHITE','TOTAL_BLACK','TOTAL_HISPANIC','TOTAL_AMERICANINDIAN'," +
                    "'TOTAL_ASIAN','TOTAL_HAWAIIAN','TOTAL_OTHER','VAP_TOTAL','VAP_WHITE','VAP_BLACK','VAP_HISPANIC'," + "" +
                    "'VAP_AMERICANINDIAN','VAP_ASIAN','VAP_HAWAIIAN','VAP_OTHER','CVAP_TOTAL','CVAP_AMERICANINDIAN','CVAP_ASIAN'," +
                    "'CVAP_BLACK','CVAP_HAWAIIAN','CVAP_WHITE','CVAP_HISPANIC','CVAP_OTHER','DEMOCRAT','REPUBLICAN','OTHER' -o output.json"};
        } else{
            commands = new String[]{"/bin/bash", "-c", "mapshaper -i preprocessedCensusBlocks.json -dissolve CD " +
                    "sum-fields='TOTAL_TOTAL','TOTAL_WHITE','TOTAL_BLACK','TOTAL_HISPANIC','TOTAL_AMERICANINDIAN'," +
                    "'TOTAL_ASIAN','TOTAL_HAWAIIAN','TOTAL_OTHER','VAP_TOTAL','VAP_WHITE','VAP_BLACK','VAP_HISPANIC'," + "" +
                    "'VAP_AMERICANINDIAN','VAP_ASIAN','VAP_HAWAIIAN','VAP_OTHER','CVAP_TOTAL','CVAP_AMERICANINDIAN','CVAP_ASIAN'," +
                    "'CVAP_BLACK','CVAP_HAWAIIAN','CVAP_WHITE','CVAP_HISPANIC','CVAP_OTHER','DEMOCRAT','REPUBLICAN','OTHER' -o output.json"};
        }
        try {
            Process p = r.exec(commands);
            p.waitFor();
            BufferedReader b = new BufferedReader(new InputStreamReader(p.getInputStream()));
            String line;
            while((line = b.readLine()) != null) {
                System.out.println(line);
            }
            b.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
