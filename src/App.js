import React from 'react'
import './App.css'

// INDIVIDUAL ITEM
function Item ({id, title, qty, register}) {
  const [internalQuantity, setInternalQuantity] = React.useState(qty)

  console.log(`Render Item ${id}`)
  return (
    <li>{title} <input name={id} type='number' value={internalQuantity} onChange={e => setInternalQuantity(e.target.value)} ref={register} /> <button onClick={() => console.log(`Item ${id} Action | Qty: ${internalQuantity}`)}>Single Item Action</button></li>
  )
}

// PRIMARY WRAPPER [PROVIDER]
const items = [
  { id: 1, title: 'Hey', qty: 0 },
  { id: 2, title: 'Paul', qty: 0 },
  { id: 3, title: 'Morgan', qty: 0 }
]

function reducer (state, action) {
  if (action.type === 'updateAllQuantities') {
    // Loop through the existing state, find inputs that match the current on via
    // the id, then update the quantities to match the internals.
    const newState = state.map(item => {
      const refQuantity = action.inputs.find(i => {
        return String(i.name) === String(item.id)
      })
      return { ...item, qty: Number(refQuantity.value) }
    })

    return newState
  }

  return state
}

function App() {
  // Maintain state for rendering loops. When doing the batch action we do re-render, similar
  // to how we might if we had done an API call for fresh data.
  const [state, dispatch] = React.useReducer(reducer, items)

  // Reference array of inputs.
  const batchQuantitiesRef = React.useRef([])

  // Register an input with the reference array.
  function register(input) {
    batchQuantitiesRef.current.push(input)
  }

  // Pass along the current reference array inputs to the reducer for the batch update.
  function handleAppQuantities () {
    dispatch({
      type: 'updateAllQuantities',
      inputs: batchQuantitiesRef.current
    })
  }
  
  // App renders on load and when state changes.
  console.log('Render App', state)
  return (
    <section>
      <p><button onClick={handleAppQuantities}>Update App Quantities</button></p>
      <ul>
        {state.map(item => <Item key={item.id} {...item} register={register} />)}
      </ul>
    </section>
  )
}

export default App
