import React from 'react'
import { Space, Tag } from 'antd'

export default function SelectedParticipants({
  selectedParticipants = [],
  onRemoveParticipant,
}) {
  return (
    <div className="participant-tags">
      {selectedParticipants.length > 0 && (
        <Space wrap>
          {selectedParticipants.map((participant, index) => (
            <Tag
              key={participant.entrantId}
              color={participant.tagColor}
              ghost
              closable
              onClose={() => onRemoveParticipant(index)}
            >
              {participant.name}{participant.companyName ? ` | ${participant.companyName}` : ''}
            </Tag>
          ))}
        </Space>
      )}
    </div>
  )
}
