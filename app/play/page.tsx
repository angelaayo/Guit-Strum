//mini game view
import ChordDiagram from "../components/ChordDiagram";
import {chords} from "../lib/chords"

export default function gamePlay(){
    return(
        <div>
            {chords.map((chord) =>(
                <ChordDiagram key={chord.id} chord={chord}/>
            ))}
        </div>
    )
}

