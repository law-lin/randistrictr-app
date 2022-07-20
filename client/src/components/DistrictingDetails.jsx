import { React, useState } from 'react';
import {
  Box,
  Button,
  Text,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Select,
  Stack,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import numberWithCommas from '../utils/numberWithCommas';
import PieChart from './PieChart';
import ReactLoading from 'react-loading';

const DistrictingDetails = ({
  data,
  enactedDistrictingPlanStatistics,
  districtingPlanStatistics,
  selectedState,
  popMeasure,
  isDistrictSelected,
  showBoxAndWhiskerPlot,
  statePopulation,
}) => {
  const [tabIndex, setTabIndex] = useState(0);

  function addAccordionItems() {
    const districts = data.features;
    let retVal = [];
    for (let i = 1; i <= districts.length; i++) {
      const district = districts[i - 1];
      const districtData = [
        {
          title: 'White',
          value: district.properties[`${popMeasure}_WHITE`],
          color: '#7400B8',
        },
        {
          title: 'Black or African American',
          value: district.properties[`${popMeasure}_BLACK`],
          color: '#5E60CE',
        },
        {
          title: 'Hispanic or Latino',
          value: district.properties[`${popMeasure}_HISPANIC`],
          color: '#4EA8DE',
        },
        {
          title: 'Asian',
          value: district.properties[`${popMeasure}_ASIAN`],
          color: '#56CFE1',
        },
        {
          title: 'Other',
          value: district.properties[`${popMeasure}_OTHER`],
          color: '#64DFDF',
        },
        {
          title: 'American Indian',
          value: district.properties[`${popMeasure}_AMERICANINDIAN`],
          color: '#64DFDF',
        },
        {
          title: 'Hawaiian',
          value: district.properties[`${popMeasure}_HAWAIIAN`],
          color: '#64DFDF',
        },
      ];
      console.log(district.properties);
      retVal.push(
        <AccordionItem key={i}>
          <h2>
            <AccordionButton>
              <Box flex='1' textAlign='left'>
                District # {i} statistics
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel paddingX={0} pb={4}>
            <Heading size='md' textAlign='center'>
              Population Per Race
            </Heading>
            <PieChart data={districtData} />
            <Heading size='md' mb={3} textAlign='center'>
              Population Per Political Party
            </Heading>
            <Table
              style={{
                paddingLeft: '0vh',
                paddingRight: '0vh',
                paddingTop: '1vh',
              }}
              variant='simple'
              size='sm'
            >
              <Thead>
                <Tr style={{ textAlign: 'center' }}>
                  <Td style={{ fontWeight: 600 }}>Political Party</Td>
                  <Td style={{ fontWeight: 600 }}>Number of Votes</Td>
                  <Td style={{ fontWeight: 600 }}>Percentage</Td>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Democratic</Td>
                  <Td>
                    {numberWithCommas(district.properties.DEMOCRAT.toFixed(0))}
                  </Td>
                  <Td>
                    {(
                      (district.properties.DEMOCRAT /
                        (district.properties.DEMOCRAT +
                          district.properties.REPUBLICAN +
                          district.properties.OTHER)) *
                      100
                    ).toFixed(0)}
                    %
                  </Td>
                </Tr>
                <Tr>
                  <Td>Republican</Td>
                  <Td>
                    {numberWithCommas(
                      district.properties.REPUBLICAN.toFixed(0)
                    )}
                  </Td>
                  <Td>
                    {(
                      (district.properties.REPUBLICAN /
                        (district.properties.DEMOCRAT +
                          district.properties.REPUBLICAN +
                          district.properties.OTHER)) *
                      100
                    ).toFixed(0)}
                    %
                  </Td>
                </Tr>
                <Tr>
                  <Td>Other</Td>
                  <Td>
                    {numberWithCommas(district.properties.OTHER.toFixed(0))}
                  </Td>
                  <Td>
                    {(
                      (district.properties.OTHER /
                        (district.properties.DEMOCRAT +
                          district.properties.REPUBLICAN +
                          district.properties.OTHER)) *
                      100
                    ).toFixed(0)}
                    %
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </AccordionPanel>
        </AccordionItem>
      );
    }
    return retVal;
  }

  const dataB = [
    {
      title: 'White',
      value: 50,
      color: '#7400B8',
    },
    {
      title: 'Black or African American',
      value: 31.1,
      color: '#5E60CE',
    },
    {
      title: 'Hispanic or Latino',
      value: 10.6,
      color: '#4EA8DE',
    },
    {
      title: 'Asian',
      value: 6.7,
      color: '#56CFE1',
    },
    {
      title: 'Other',
      value: 1.6,
      color: '#64DFDF',
    },
    // {
    //   title: 'Two or more races',
    //   value: 1.6,
    //   color: '#80FFDB',
    // },
  ];

  const ComparisonTable = () => {
    console.log(districtingPlanStatistics);
    console.log(enactedDistrictingPlanStatistics);

    const {
      numDemocraticCongressionalDistricts,
      numRepublicanCongressionalDistricts,
    } = districtingPlanStatistics;
    const {
      numDemocraticCongressionalDistricts:
        enactedNumDemocraticCongressionalDistricts,
      numRepublicanCongressionalDistricts:
        enactedNumRepublicanCongressionalDistricts,
    } = enactedDistrictingPlanStatistics;

    const enactedAbsoluteDifferenceInPopulation =
      enactedDistrictingPlanStatistics[
        `${popMeasure.toLowerCase()}AbsoluteDifferenceInPopulation`
      ];
    const enactedEfficiencyGap = enactedDistrictingPlanStatistics.efficiencyGap;

    const enactedNumOpportunityDistricts =
      enactedDistrictingPlanStatistics[
        `${popMeasure.toLowerCase()}NumOpportunityDistricts`
      ];
    const enactedObjectiveFunctionScore =
      enactedDistrictingPlanStatistics[
        `${popMeasure.toLowerCase()}ObjectiveFunctionScore`
      ];
    const enactedPopulationScore =
      enactedDistrictingPlanStatistics[
        `${popMeasure.toLowerCase()}PopulationScore`
      ];

    const absoluteDifferenceInPopulation =
      districtingPlanStatistics[
        `${popMeasure.toLowerCase()}AbsoluteDifferenceInPopulation`
      ];
    const efficiencyGap = districtingPlanStatistics.efficiencyGap;

    const numOpportunityDistricts =
      districtingPlanStatistics[
        `${popMeasure.toLowerCase()}NumOpportunityDistricts`
      ];
    const objectiveFunctionScore =
      districtingPlanStatistics[
        `${popMeasure.toLowerCase()}ObjectiveFunctionScore`
      ];
    const populationScore =
      districtingPlanStatistics[`${popMeasure.toLowerCase()}PopulationScore`];

    return (
      <Table variant='simple' size='sm'>
        <TableCaption>
          simulated redistricting statistics vs enacted districting statistics
        </TableCaption>
        <Thead>
          <Tr>
            <Td style={{ fontWeight: 600 }}></Td>
            <Td style={{ fontWeight: 600 }}>Simulated redistricting</Td>
            <Td style={{ fontWeight: 600 }}>Enacted districting</Td>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Efficiency Gap Measure</Td>
            <Td>{(efficiencyGap * 100).toFixed(4)}%</Td>
            <Td>{(enactedEfficiencyGap * 100).toFixed(4)}%</Td>
          </Tr>
          <Tr>
            <Td>Population Score</Td>
            <Td>{(populationScore * 100).toFixed(4)}%</Td>
            <Td>{(enactedPopulationScore * 100).toFixed(4)}%</Td>
          </Tr>
          <Tr>
            <Td># of Democratic Congressional Districts</Td>
            <Td>{numberWithCommas(numDemocraticCongressionalDistricts)}</Td>
            <Td>
              {numberWithCommas(enactedNumDemocraticCongressionalDistricts)}
            </Td>
          </Tr>
          <Tr>
            <Td># of Republican Congressional Districts</Td>
            <Td>{numberWithCommas(numRepublicanCongressionalDistricts)}</Td>
            <Td>
              {numberWithCommas(enactedNumRepublicanCongressionalDistricts)}
            </Td>
          </Tr>
          {/* <Tr>
            <Td>Population Score</Td>
            <Td isNumeric>{objectiveFunctionScore}</Td>
            <Td isNumeric>{enactedObjectiveFunctionScore}</Td>
          </Tr> */}
        </Tbody>
      </Table>
    );
  };

  if (!statePopulation) {
    return null;
  }

  const {
    totalTotalPopulation,
    democratVoters,
    republicanVoters,
    otherVoters,
  } = statePopulation;
  console.log(statePopulation);

  const populationData = [
    {
      title: 'White',
      value: statePopulation[`${popMeasure.toLowerCase()}WhitePopulation`],
      color: '#7400B8',
    },
    {
      title: 'Black or African American',
      value: statePopulation[`${popMeasure.toLowerCase()}BlackPopulation`],
      color: '#5E60CE',
    },
    {
      title: 'Hispanic or Latino',
      value: statePopulation[`${popMeasure.toLowerCase()}HispanicPopulation`],
      color: '#4EA8DE',
    },
    {
      title: 'Asian',
      value: statePopulation[`${popMeasure.toLowerCase()}AsianPopulation`],
      color: '#56CFE1',
    },
    {
      title: 'Other',
      value: statePopulation[`${popMeasure.toLowerCase()}OtherPopulation`],
      color: '#64DFDF',
    },
    {
      title: 'American Indian',
      value:
        statePopulation[`${popMeasure.toLowerCase()}AmericanIndianPopulation`],
      color: '#64DFDF',
    },
    {
      title: 'Hawaiian',
      value: statePopulation[`${popMeasure.toLowerCase()}HawaiianPopulation`],
      color: '#64DFDF',
    },
  ];

  console.log(populationData);
  console.log(selectedState);
  return (
    <Box p={1}>
      {selectedState && enactedDistrictingPlanStatistics ? (
        <Box>
          <Stack spacing={0.25} m={2}>
            {' '}
            {/*ADD THE STATE FLAG*/}
            <Text fontSize='4xl' as='b'>
              {selectedState}
            </Text>
            <Text fontSize='1xl'>
              Number of Congressional Districts:{' '}
              {enactedDistrictingPlanStatistics.numCongressionalDistricts}
            </Text>
            <Text fontSize='1xl'>
              Population:{' '}
              {statePopulation ? numberWithCommas(totalTotalPopulation) : null}
            </Text>
          </Stack>
          <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)}>
            <TabList>
              <Tab>Population</Tab>
              <Tab isDisabled={!isDistrictSelected}>Districting</Tab>
              <Tab
                isDisabled={
                  !(
                    districtingPlanStatistics &&
                    enactedDistrictingPlanStatistics
                  )
                }
              >
                Statistics
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Heading size='md' textAlign='center'>
                  Population Per Race
                </Heading>
                <PieChart data={populationData} />
                <Heading size='md' mb={3} textAlign='center'>
                  Population Per Political Party
                </Heading>
                <Table
                  style={{
                    paddingLeft: '0vh',
                    paddingRight: '0vh',
                    paddingTop: '1vh',
                  }}
                  variant='simple'
                  size='sm'
                >
                  <Thead>
                    <Tr style={{ textAlign: 'center' }}>
                      <Td style={{ fontWeight: 600 }}>Political Party</Td>
                      <Td style={{ fontWeight: 600 }}>Number of Votes</Td>
                      <Td style={{ fontWeight: 600 }}>Percentage</Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>Democratic</Td>
                      <Td>{numberWithCommas(democratVoters.toFixed(0))}</Td>
                      <Td>
                        {(
                          (democratVoters /
                            (democratVoters + republicanVoters + otherVoters)) *
                          100
                        ).toFixed(0)}
                        %
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Republican</Td>
                      <Td>{numberWithCommas(republicanVoters.toFixed(0))}</Td>
                      <Td>
                        {(
                          (republicanVoters /
                            (democratVoters + republicanVoters + otherVoters)) *
                          100
                        ).toFixed(0)}
                        %
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Other</Td>
                      <Td>{numberWithCommas(otherVoters.toFixed(0))}</Td>
                      <Td>
                        {(
                          (otherVoters /
                            (democratVoters + republicanVoters + otherVoters)) *
                          100
                        ).toFixed(0)}
                        %
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TabPanel>
              <TabPanel>
                <Accordion allowToggle>
                  {data && data.features ? addAccordionItems() : null}
                </Accordion>
              </TabPanel>
              <TabPanel>
                {districtingPlanStatistics &&
                enactedDistrictingPlanStatistics ? (
                  <ComparisonTable />
                ) : null}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      ) : (
        <ReactLoading type='spokes' color='#000' />
        // <h1
        //   style={{
        //     display: 'flex',
        //     justifyContent: 'center',
        //     fontSize: '3vh',
        //     transform: 'translateY(350%)',
        //   }}
        // >
        //   Please select a state to continue
        // </h1>
      )}
    </Box>
  );
};

export default DistrictingDetails;
