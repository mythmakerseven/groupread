import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllGroups } from '../reducers/groupListReducer'
import { List, Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const HomePage = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllGroups())
  }, [dispatch])

  const groups = useSelector(({ groupList }) => groupList)

  return (
    <div>
      <Header size="huge" textAlign='center'>
        Group Read
      </Header>
      <p>Note: This list is temporary for development purposes. 1.0 will not have a public list of groups.</p>
      <List>
        {groups.map(group =>
          <List.Item key={group.id}>
            <List.Content>
              <List.Header as='p'>
                <Link to={`/group/${group.id}`}>
                  {group.bookTitle}
                </Link>
              </List.Header>
              <List.Description as='p'>{group.bookName}</List.Description>
            </List.Content>
          </List.Item>
        )}
      </List>
    </div>
  )
}

export default HomePage