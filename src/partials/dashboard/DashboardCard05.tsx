import { useState, useEffect, useRef } from 'react';
import Tooltip from '../../components/Tooltip';
import { chartAreaGradient } from '../../charts/ChartjsConfig';
import RealtimeChart from '../../charts/RealtimeChart';
import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';
import type { ChartData, ScriptableContext } from 'chart.js';

function DashboardCard05() {
  const [counter, setCounter] = useState(0);
  const incrementRef = useRef(0);
  const [range] = useState(35);

  const data = [
    57.81,57.75,55.48,54.28,53.14,52.25,51.04,52.49,55.49,56.87,
    53.73,56.42,58.06,55.62,58.16,55.22,58.67,60.18,61.31,63.25,
    65.91,64.44,65.97,62.27,60.96,59.34,55.07,59.85,53.79,51.92,
    50.95,49.65,48.09,49.81,47.85,49.52,50.21,52.22,54.42,53.42,
    50.91,58.52,53.37,57.58,59.09,59.36,58.71,59.42,55.93,57.71,
    50.62,56.28,57.37,53.08,55.94,55.82,53.94,52.65,50.25,
  ];

  const [slicedData, setSlicedData] = useState(data.slice(0, range));

  const generateDates = () => {
    const now = new Date();
    return data.map((_v, i) => new Date(now.getTime() - 2000 - i * 2000));
  };

  const [slicedLabels, setSlicedLabels] = useState<Date[]>(generateDates().slice(0, range).reverse());

  useEffect(() => {
    const interval = setInterval(() => setCounter((c) => c + 1), 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const next = incrementRef.current + 1;
    if (next + range < data.length) {
      setSlicedData(([_x, ...rest]) => [...rest, data[next + range]]);
      incrementRef.current = next;
    } else {
      setSlicedData(data.slice(0, range));
      incrementRef.current = 0;
    }
    setSlicedLabels(([_x, ...rest]) => [...rest, new Date()]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter]);

  const chartData: ChartData = {
    labels: slicedLabels,
    datasets: [
      {
        data: slicedData,
        fill: true,
        backgroundColor: (context: ScriptableContext<'line'>) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          return chartAreaGradient(ctx, chartArea, [
            { stop: 0, color: adjustColorOpacity(getCssVariable('--color-violet-500'), 0) },
            { stop: 1, color: adjustColorOpacity(getCssVariable('--color-violet-500'), 0.2) },
          ]);
        },
        borderColor: getCssVariable('--color-violet-500'),
        borderWidth: 2, pointRadius: 0, pointHoverRadius: 3,
        pointBackgroundColor: getCssVariable('--color-violet-500'),
        pointHoverBackgroundColor: getCssVariable('--color-violet-500'),
        pointBorderWidth: 0, pointHoverBorderWidth: 0, clip: 20, tension: 0.2,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Real Time Value</h2>
        <Tooltip className="ml-2">
          <div className="text-xs text-center whitespace-nowrap">Built with <a className="underline" href="https://www.chartjs.org/" target="_blank" rel="noreferrer">Chart.js</a></div>
        </Tooltip>
      </header>
      <RealtimeChart data={chartData} width={595} height={248} />
    </div>
  );
}

export default DashboardCard05;
