import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { formatSecondsToMMSS } from '../utils/timeFormat'

const CHART_COLORS = {
  primary: '#2c3e50',
  primaryLight: 'rgba(44,62,80,0.18)',
  primaryFaint: 'rgba(44,62,80,0.06)',
  secondary: '#16a085',
  axis: '#34495e',
  grid: '#dfe6e9',
  label: '#2d3436',
}

const BIN_COUNT = 200

function buildHistogram(values, xMin, xMax) {
  const binWidth = (xMax - xMin) / BIN_COUNT
  const bins = new Array(BIN_COUNT).fill(0)
  const edges = []

  for (let index = 0; index < BIN_COUNT; index += 1) {
    edges.push(xMin + index * binWidth)
  }
  edges.push(xMax + 1)

  if (!Array.isArray(values) || values.length === 0) {
    return { bins, edges }
  }

  for (const value of values) {
    if (value < xMin || value > xMax) continue
    let bucket = Math.floor((value - xMin) / binWidth)
    if (bucket < 0) bucket = 0
    if (bucket >= BIN_COUNT) bucket = BIN_COUNT - 1
    bins[bucket] += 1
  }

  return { bins, edges }
}

function computePercentile(value, sortedValues) {
  if (sortedValues.length === 0) return 100
  const countLessOrEqual = sortedValues.filter((v) => v <= value).length
  const raw = (countLessOrEqual / sortedValues.length) * 100
  return Math.round(raw * 10) / 10
}

function buildPlotLines(selectedParticipants, allValues) {
  const sortedValues = [...allValues].sort((a, b) => a - b)
  return (selectedParticipants || []).map((participant) => ({
    value: participant.timeSeconds,
    color: participant.tagColor || CHART_COLORS.secondary,
    width: 2,
    dashStyle: 'ShortDash',
    zIndex: 6,
    label: {
      text: `${participant.name} — ${formatSecondsToMMSS(participant.timeSeconds)} (${computePercentile(participant.timeSeconds, sortedValues)}%)`,
      align: 'left',
      rotation: 90,
      y: -6,
      style: {
        color: participant.tagColor || CHART_COLORS.secondary,
        fontWeight: '600',
      },
    },
  }))
}

export default function PerformanceChart({ values, selectedParticipants, xMin, xMax }) {
  const { bins, edges } = buildHistogram(values, xMin, xMax)

  const dataPoints = bins.map((count, index) => [
    (edges[index] + edges[index + 1]) / 2,
    count,
  ])

  const chartOptions = {
    chart: {
      type: 'areaspline',
      backgroundColor: 'transparent',
      zoomType: 'x',
      style: { fontFamily: 'Inter, system-ui, sans-serif' },
      width: null,
      height: null,
      animation: {
        duration: 600,
        easing: 'easeOutQuart',
      },
    },
    title: { text: '' },
    legend: {
      enabled: false,
    },
    xAxis: {
      title: { text: 'Time', style: { color: CHART_COLORS.axis }, margin: 28, },
      labels: {
        style: { color: CHART_COLORS.axis },
        formatter() {
          return formatSecondsToMMSS(this.value)
        },
      },
      gridLineColor: 'rgba(44,62,80,0.08)',
      gridLineWidth: 1,
      gridLineDashStyle: 'Dash',
      lineColor: 'rgba(44,62,80,0.16)',
      tickColor: 'rgba(44,62,80,0.16)',
      tickLength: 6,
      plotLines: buildPlotLines(selectedParticipants, values),
      crosshair: true,
      startOnTick: false,
      endOnTick: false,
      minPadding: 0,
      maxPadding: 0,
    },
    yAxis: {
      title: { text: 'Number of Runners', style: { color: CHART_COLORS.axis }, margin: 36, rotation: 270, },
      labels: { style: { color: CHART_COLORS.axis }, x: -4 },
      gridLineColor: 'rgba(44,62,80,0.08)',
      gridLineWidth: 1,
      gridLineDashStyle: 'Dash',
      lineColor: 'rgba(44,62,80,0.16)',
      tickColor: 'rgba(44,62,80,0.16)',
      tickLength: 4,
    },
    tooltip: {
      backgroundColor: '#ffffff',
      borderColor: CHART_COLORS.grid,
      style: { color: CHART_COLORS.label },
      formatter() {
        return `<b>${formatSecondsToMMSS(this.x)}</b><br/>Nombre de runners: ${this.y}`
      },
    },
    series: [
      {
        name: 'Runners',
        data: dataPoints,
        color: CHART_COLORS.primary,
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, CHART_COLORS.primaryLight],
            [1, CHART_COLORS.primaryFaint],
          ],
        },
        lineWidth: 2.8,
        marker: {
          enabled: false,
        },
      },
    ],
    credits: { enabled: false },
    responsive: {
      rules: [{
        condition: { maxWidth: 768 },
        chartOptions: {
          chart: { height: 280, spacingTop: 8, spacingRight: 8, spacingBottom: 8, spacingLeft: 8 },
          xAxis: {
            labels: { rotation: 45, y: 12, style: { fontSize: '0.65rem' } },
            title: { margin: 8, style: { fontSize: '0.7rem' } },
            tickLength: 3,
          },
          yAxis: {
            title: { margin: 8, style: { fontSize: '0.65rem' } },
            labels: { style: { fontSize: '0.65rem' } },
          },
          plotOptions: {
            areaspline: {
              lineWidth: 1.5,
            },
          },
        },
      }],
    },
    plotOptions: {
      areaspline: {
        marker: { enabled: false },
        threshold: null,
        animation: {
          duration: 600,
          easing: 'easeOutQuart',
        },
      },
    },
  }

  return (
    <div className="chart-root" style={{ width: '100%', height: '100%' }}>
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
        containerProps={{ style: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', minWidth: 0, minHeight: 0 } }}
      />
    </div>
  )
}
