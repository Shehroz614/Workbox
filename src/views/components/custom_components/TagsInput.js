import React, {Fragment, useState} from 'react'
import {WithContext as ReactTags} from 'react-tag-input'

// const suggestions = COUNTRIES.map((country) => {
//   return {
//     id: country,
//     text: country,
//   }
// })

const KeyCodes = {
  comma: 188,
  enter: 13,
}

const delimiters = [KeyCodes.comma, KeyCodes.enter]

function TagsInput({
  setTagsInFormik,
  tagsInFormik,
  onBlur,
  placeholder
}) {

  const [tags, setTags] = React.useState(tagsInFormik)

  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i))
    setTagsInFormik(tags.filter((tag, index) => index !== i))
  }

  const handleAddition = (tag) => {
    setTags([...tags, tag])
    setTagsInFormik([...tags, tag])
  }

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice()

    newTags.splice(currPos, 1)
    newTags.splice(newPos, 0, tag)

    // re-render
    setTags(newTags)
    setTagsInFormik(newTags)
  }

  const handleTagClick = (index) => {
    //console.log('The tag at index ' + index + ' was clicked')
  }

  return (
    <Fragment>
      <div>
        <ReactTags
          tags={tags}
          //suggestions={suggestions}
          delimiters={delimiters}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          handleDrag={handleDrag}
          handleTagClick={handleTagClick}
          inputFieldPosition='bottom'
          autocomplete
          placeholder={placeholder}
          handleInputBlur={onBlur}
        />
      </div>
    </Fragment>
  )
}

export default TagsInput
