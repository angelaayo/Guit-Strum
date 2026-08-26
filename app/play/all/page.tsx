"use client"
import React from 'react'
import {Chord} from "@/app/lib/types"
import { getRandomChord } from '@/app/lib/chords'
import { useState } from 'react'
import ChordImage from '@/app/components/ChordImage'


const AllChords = () => {
    const [currentChord, setCurrentChord] = useState<Chord>(() => getRandomChord())
    function nextChord(){
        setCurrentChord(getRandomChord())
    }
  return (
    <div>
      <ChordImage key={currentChord.id} chord={currentChord}/>
    </div>
  )
}

export default AllChords
