import React from 'react'
import {Chord} from "../lib/types"
import ChordDiagram from './ChordDiagram'
export default function ChordImage({chord}: {chord: Chord}){
  return (
    <div className="">
      <h4>{chord.name}</h4>
      <ChordDiagram key={chord.id} chord={chord}/>
    </div>
  )
}
