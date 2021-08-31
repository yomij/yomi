import mitt from 'mitt'
import {TagStore} from "../store/tagStore";

type Events = {
  tagChange: TagStore;
};

export default mitt<Events>()
