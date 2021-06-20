import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash } from '@fortawesome/free-solid-svg-icons';


function AVControl(props) {
    //assign the correct symbol
    let icon;

    if (props.recordOff) {
        icon = props.type === 'video' ? faVideoSlash : faMicrophoneSlash;
    } else {
        icon = props.type === 'video' ? faVideo : faMicrophone;
    }

    return (
        <div className="avreview">
            <FontAwesomeIcon icon={icon} onClick={() => props.changeRecord()} />
        </div>
    );

}

export default AVControl;
