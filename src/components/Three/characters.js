import Boy from './boy'
import Mousy from "./mousy"

export default function Characters(props) {
  switch (props.model) {
    case 'Boy':
      return <Boy keypoints={props.keypoints} />;
    case 'Mousy':
      return <Mousy keypoints={props.keypoints} />;
    default:
  }
}
