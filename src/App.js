import React, { Component } from 'react'
import {List, ListItem, TextField, RaisedButton} from 'material-ui'
import Add from 'material-ui/svg-icons/content/add'
import Remove from 'material-ui/svg-icons/content/remove'
import './App.css'

const ActionTypes = {
  ADD: 'ADD',
  REMOVE: 'REMOVE'
}

const iconStyle = {
  padding: '0 5px',
  cursor: 'pointer'
}

const Item = ({id, name, quantity, handleAction}) => <ListItem
  primaryText={`${name}: ${quantity}`}
>
  <div
    style={{position: 'absolute', right: '10px'}}
  >
    <Add style={iconStyle} onClick={() => handleAction(id, ActionTypes.ADD)} />
    <Remove style={iconStyle} onClick={() => handleAction(id, ActionTypes.REMOVE)} />
  </div>
</ListItem>

class App extends Component {
  state = {
    data: [],
    newItemText: ''
  }

  changeNewItemText = event => {
    this.setState({newItemText: event.target.value.trim()})
  }

  addNew = () => {
    this.setState(({data, newItemText}) => ({
      data: data.concat({id: Date.now(), name: newItemText, quantity: 0}),
      newItemText: ''
    }))
  }

  handleAction = (id, actionType) => {
    this.setState(({data}) => {
      const item = data.filter(i => i.id === id)[0]
      actionType === ActionTypes.ADD ? item.quantity++ : item.quantity--
      const newArray = data.filter(i => i.id !== id).concat(item).sort((a, b) => a.id - b.id)
      return {data: newArray}
    }, () => {
      window.localStorage.setItem('data', JSON.stringify(this.state.data))
    })
  }

  componentDidMount () {
    const dataFromStorage = window.localStorage.getItem('data')
    const data =  dataFromStorage ? JSON.parse(dataFromStorage) : [
      {id: 1, name: 'mleko', quantity: 2},
      {id: 2, name: 'woda', quantity: 0}
    ]
    this.setState({data})
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
          {this.state.data.map(data => <Item handleAction={this.handleAction} key={data.id} {...data} />)}
        </List>
      </div>
    )
  }
}

export default App
