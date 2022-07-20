import React, { useState, useMemo, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  ZoomControl,
  GeoJSON,
  useMapEvents,
  Pane,
} from 'react-leaflet';
import {
  Box,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import { center, zoom, bounds } from '../constants/map';
// Components
import Navbar from './navbar';
import Sidebar from './sidebar';
import Position from './Position';
import TabView from './TabView';
import DistrictingDetails from './DistrictingDetails';
import ReactLoading from 'react-loading';
// JSON
import statesdata from '../json/states.json';
import MarylandCongressionalDistricts from '../json/congressional-districts/maryland_congressional_districts.json';
import MichiganCongressionalDistricts from '../json/congressional-districts/michigan_congressional_districts.json';
import UtahCongressionalDistricts from '../json/congressional-districts/utah_congressional_districts.json';

import MarylandCountyBoundaries from '../json/maryland/Maryland_county_boundaries.json';
import MarylandPrecinctBoundaries from '../json/maryland/Maryland_precinct_boundaries.json';
import UtahCountyBoundaries from '../json/utah/Utah_county_boundaries.json';
import UtahPrecinctBoundaries from '../json/utah/Utah_precinct_boundaries.json';

import MarylandVotingDistricts from '../json/voting districts/maryland_voting_simplified.json';
import MichiganVotingDistricts from '../json/voting districts/michigan_voting_simplified.json';
import UtahVotingDistricts from '../json/voting districts/utah_voting_simplified.json';
import useStateRef from '../hooks/useStateRef';
import apiCaller from '../utils/apiCaller';
import BoxAndWhiskerPlot from './BoxAndWhiskerPlot';

const COLOR_0 = '#F06E45';
const COLOR_1 = '#C9A83E';
const COLOR_24 = '#A1A436';
const COLOR_75 = '#789E2D';
const COLOR_140 = '#509923';
const COLOR_222 = '#3eb80e';

function getColor(d) {
  return d > 222
    ? COLOR_222
    : d > 140
    ? COLOR_140
    : d > 75
    ? COLOR_75
    : d > 300
    ? COLOR_24
    : d > 0
    ? COLOR_1
    : COLOR_0;
}
function style(feature) {
  console.log('Feature properties', feature.properties);
  return {
    // fillColor: getColor(feature.properties.COUNT),
    // weight: 1,
    opacity: 1,
    color: '#DF1995', //#3388ff
    fillOpacity: 0.15,
  };
}

const Map = () => {
  const [map, setMap] = useState(null);
  const [selectedState, setSelectedState, selectedStateRef] = useStateRef();
  const [stateLoading, setStateLoading] = useState(false);
  const [popMeasure, setPopMeasure] = useState('TOTAL');
  const [districtings, setDistrictings] = useState([]);
  const [
    enactedDistrictingPlanStatistics,
    setEnactedDistrictingPlanStatistics,
  ] = useState(null);
  const [districtingPlanStatistics, setDistrictingPlanStatistics] =
    useState(null);
  const [activeGeoJSON, setActiveGeoJSON] = useState(null);
  const [votingGeoJSON, setVotingGeoJSON] = useState();
  const [leftSidebarExpanded, setLeftSidebarExpanded] = useState(false);
  const [rightSidebarExpanded, setRightSidebarExpanded] = useState(false);
  const [algorithmStarted, setAlgorithmStarted] = useState(false);
  const [algorithmRunning, setAlgorithmRunning] = useState(false);
  const [algorithmSummary, setAlgorithmSummary] = useState();
  const [boxAndWhiskerLoading, setBoxAndWhiskerLoading] = useState(false);
  const [boxAndWhiskerPlotOpen, setBoxAndWhiskerPlotOpen] = useState(false);
  const [boxAndWhiskerData, setBoxAndWhiskerData] = useState(null);
  const [boxAndWhiskerPlotOption, setBoxAndWhiskerPlotOption] = useState(2);
  const [districtNumberLoading, setDistrictNumberLoading] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentDistrictingStatistics, setCurrentDistrictingStatistics] =
    useState(null);
  const [statePopulation, setStatePopulation] = useState(null);
  const [boundaryType, setBoundaryType] = useState(['districts']);
  const [algorithmResultLoading, setAlgorithmResultLoading] = useState(false);

  const toast = useToast();

  const displayMap = useMemo(() => {
    let mapRef;
    function MapEvents() {
      const map = useMapEvents({
        zoomend: () => {
          onZoomEnd(map);
        },
        locationfound: (location) => {
          console.log('location found:', location);
        },
      });
      return null;
    }

    const highlightFeature = (e) => {
      let layer = e.target;
      const { NAME } = e.target.feature.properties;
      layer.setStyle({
        // weight: 2,
        // color: '#DF1995',
        dashArray: '',
        fillOpacity: 0.2,
        borderWidth: 0.5,
      });
      // if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      //   layer.bringToFront();
      // }
    };
    const resetHighlight = (e) => {
      // setSelected({});
      e.target.setStyle(style(e.target.feature));
    };
    const zoomToFeature = async (e) => {
      console.log('TARGET FEATURE', e.target);
      const { NAME } = e.target.feature.properties;
      if (NAME !== selectedStateRef.current) {
        await handleSelectState(NAME);
        setLeftSidebarExpanded(true);
        setRightSidebarExpanded(true);
        map.fitBounds(e.target.getBounds());
        // setSelectedState(NAME);
      }
    };

    const onEachFeature = (feature, layer) => {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature,
      });
      layer.setStyle({
        color: '#DF1995',
        zIndex: 999,
      });
      // layer.setZIndex(999);
    };

    const onZoomEnd = (map) => {
      const currentZoom = map.getZoom();
      console.log('CZ', currentZoom);
      if (selectedState === 'Maryland' && currentZoom >= 9) {
        setVotingGeoJSON(MarylandVotingDistricts);
      } else if (selectedState === 'Michigan' && currentZoom >= 7) {
        setVotingGeoJSON(MichiganVotingDistricts);
      } else if (selectedState === 'Utah' && currentZoom >= 8) {
        setVotingGeoJSON(UtahVotingDistricts);
      } else {
        setVotingGeoJSON(null);
      }
    };

    return (
      <MapContainer
        className='sidebar-map'
        style={{ height: '94vh', zIndex: 0, minHeight: 390, minWidth: 768 }}
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        whenCreated={(map) => {
          console.log('MAP CREATED');
          mapRef = map;
          setMap(map);
        }}
        boundsOptions={bounds}
        maxBounds={bounds}
        minZoom={5}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <MapEvents />
        <Pane name='states' style={{ zIndex: 420 }}>
          <GeoJSON data={statesdata} onEachFeature={onEachFeature} />
        </Pane>
        <Pane name='congressional' style={{ zIndex: 410 }}>
          {boundaryType.includes('districts') && activeGeoJSON ? (
            <GeoJSON
              data={activeGeoJSON}
              style={{ color: '#0bba25', fillOpacity: 0, weight: 3 }}
            />
          ) : null}
        </Pane>
        {/* <Pane name='voting' style={{ zIndex: 400 }}>
          {votingGeoJSON ? (
            <GeoJSON
              data={votingGeoJSON}
              style={{ color: '#3388ff', fillOpacity: 0.2, weight: 1 }}
            />
          ) : null}
        </Pane> */}

        {boundaryType.includes('counties') && selectedState === 'Maryland' ? (
          <GeoJSON
            data={MarylandCountyBoundaries}
            style={{ color: '#530087', fillOpacity: 0, weight: 2 }}
          />
        ) : null}
        {boundaryType.includes('counties') && selectedState === 'Utah' ? (
          <GeoJSON
            data={UtahCountyBoundaries}
            style={{ color: '#530087', fillOpacity: 0, weight: 2 }}
          />
        ) : null}
        {boundaryType.includes('precincts') && selectedState === 'Maryland' ? (
          <GeoJSON
            data={MarylandPrecinctBoundaries}
            style={{ color: '#576dff', fillOpacity: 0, weight: 1 }}
          />
        ) : null}
        {boundaryType.includes('precincts') && selectedState === 'Utah' ? (
          <GeoJSON
            data={UtahPrecinctBoundaries}
            style={{ color: '#576dff', fillOpacity: 0, weight: 1 }}
          />
        ) : null}
        {/* <GeoJSON data={MaryLandCongressionalDistricts} />
        <GeoJSON data={MichiganCongressionalDistricts} />
        <GeoJSON data={UtahCongressionalDistricts} />
        <GeoJSON data={MaryLandVotingDistricts} />
        <GeoJSON data={MichiganCongressionalDistricts} />
        <GeoJSON data={UtahCongressionalDistricts} /> */}
        <ZoomControl position='bottomright' />
      </MapContainer>
    );
  }, [map, selectedState, activeGeoJSON, votingGeoJSON, boundaryType]);

  const handleSelectState = async (stateName) => {
    try {
      await handleReset();
      setStateLoading(true);
      await apiCaller.post(`/state/select?stateName=${stateName}`);
      const res = await apiCaller.get('/state/population', {
        params: {
          stateName,
        },
      });
      const enactedDistrictingRes = await apiCaller.get(
        '/state/enactedDistricting'
      );
      const enactedDistrictingPlanStatisticsRes = await apiCaller.get(
        '/state/enactedDistrictingPlanStatistics'
      );
      const allDistrictingPlanStatisticsRes = await apiCaller.get(
        '/state/allDistrictingPlanStatistics'
      );
      setStatePopulation(res.data);
      setSelectedState(stateName);
      setEnactedDistrictingPlanStatistics(
        enactedDistrictingPlanStatisticsRes.data
      );
      setActiveGeoJSON(enactedDistrictingRes.data);
      setDistrictings(allDistrictingPlanStatisticsRes.data);
      setStateLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSelect = async (redistrictNumber) => {
    try {
      console.log(redistrictNumber);
      setAlgorithmStarted(false);
      setAlgorithmSummary(null);
      setDistrictingPlanStatistics(null);
      setLoading(true);
      setDistrictNumberLoading(redistrictNumber);
      const res = await apiCaller.get('/state/districting', {
        params: { redistrictNumber },
        timeout: 600000,
      });
      const districtPlanStatsRes = await apiCaller.get(
        '/state/districting/districtPlanStatistics'
      );
      setDistrictNumberLoading(null);
      setLoading(false);
      setDistrictingPlanStatistics(districtPlanStatsRes.data);
      setActiveGeoJSON(null);
      setActiveGeoJSON(res.data);
      setRightSidebarExpanded(true);
    } catch (e) {
      console.log(e);
    }
  };

  const handleReset = async () => {
    await apiCaller.post('/state/reset');
    // setBoundaryType(['districts']);
    setStateLoading(false);
    setActiveGeoJSON(null);
    setLeftSidebarExpanded(false);
    setRightSidebarExpanded(false);
    setAlgorithmStarted(false);
    setAlgorithmSummary(null);
    setEnactedDistrictingPlanStatistics(null);
    setDistrictingPlanStatistics(null);
    setCurrentDistrictingStatistics(null);
    setSelectedState('');
    map.fitBounds(bounds);
  };

  const handleRunAlgorithm = async (maxPopDiff) => {
    try {
      setAlgorithmSummary(null);
      const currentDistrictingStatisticsRes = await apiCaller.get(
        '/state/districting/districtPlanStatistics'
      );
      setCurrentDistrictingStatistics(currentDistrictingStatisticsRes.data);
      const res = await apiCaller.post(
        `/algorithm/run?maxPopDiff=${parseFloat(maxPopDiff / 100)}`
      );
      if (res.data === 'Success') {
        // Start timer to check server algorithm status periodically
        setAlgorithmStarted(true);
        setAlgorithmRunning(true);
      }
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const checkStatus = async () => {
    const statusRes = await apiCaller.get('/algorithm/getAlgorithmStatus');
    if (statusRes.data === 'Complete') {
      setAlgorithmRunning(false);
      const numIterationsRes = await apiCaller.get(
        '/algorithm/getCurrentNumberOfIterations'
      );
      const currentDistrictingStatisticsRes = await apiCaller.get(
        '/algorithm/getCurrentDistrictingStatistics'
      );
      setAlgorithmSummary({
        numIterations: numIterationsRes.data,
        currentDistrictingStatisticsRes: currentDistrictingStatisticsRes.data,
      });
      setAlgorithmResultLoading(true);
      toast({
        position: 'bottom',
        duration: null,
        render: () => (
          <Box color='white' p={3} bg='blue.500' display='flex'>
            <Spinner />
            <Text pl={2}>Algorithm result GeoJSON loading onto map</Text>
          </Box>
        ),
      });
      const currentDistrictingPlanRes = await apiCaller.get(
        '/algorithm/getCurrentDistrictingPlan',
        { timeout: 600000 }
      );
      toast.closeAll();
      setAlgorithmResultLoading(false);
      setActiveGeoJSON(null);
      setActiveGeoJSON(currentDistrictingPlanRes.data);
      const districtPlanStatsRes = await apiCaller.get(
        '/state/districting/districtPlanStatistics'
      );
      setDistrictingPlanStatistics(districtPlanStatsRes.data);
    } else {
      try {
        const numIterationsRes = await apiCaller.get(
          '/algorithm/getCurrentNumberOfIterations'
        );
        const currentDistrictingStatisticsRes = await apiCaller.get(
          '/algorithm/getCurrentDistrictingStatistics'
        );
        console.log('POPSCORE', currentDistrictingStatisticsRes.data);
        setAlgorithmSummary({
          numIterations: numIterationsRes.data,
          currentDistrictingStatisticsRes: currentDistrictingStatisticsRes.data,
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleStopAlgorithm = async () => {
    try {
      await apiCaller.post('/algorithm/stop');
      const numIterationsRes = await apiCaller.get(
        '/algorithm/getCurrentNumberOfIterations'
      );
      const currentDistrictingStatisticsRes = await apiCaller.get(
        '/algorithm/getCurrentDistrictingStatistics'
      );
      setAlgorithmSummary({
        numIterations: numIterationsRes.data,
        currentDistrictingStatisticsRes: currentDistrictingStatisticsRes.data,
      });
      setAlgorithmRunning(false);
      toast({
        position: 'bottom',
        duration: null,
        render: () => (
          <Box color='white' p={3} bg='blue.500' display='flex'>
            <Spinner />
            <Text pl={2}>Algorithm result GeoJSON loading onto map</Text>
          </Box>
        ),
      });
      const currentDistrictingPlanRes = await apiCaller.get(
        '/algorithm/getCurrentDistrictingPlan',
        { timeout: 600000 }
      );
      toast.closeAll();
      setAlgorithmResultLoading(false);
      setActiveGeoJSON(null);
      setActiveGeoJSON(currentDistrictingPlanRes.data);
      const districtPlanStatsRes = await apiCaller.get(
        '/state/districting/districtPlanStatistics'
      );
      setDistrictingPlanStatistics(districtPlanStatsRes.data);
    } catch (e) {
      console.log(e);
    }
  };

  const populationMeasures = {
    TOTAL: 0,
    VAP: 1,
    CVAP: 2,
  };

  const handlePopMeasureChange = async (popMeasure) => {
    setPopMeasure(popMeasure);
    await apiCaller.post(
      `/state/setPopulationMeasure?populationMeasure=${populationMeasures[popMeasure]}`
    );
  };

  const handleShowBoxAndWhiskerPlot = async () => {
    fetchBoxAndWhiskerData(boxAndWhiskerPlotOption);
    setBoxAndWhiskerPlotOpen(true);
  };

  const fetchBoxAndWhiskerData = async (basis) => {
    setBoxAndWhiskerLoading(true);
    const res = await apiCaller.get('/state/getBoxAndWhisker', {
      params: { basis },
      timeout: 600000,
    });
    setBoxAndWhiskerData(res.data);
    setBoxAndWhiskerLoading(false);
  };

  const setDistrictingPlans = (districtingPlanStatistics) => {
    if (districtingPlanStatistics.length > 0) {
      let districtings = [];
      for (let i = 0; i < 30; i++) {
        const districtingPlan = {
          ...districtingPlanStatistics[0],
          redistrictNumber: i,
        };
        districtings.push(JSON.parse(JSON.stringify(districtingPlan)));
      }
      setDistrictings(districtings);
    }
  };

  const basisOptions = {
    Black: 2,
    'VAP Black': 10,
    'CVAP Black': 18,
    Hispanic: 3,
    'VAP Hispanic': 11,
    'CVAP Hispanic': 19,
    'American Indian': 4,
    'VAP American Indian': 12,
    'CVAP American Indian': 20,
    Asian: 5,
    'VAP Asian': 13,
    'CVAP Asian': 21,
    Hawaiian: 6,
    'VAP Hawaiian': 14,
    'CVAP Hawaiian': 22,
    Other: 7,
    'VAP Other': 15,
    'CVAP Other': 23,
    Democrat: 24,
    Republican: 25,
  };

  return (
    <>
      {map ? (
        <Navbar
          map={map}
          selectedState={selectedState}
          boundaryType={boundaryType}
          setBoundaryType={setBoundaryType}
          popMeasure={popMeasure}
          setPopMeasure={handlePopMeasureChange}
          onReset={handleReset}
          onSelect={async (state) => {
            await handleSelectState(state);
            if (state) {
              setLeftSidebarExpanded(true);
              setRightSidebarExpanded(true);
            } else {
              setLeftSidebarExpanded(false);
              setRightSidebarExpanded(false);
            }
            // setActiveGeoJSON(null);
            // setSelectedState(state);
          }}
        />
      ) : null}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {map && !!selectedState ? (
          <Sidebar
            disabled={!!!selectedState}
            expanded={leftSidebarExpanded}
            onToggle={() => setLeftSidebarExpanded(!leftSidebarExpanded)}
            map={map}
            width={600}
          >
            {selectedState ? (
              <TabView
                districtings={districtings}
                activeGeoJSON={activeGeoJSON}
                selectedState={selectedState}
                popMeasure={popMeasure}
                onSelect={handleSelect}
                onRun={handleRunAlgorithm}
                onStop={handleStopAlgorithm}
                districtingPlanStatistics={districtingPlanStatistics}
                currentDistrictingStatistics={currentDistrictingStatistics}
                algorithmStarted={algorithmStarted}
                algorithmRunning={algorithmRunning}
                algorithmSummary={algorithmSummary}
                checkStatus={checkStatus}
                isDistrictSelected={!!activeGeoJSON}
                districtNumberLoading={districtNumberLoading}
                loading={loading}
                showBoxAndWhiskerPlot={handleShowBoxAndWhiskerPlot}
              />
            ) : (
              <ReactLoading type='spokes' color='#000' />

              // <h1 style={{ fontSize: '3vh', transform: 'translateY(350%)' }}>
              //   Please select a state to continue
              // </h1>
            )}
          </Sidebar>
        ) : null}

        <Box position='relative'>
          {stateLoading && (
            <Box
              position='absolute'
              w='100vw'
              h='100vh'
              bgColor='rgba(51,50,48,0.6)'
              zIndex={9999}
              justifyContent='center'
              alignItems='center'
              display='flex'
            >
              <Box>
                <ReactLoading />
              </Box>
            </Box>
          )}

          <Box>{displayMap}</Box>
        </Box>
        <Modal
          isOpen={boxAndWhiskerPlotOpen}
          onClose={() => setBoxAndWhiskerPlotOpen(false)}
          closeOnOverlayClick={false}
          isCentered
          size='md'
          useInert={false}
          trapFocus={false}
        >
          <ModalContent style={{ right: 3 }}>
            <ModalCloseButton />
            <ModalHeader>Box and Whisker Plot</ModalHeader>
            <ModalBody>
              <Select
                onChange={(e) => {
                  fetchBoxAndWhiskerData(e.target.value);
                  setBoxAndWhiskerPlotOption(e.target.value);
                }}
              >
                {Object.keys(basisOptions).map((option) => (
                  <option value={basisOptions[option]}>{option}</option>
                ))}
              </Select>
              <BoxAndWhiskerPlot
                data={boxAndWhiskerData}
                loading={boxAndWhiskerLoading}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
        {map && !!selectedState ? (
          <Sidebar
            disabled={!!!selectedState}
            expanded={rightSidebarExpanded}
            onToggle={() => setRightSidebarExpanded(!rightSidebarExpanded)}
            map={map}
            position='right'
            width={450}
          >
            <DistrictingDetails
              data={activeGeoJSON}
              enactedDistrictingPlanStatistics={
                enactedDistrictingPlanStatistics
              }
              districtingPlanStatistics={districtingPlanStatistics}
              selectedState={selectedState}
              statePopulation={statePopulation}
              popMeasure={popMeasure}
              isDistrictSelected={!!activeGeoJSON}
              showBoxAndWhiskerPlot={handleShowBoxAndWhiskerPlot}
            />
          </Sidebar>
        ) : null}
      </div>
    </>
  );
};

export default Map;
