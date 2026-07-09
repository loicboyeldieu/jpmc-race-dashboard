import React from 'react'
import { Table, Tag } from 'antd'
import { formatSecondsToMMSS } from '../utils/timeFormat'

const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32']

export default function PodiumView({ participantRows }) {
  const rows = participantRows.filter(
    (r) => r.timeSeconds != null && Number.isFinite(r.timeSeconds) && r.timeSeconds > 0
  )

  const men = rows
    .filter((r) => r.gender === 1)
    .sort((a, b) => a.timeSeconds - b.timeSeconds)
    .slice(0, 100)

  const women = rows
    .filter((r) => r.gender === 0)
    .sort((a, b) => a.timeSeconds - b.timeSeconds)
    .slice(0, 100)

  const columns = [
    {
      title: '#',
      dataIndex: 'rank',
      key: 'rank',
      width: 50,
      render: (rank) => (
        rank <= 3
          ? <span style={{ fontWeight: 700, color: MEDAL_COLORS[rank - 1], fontSize: '1.1rem' }}>{rank}</span>
          : <span style={{ color: '#94a3b8' }}>{rank}</span>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <strong>{name}</strong>,
    },
    {
      title: 'Company',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (company) => company || '-',
    },
    {
      title: 'Time',
      dataIndex: 'timeSeconds',
      key: 'timeSeconds',
      render: (sec) => <Tag color="blue">{formatSecondsToMMSS(sec)}</Tag>,
    },
    {
      title: 'Age',
      dataIndex: 'ageRange',
      key: 'ageRange',
      width: 80,
    },
  ]

  const makeData = (list) =>
    list.map((r, i) => ({
      key: r.entrantId || i,
      rank: i + 1,
      name: r.name,
      companyName: r.companyName,
      timeSeconds: r.timeSeconds,
      ageRange: r.ageMin != null && r.ageMax != null ? `${r.ageMin}-${r.ageMax}` : '-',
    }))

  return (
    <div className="podium-container">
      <div className="podium-section">
        <h3 className="podium-title">🏆 Top 10 Men</h3>
        <Table
          dataSource={makeData(men)}
          columns={columns}
          pagination={{ pageSize: 10, showSizeChanger: false, size: 'small' }}
          size="small"
          bordered={false}
          className="podium-table"
        />
      </div>
      <div className="podium-section">
        <h3 className="podium-title">🏆 Top 10 Women</h3>
        <Table
          dataSource={makeData(women)}
          columns={columns}
          pagination={{ pageSize: 10, showSizeChanger: false, size: 'small' }}
          size="small"
          bordered={false}
          className="podium-table"
        />
      </div>
    </div>
  )
}