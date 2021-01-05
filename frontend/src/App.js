import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import 'semantic-ui-css/semantic.min.css'

import { getAllGroups } from './reducers/groupReducer'

import { Container, Header, List } from 'semantic-ui-react'

// webpack-dev-server does not refresh the browser when code is updated
// due to this bug: https://github.com/webpack/webpack-dev-server/issues/2758
// TODO: either upgrade to the webpack beta or wait for bugfix

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllGroups())
  }, [dispatch])

  const groups = useSelector(({ groups }) => groups)

  return (
    <Container>
      <Header as='h1'>Group Read</Header>
      <List>
        {groups.map(group => 
          <List.Item key={group.id}>
            <List.Content>
              <List.Header as='p'>{group.groupName}</List.Header>
              <List.Description as='p'>{group.bookName}</List.Description>
            </List.Content>
          </List.Item>
        )}
      </List>
    </Container>
  )
}

export default App