import React, { useState, useEffect } from 'react';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Box,
  Heading,
} from '@chakra-ui/react';
import FilterDistricts from './filter-districts';
import DistrictingPreview from './DistrictingPreview';
import MarylandRedistricting from '../assets/maryland-redistricting.png';
import MichiganRedistricting from '../assets/michigan-redistricting.png';
import UtahRedistricting from '../assets/utah-redistricting.png';
import RunAlgorithm from './run-algorithm';

const TabView = ({
  districtings,
  activeGeoJSON,
  selectedState,
  districtingPlanStatistics,
  popMeasure,
  isDistrictSelected,
  onSelect,
  onRun,
  onStop,
  currentDistrictingStatistics,
  algorithmStarted,
  algorithmRunning,
  algorithmSummary,
  checkStatus,
  districtNumberLoading,
  loading,
  showBoxAndWhiskerPlot,
}) => {
  const [tabIndex, setTabIndex] = useState(0);

  // const generateDummyCards = (numCards) => {
  //   let cards = [];
  //   let imageUrl;
  //   if (selectedState === 'Maryland') {
  //     imageUrl = MarylandRedistricting;
  //   } else if (selectedState === 'Michigan') {
  //     imageUrl = MichiganRedistricting;
  //   } else {
  //     imageUrl = UtahRedistricting;
  //   }
  //   // let minMax = ['minimized', 'maximized']
  //   // let types = ['the number of majority minority districts', 'the population score']
  //   for (let i = 1; i <= numCards; i++) {
  //     cards.push({
  //       number: i,
  //       imageUrl,
  //       imageAlt: selectedState,
  //       title: `Random Districting ${i}`,
  //       description:
  //         'This districting minimized the number of majority minority districts.',
  //       congressionalDistricts: Math.floor(Math.random() * (15 - 5 + 1)) + 5,
  //       votingDistricts: Math.floor(Math.random() * (9000 - 5000 + 1)) + 5000,
  //       minorityMajorityDistrict: 3,
  //       threshold: 50,
  //       maxPopulationRange: 137429,
  //       populationScore: 86,
  //       efficiencyGapMeasure: 0.44,
  //       polsbyPopperScore: 0.42,
  //     });
  //   }
  //   return cards;
  // };

  // useEffect(() => {
  //   setCards(generateDummyCards(30));
  // }, [selectedState]);

  return (
    <Box p={2}>
      <Box display='flex' flexDir='row' alignItems='center' mb={5}>
        <Heading size='md' flex={2}>
          {districtings.length} redistrictings generated
        </Heading>
        <a
          href={`data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(activeGeoJSON)
          )}`}
          download='districting.geojson'
        >
          <Button flex={1} fontSize={16}>
            Export Current GeoJSON
          </Button>
        </a>
      </Box>

      <Box overflowY='scroll' h={375}>
        <DistrictingPreview
          cards={districtings}
          popMeasure={popMeasure}
          onSelect={onSelect}
          districtNumberLoading={districtNumberLoading}
          loading={loading}
        />
      </Box>
      <Box
        backgroundColor='#f5fff5'
        borderRadius={10}
        mt={5}
        p={2}
        h={450}
        position='relative'
      >
        {/* <Box position='absolute'>Please s</Box> */}
        <Box>
          <Heading size='md'>Algorithm Panel</Heading>
          <RunAlgorithm
            onRun={onRun}
            onStop={onStop}
            popMeasure={popMeasure}
            districtingPlanStatistics={districtingPlanStatistics}
            currentDistrictingStatistics={currentDistrictingStatistics}
            algorithmStarted={algorithmStarted}
            algorithmRunning={algorithmRunning}
            algorithmSummary={algorithmSummary}
            checkStatus={checkStatus}
            showBoxAndWhiskerPlot={showBoxAndWhiskerPlot}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TabView;
