import { useState, useEffect } from 'react';
import './index.css';

import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Select,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Progress,
  Tooltip,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from '@chakra-ui/react';
import ReactSlider from 'react-slider';
import numberWithCommas from '../../utils/numberWithCommas';

const RunAlgorithm = ({
  map,
  onRun,
  onStop,
  popMeasure,
  districtingPlanStatistics,
  currentDistrictingStatistics,
  algorithmStarted,
  algorithmRunning,
  algorithmSummary,
  checkStatus,
  showBoxAndWhiskerPlot,
}) => {
  const [[minOpportunity, maxOpportunity], setOpportunity] = useState([0, 3]);
  const [minThreshold, setMinThreshold] = useState(50);
  const [minPopulationScore, setMinPopulationScore] = useState(75);
  const [maxPopDiff, setMaxPopDiff] = useState(0);
  const [maxEffGap, setMaxEffGap] = useState(0.5);
  const [minPolsbyPopper, setMinPolsbyPopper] = useState(0.5);
  const [numIterations, setNumIterations] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRunning, setTimeRunning] = useState(0);
  const [timeLeftRunning, setTimeLeftRunning] = useState(0);

  useEffect(() => {
    setTimeRunning(0);
    let interval = null;
    let checkInterval = null;
    if (algorithmRunning) {
      interval = setInterval(() => {
        setTimeRunning((time) => time + 10);
      }, 10);
      checkInterval = setInterval(() => {
        setTimeLeftRunning((time) => time + 1000);
        checkStatus();
      }, 1000);
    } else {
      clearInterval(interval);
      clearInterval(checkInterval);
    }
    return () => {
      clearInterval(interval);
      clearInterval(checkInterval);
    };
  }, [algorithmRunning]);

  function handleRun() {
    onRun(maxPopDiff);
  }

  const Timer = ({ time, numIterations }) => {
    return (
      <div className='timer'>
        <span>Time Running: </span>
        <span className='digits'>
          {('0' + Math.floor((time / 60000) % 60)).slice(-2)}:
        </span>
        <span className='digits'>
          {('0' + Math.floor((time / 1000) % 60)).slice(-2)}.
        </span>
        <span className='digits mili-sec'>
          {('0' + ((time / 10) % 100)).slice(-2)}
        </span>
        <br />
      </div>
    );
  };

  return (
    <>
      {/* <div style={{ margin: '2vh' }}>
        <h1>
          <span style={{ color: 'gray' }}>Majority-Minority Districts: </span>
          <br />
          <span>
            Min: {minOpportunity}, Max: {maxOpportunity}
          </span>
        </h1>

        <ReactSlider
          className='horizontal-slider'
          thumbClassName='thumb'
          trackClassName='track'
          value={[minOpportunity, maxOpportunity]}
          onChange={setOpportunity}
          ariaLabel={['Lower thumb', 'Upper thumb']}
          // ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
          // renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
          pearling
          minDistance={0}
          min={0}
          max={5}
        />
      </div> */}
      {/* <div style={{ margin: '2vh' }}>
        <h1>
          <span style={{ color: 'gray' }}>
            Minimum Threshold for Majority-Minority Districts:
          </span>
          <br />
          <span>{minThreshold}</span>%
        </h1>
        <Slider
          aria-label='slider-ex-2'
          colorScheme='blue'
          defaultValue={minThreshold}
          max={100}
          value={minThreshold}
          onChange={setMinThreshold}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </div> */}

      <div style={{ padding: 10 }}>
        <h1>
          <span style={{ color: 'gray' }}>
            Maximum absolute difference between most and least populous
            districts:{' '}
          </span>
        </h1>
        <NumberInput
          variant='outline'
          placeholder=''
          type='number'
          min={0.0}
          max={0.7}
          step={0.01}
          value={maxPopDiff}
          onChange={setMaxPopDiff}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </div>
      <div style={{ marginTop: 5, textAlign: 'center' }}>
        {!algorithmRunning ? (
          <>
            {districtingPlanStatistics ? (
              <Button
                isLoading={algorithmRunning}
                colorScheme='blue'
                size='lg'
                onClick={handleRun}
              >
                Run Algorithm
              </Button>
            ) : (
              <Tooltip label='Please select districting in above panel first!'>
                <Button colorScheme='blue' size='lg' disabled={true}>
                  Run Algorithm
                </Button>
              </Tooltip>
            )}
          </>
        ) : (
          <Button colorScheme='red' size='lg' onClick={onStop}>
            Stop Algorithm
          </Button>
        )}
      </div>
      {algorithmStarted ? (
        <div>
          <Timer
            time={timeRunning}
            numIterations={
              (algorithmSummary ? algorithmSummary.numIterations : 0) / 1000
            }
          />
          <Progress size='xs' isIndeterminate={algorithmRunning} />
          <br />
          {algorithmSummary && currentDistrictingStatistics ? (
            <div>
              <Table variant='simple'>
                <Tbody>
                  <Tr>
                    {/* <Td>Estimated Time Left</Td>
                    <Td>
                      {numberWithCommas(
                        Math.abs(
                          ((timeLeftRunning /
                            (algorithmSummary.numIterations / 1000)) *
                            (10000 - algorithmSummary.numIterations / 1000)) /
                            10000
                        ).toFixed(0)
                      )}{' '}
                      seconds left
                    </Td> */}
                  </Tr>
                  <Tr>
                    <Td>Number of Iterations</Td>
                    <Td>
                      {numberWithCommas(
                        (algorithmSummary.numIterations / 1000).toFixed(0)
                      )}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Population Score Before Algorithm</Td>
                    <Td>
                      {`${(
                        currentDistrictingStatistics[
                          `${popMeasure.toLowerCase()}PopulationScore`
                        ] * 100
                      ).toFixed(4)}%`}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Current Population Score</Td>
                    <Td>
                      {`${(
                        algorithmSummary.currentDistrictingStatisticsRes[
                          `${popMeasure.toLowerCase()}PopulationScore`
                        ] * 100
                      ).toFixed(4)}%`}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </div>
          ) : null}
          <br />
        </div>
      ) : null}

      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <Button onClick={showBoxAndWhiskerPlot}>
          Show Box and Whisker Plot
        </Button>
      </div>
    </>
  );
};

export default RunAlgorithm;
