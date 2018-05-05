import React from 'react'
import withData from 'lib/withData'
import DefaultLayout from 'components/DefaultLayout'
import {
  Container,
  Header,
  Message,
  Loader
} from 'semantic-ui-react'
import { Router } from 'routes'
import PlayerLoginPasswordForm from 'components/PlayerLoginPasswordForm'
import PlayerLoginPinForm from 'components/PlayerLoginPinForm'
import ServersQuery from 'components/queries/ServersQuery'
import withSession from 'lib/withSession'

export class LoginPage extends React.Component {
  async handleOnSubmit(e, { email, password, server, name, pin }) {
    let data

    if (email) {
      data = { email, password }
    } else {
      data = { server, name, pin }
    }

    const response = await fetch(process.env.API_HOST + '/session',
      { method: 'POST'
      , body: JSON.stringify(data)
      , headers: new Headers({ 'Content-Type': 'application/json' })
      , credentials: 'include'
      })

    if (email && response.status === 204) {
      window.location.replace('/')
    } else if ((email && response.status !== 204) || response.status !== 200) {
      const responseData = await response.json()

      throw new Error(responseData.error)
    } else {
      const responseData = await response.json()

      if (responseData.hasAccount) return window.location.replace('/')

      window.location.replace('/register')
    }

  }

  render() {
    if (this.props.session.exists && Router.router) {
      window.location.replace('/')
      return <Loader />
    }

    return (
      <DefaultLayout title='Login' displayNavTitle>
        <Container style={{ marginTop: '2em' }}>
          <Header>Have an account?</Header>
          <PlayerLoginPasswordForm onSubmit={this.handleOnSubmit} />
          <Message
            info
            header='Banned?'
            content='Attempt to join the server in Minecraft, type in the pin number contained within your ban message'
          />
          <Message
            info
            header='Forgot password?'
            content='Join the server in Minecraft, type /bmpin in chat and type the generated pin number below'
          />
          <ServersQuery>
            {({ servers }) => (
              <PlayerLoginPinForm servers={servers} onSubmit={this.handleOnSubmit} />
            )}
          </ServersQuery>
        </Container>
      </DefaultLayout>
    )
  }
}

export default withData(withSession(LoginPage))
