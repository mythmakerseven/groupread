import React, { useState } from 'react'
import { useAppSelector } from '../../hooks'

const NavGroupList: React.FC = () => {
  const [listVisible, setListVisible] = useState<boolean>(false)

  const user = useAppSelector(({ user }) => user)

  if (!user) {
    return null
  }

  return (
    <a role='button' className='navbar-item' onClick={() => setListVisible(!listVisible)} >My Groups
&#9660;</a>
  )
}

export default NavGroupList