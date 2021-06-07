import React, { useState } from 'react'

interface Props {
  label: string,
  content: JSX.Element
}

const Dropdown: React.FC<Props> = ({ label, content }) => {
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false)

  const handleArrow = () => (
    dropdownVisible
      ? <span>&#9650;</span>
      : <span>&#9660;</span>
  )

  const list = () => (
    <div className='box dropdown-list' onClick={() => setDropdownVisible(false)}>
      {content}
    </div>
  )

  return (
    <>
      <a
        role='button'
        className='navbar-item'
        onClick={() => setDropdownVisible(!dropdownVisible)}
      >
        {label}&#8200;{handleArrow()}
      </a>
      {dropdownVisible ? list() : null}
    </>
  )
}

export default Dropdown