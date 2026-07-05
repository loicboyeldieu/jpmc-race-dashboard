import React from 'react'
import { Input, Tooltip } from 'antd'

const { Search } = Input

export default function SearchPanel({ query, onQueryChange, onSearch, style, size = 'small' }) {
  return (
    <Tooltip title="Search a runner by name and press Enter">
      <Search
        placeholder="Search Name"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        onSearch={onSearch}
        allowClear
        size={size}
        style={{ width: '100%', ...style }}
      />
    </Tooltip>
  )
}
