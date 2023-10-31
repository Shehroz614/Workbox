import React from 'react'
import IssueList from './Issues'

function Lists({project}) {
  return (
    <div>
      <h2>Lists</h2>
      <IssueList project={project} />
    </div>
  )
}

export default Lists
