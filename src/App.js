import React, {Component} from 'react'
import {List, ListItem, TextField, RaisedButton} from 'material-ui'
import Add from 'material-ui/svg-icons/content/add'
import Remove from 'material-ui/svg-icons/content/remove'
import Delete from 'material-ui/svg-icons/action/delete'
import Api from './api'
import './App.css'

const ActionTypes = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  DELETE: 'DELETE',
}

const iconStyle = {
  padding: '0 10px',
  cursor: 'pointer',
}

const pushState = async data => {
  await Api.update(JSON.stringify(data))
}

const Item = ({id, name, quantity, handleAction}) =>
  <ListItem primaryText={`${name}: ${quantity}`}>
    <div style={{position: 'absolute', right: '10px'}}>
      <Add
        style={iconStyle}
        onClick={() => handleAction(id, ActionTypes.ADD)}
      />
      <Remove
        style={iconStyle}
        onClick={() => handleAction(id, ActionTypes.REMOVE)}
      />
      <Delete
        style={iconStyle}
        onClick={() => handleAction(id, ActionTypes.DELETE)}
      />
    </div>
  </ListItem>

class App extends Component {
  state = {
    data: [],
    newItemText: '',
  }

  async componentDidMount() {
    const response = await Api.getAll()
    const data = await response.json()
    this.setState({data})
  }

  changeNewItemText = event => {
    this.setState({newItemText: event.target.value})
  }

  addNew = () => {
    this.setState(
      ({data, newItemText}) => ({
        data: data.concat({id: Date.now(), name: newItemText, quantity: 0}),
        newItemText: '',
      }),
      async () => await pushState(this.state.data),
    )
  }

  handleAction = (id, actionType) => {
    this.setState(({data}) => {
      let item = data.filter(i => i.id === id)[0]

      switch (actionType) {
        case ActionTypes.ADD:
          item.quantity++
          break
        case ActionTypes.REMOVE:
          item.quantity--
          break
        default:
          item = null
          break
      }

      const newArray = data
        .filter(i => i.id !== id)
        .concat(item)
        .filter(i => i)
        .sort((a, b) => a.id - b.id)

      return {data: newArray}
    }, async () => await pushState(this.state.data))
  }

  render() {
    return (
      <div className="App">
        <div>
          <TextField
            hintText="Add new"
            onChange={this.changeNewItemText}
            value={this.state.newItemText}
          />
          <RaisedButton label="ADD" primary onClick={this.addNew} />
        </div>
        <List>
          {this.state.data.map(data =>
            <Item handleAction={this.handleAction} key={data.id} {...data} />,
          )}
        </List>
      </div>
    )
  }
}

export default App
