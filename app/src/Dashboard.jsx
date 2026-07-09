import React, { useEffect, useMemo, useState } from 'react'
import { Space, Select, Tooltip, Spin, Button } from 'antd'
import SearchPanel from './components/SearchPanel'
import EventTags from './components/EventTags'
import SelectedParticipants from './components/SelectedParticipants'
import PerformanceChart from './components/PerformanceChart'
import PodiumView from './components/PodiumView'
import { fetchResultRows } from './api/resultsService'

const EVENT_TAGS = [
  { label: 'Event', value: '2026', color: 'geekblue' },
  { label: 'Location', value: 'London', color: 'purple' },
]

function normalizeSearchTerm(term) {
  return term.toLowerCase().trim()
}

function findParticipantByName(rows, query) {
  const normalizedQuery = normalizeSearchTerm(query)
  return rows.find((row) => normalizeSearchTerm(row.name) === normalizedQuery)
    || rows.find((row) => normalizeSearchTerm(row.name).startsWith(normalizedQuery))
    || rows.find((row) => normalizeSearchTerm(row.name).includes(normalizedQuery))
}

export default function Dashboard() {
  const [participantRows, setParticipantRows] = useState([])
  const [selectedParticipants, setSelectedParticipants] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [companyFilter, setCompanyFilter] = useState(undefined)
  const [genderFilter, setGenderFilter] = useState(undefined)
  const [ageFilter, setAgeFilter] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPodium, setShowPodium] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchResultRows()
      .then((rows) => {
        setParticipantRows(rows)
        setLoading(false)
      })
      .catch(() => {
        setParticipantRows([])
        setLoading(false)
      })
  }, [])

  const companyOptions = useMemo(() => {
    const companies = participantRows
      .map((row) => row.companyName)
      .filter((company) => company && company.trim().length > 0)
    return Array.from(new Set(companies)).sort().map((company) => ({
      label: company,
      value: company,
    }))
  }, [participantRows])

  const ageOptions = useMemo(() => {
    const categories = new Set()
    for (const row of participantRows) {
      if (row.ageMin != null && row.ageMax != null) {
        categories.add(`${row.ageMin}-${row.ageMax}`)
      }
    }
    return Array.from(categories)
      .sort((a, b) => {
        const [aMin] = a.split('-').map(Number)
        const [bMin] = b.split('-').map(Number)
        return aMin - bMin
      })
      .map((key) => ({
        label: `Age ${key}`,
        value: key,
      }))
  }, [participantRows])

  const filteredRows = useMemo(() => {
    let rows = participantRows
    if (companyFilter) {
      rows = rows.filter((row) => row.companyName === companyFilter)
    }
    if (genderFilter !== undefined) {
      rows = rows.filter((row) => row.gender === genderFilter)
    }
    if (ageFilter.length > 0) {
      rows = rows.filter((row) =>
        ageFilter.some((key) => {
          const [ageMin, ageMax] = key.split('-').map(Number)
          return row.ageMin === ageMin && row.ageMax === ageMax
        })
      )
    }
    return rows
  }, [participantRows, companyFilter, genderFilter, ageFilter])

  const timingValues = useMemo(
    () => filteredRows.map((row) => row.timeSeconds).filter((value) => Number.isFinite(value)),
    [filteredRows]
  )

  const allTimingValues = useMemo(
    () => participantRows.map((row) => row.timeSeconds).filter((value) => Number.isFinite(value)),
    [participantRows]
  )

  const chartBounds = useMemo(() => {
    const vals = allTimingValues
    if (vals.length === 0) return { xMin: 0, xMax: 6000 }
    return {
      xMin: Math.min(...vals),
      xMax: Math.max(...vals),
    }
  }, [allTimingValues])

  const tagPalette = ['#16a085', '#2980b9', '#8e44ad', '#d35400', '#f39c12', '#7f8c8d']

  const handleSearch = (query) => {
    if (!query) return
    const match = findParticipantByName(participantRows, query)

    if (match && !selectedParticipants.some((participant) => participant.entrantId === match.entrantId)) {
      const color = tagPalette[selectedParticipants.length % tagPalette.length]
      setSelectedParticipants((current) => [...current, { ...match, tagColor: color }])
    }
    setSearchQuery('')
  }

  const handleRemoveParticipant = (index) => {
    setSelectedParticipants((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  const displayedParticipants = useMemo(
    () => selectedParticipants.filter((participant) => !companyFilter || participant.companyName === companyFilter),
    [selectedParticipants, companyFilter]
  )

  return (
    <div className="container">
      <div className="app-shell">
        <header className="hero">
          <div className="hero-text">
            <h1>JP Morgan Race Runners Distribution</h1>

            <EventTags participantCount={timingValues.length} eventBadges={EVENT_TAGS} />

            <p className="lead">
              Explore finish-time distributions, compare colleagues, and discover where you stand — designed for teams and events.
            </p>
          </div>

          <div className="hero-actions">
            <Space align="end" wrap size={16} style={{ width: '100%', justifyContent: 'flex-end' }}>
              <div className="search-row search-item" style={{ minWidth: 100, maxWidth: 130 }}>
                <Tooltip title={showPodium ? 'Show chart view' : 'Show top 10 men & women'}>
                  <Button
                    size="small"
                    type={showPodium ? 'primary' : 'default'}
                    onClick={() => setShowPodium((v) => !v)}
                    style={{ width: '100%', fontSize: '0.82rem' }}
                  >
                    {showPodium ? 'Chart' : '🏆 Podium'}
                  </Button>
                </Tooltip>
              </div>
              <div className="search-row search-item" style={{ minWidth: 140, maxWidth: 160 }}>
                <Tooltip title="Filter by gender">
                  <Select
                    allowClear
                    size="small"
                    value={genderFilter}
                    placeholder="Gender"
                    onChange={setGenderFilter}
                    style={{ width: '100%', fontSize: '0.82rem', textAlign: 'left' }}
                    options={[
                      { label: 'Male', value: 1 },
                      { label: 'Female', value: 0 },
                    ]}
                  />
                </Tooltip>
              </div>
              <div className="search-row search-item" style={{ minWidth: 200, maxWidth: 280 }}>
                <Tooltip title="Filter by age category (multi-select)">
                  <Select
                    mode="multiple"
                    allowClear
                    size="small"
                    value={ageFilter}
                    placeholder="Age"
                    onChange={setAgeFilter}
                    style={{ width: '100%', fontSize: '0.82rem', textAlign: 'left' }}
                    options={ageOptions}
                    maxTagCount={1}
                    maxTagPlaceholder={(omitted) => `+${omitted.length}`}
                  />
                </Tooltip>
              </div>
              <div className="search-row search-item" style={{ minWidth: 240, maxWidth: 360 }}>
                <Tooltip title="Filter the chart to show only runners from the selected company">
                  <Select
                    allowClear
                    showSearch
                    size="small"
                    options={companyOptions}
                    value={companyFilter}
                    placeholder="Filter by company"
                    onChange={setCompanyFilter}
                    style={{ width: '100%', fontSize: '0.82rem', textAlign: 'left' }}
                    optionFilterProp="label"
                    filterOption={(input, option) =>
                      option?.label.toLowerCase().includes(input.toLowerCase())
                    }
                  />
                </Tooltip>
              </div>

              <div className="search-row search-item" style={{ minWidth: 240, maxWidth: 420, flex: 1 }}>
                <SearchPanel
                  query={searchQuery}
                  onQueryChange={setSearchQuery}
                  onSearch={handleSearch}
                  size="small"
                  style={{ textAlign: 'left' }}
                />
              </div>
            </Space>
          </div>
        </header>

        <main className="main-content">
          {showPodium ? (
            <div className="podium-scroll">
              {loading ? (
                <div className="chart-loading"><Spin size="large" /></div>
              ) : (
                <PodiumView participantRows={participantRows} />
              )}
            </div>
          ) : (
            <>
              <div className="chart-wrapper">
                {loading ? (
                  <div className="chart-loading">
                    <Spin size="large" />
                  </div>
                ) : (
                  <PerformanceChart values={timingValues} selectedParticipants={selectedParticipants} xMin={chartBounds.xMin} xMax={chartBounds.xMax} />
                )}
              </div>

              <SelectedParticipants
                selectedParticipants={displayedParticipants}
                onRemoveParticipant={handleRemoveParticipant}
              />
            </>
          )}
        </main>

        <footer className="app-footer">
          <p>
            This is an independent project and is not affiliated with, endorsed by, or associated with
            JPMorgan Chase & Co. The data used is from publicly available race results.
          </p>
          <p className="footer-credit">Built by Loïc Boyeldieu &mdash; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  )
}
