//mini game view
import ChordImage from "../components/ChordCard";
import {chords} from "../lib/chords"


export default function gamePlay(){
    return(
        <div>
            {chords.map((chord) =>(
                <ChordImage key={chord.id} chord={chord}/>
            ))}
        </div>
    )
}

