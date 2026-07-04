import { useRef, useEffect, useState } from 'react';
import { useThemeProvider } from '../utils/ThemeContext';
import { chartColors } from './ChartjsConfig';
import {
  Chart,
  LineController,
  LineElement,
  Filler,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
} from 'chart.js';
import type { ChartData } from 'chart.js';
import 'chartjs-adapter-moment';
import { adjustColorOpacity, getCssVariable, formatValue } from '../utils/Utils';

Chart.register(LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip);

interface RealtimeChartProps {
  data: ChartData;
  width: number;
  height: number;
}

function RealtimeChart({ data, width, height }: RealtimeChartProps) {
  const [chart, setChart] = useState<Chart | null>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const chartValue = useRef<HTMLSpanElement>(null);
  const chartDeviation = useRef<HTMLDivElement>(null);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === 'dark';
  const { textColor, gridColor, tooltipTitleColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors;

  useEffect(() => {
    if (!canvas.current) return;
    const ctx = canvas.current;
    const newChart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        layout: { padding: 20 },
        scales: {
          y: {
            border: { display: false },
            suggestedMin: 30,
            suggestedMax: 80,
            ticks: {
              maxTicksLimit: 5,
              callback: (value) => formatValue(value as number),
              color: darkMode ? textColor.dark : textColor.light,
            },
            grid: { color: darkMode ? gridColor.dark : gridColor.light },
          },
          x: {
            type: 'time',
            time: {
              parser: 'hh:mm:ss',
              unit: 'second',
              tooltipFormat: 'MMM DD, H:mm:ss a',
              displayFormats: { second: 'H:mm:ss' },
            },
            border: { display: false },
            grid: { display: false },
            ticks: {
              autoSkipPadding: 48,
              maxRotation: 0,
              color: darkMode ? textColor.dark : textColor.light,
            },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            titleFont: { weight: 600 },
            callbacks: { label: (context) => formatValue(context.parsed.y ?? 0) },
            titleColor: darkMode ? tooltipTitleColor.dark : tooltipTitleColor.light,
            bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
            backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
            borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
          },
        },
        interaction: { intersect: false, mode: 'nearest' },
        animation: false,
        maintainAspectRatio: false,
      },
    });
    setChart(newChart);
    return () => newChart.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    const datasets = data.datasets[0].data as number[];
    const currentValue = datasets[datasets.length - 1];
    const previousValue = datasets[datasets.length - 2];
    const diff = ((currentValue - previousValue) / previousValue) * 100;
    if (chartValue.current) chartValue.current.innerHTML = String(currentValue);
    if (chartDeviation.current) {
      if (diff < 0) {
        chartDeviation.current.style.backgroundColor = adjustColorOpacity(getCssVariable('--color-red-500'), 0.2);
        chartDeviation.current.style.color = getCssVariable('--color-red-700');
      } else {
        chartDeviation.current.style.backgroundColor = adjustColorOpacity(getCssVariable('--color-green-500'), 0.2);
        chartDeviation.current.style.color = getCssVariable('--color-green-700');
      }
      chartDeviation.current.innerHTML = `${diff > 0 ? '+' : ''}${diff.toFixed(2)}%`;
    }
  }, [data]);

  useEffect(() => {
    if (!chart) return;
    if (darkMode) {
      (chart.options.scales!.x as { ticks: { color: string } }).ticks.color = textColor.dark;
      (chart.options.scales!.y as { ticks: { color: string } }).ticks.color = textColor.dark;
      (chart.options.scales!.y as { grid: { color: string } }).grid.color = gridColor.dark;
      chart.options.plugins!.tooltip!.titleColor = tooltipTitleColor.dark;
      chart.options.plugins!.tooltip!.bodyColor = tooltipBodyColor.dark;
      chart.options.plugins!.tooltip!.backgroundColor = tooltipBgColor.dark;
      chart.options.plugins!.tooltip!.borderColor = tooltipBorderColor.dark;
    } else {
      (chart.options.scales!.x as { ticks: { color: string } }).ticks.color = textColor.light;
      (chart.options.scales!.y as { ticks: { color: string } }).ticks.color = textColor.light;
      (chart.options.scales!.y as { grid: { color: string } }).grid.color = gridColor.light;
      chart.options.plugins!.tooltip!.titleColor = tooltipTitleColor.light;
      chart.options.plugins!.tooltip!.bodyColor = tooltipBodyColor.light;
      chart.options.plugins!.tooltip!.backgroundColor = tooltipBgColor.light;
      chart.options.plugins!.tooltip!.borderColor = tooltipBorderColor.light;
    }
    chart.update('none');
  }, [currentTheme]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="px-5 py-3">
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2 tabular-nums">
            $<span ref={chartValue}>57.81</span>
          </div>
          <div ref={chartDeviation} className="text-sm font-medium px-1.5 rounded-full"></div>
        </div>
      </div>
      <div className="grow">
        <canvas ref={canvas} width={width} height={height}></canvas>
      </div>
    </>
  );
}

export default RealtimeChart;
