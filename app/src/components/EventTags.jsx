import React from 'react'
import { Space, Tag } from 'antd'

export default function EventTags({ participantCount, eventBadges = [] }) {
  return (
    <Space wrap className="event-tags">
      <Tag color="green">
        Participants: <strong>{participantCount}</strong>
      </Tag>
      {eventBadges.map((badge) => (
        <Tag key={badge.value} color={badge.color}>
          {badge.label}: <strong>{badge.value}</strong>
        </Tag>
      ))}
    </Space>
  )
}
