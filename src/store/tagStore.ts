import {Ref} from "vue";
import useRef from "../lib/hooks/useRef";

export interface TagStore {
  _id: string;
  tag: string;
}

export default function (): [Ref<TagStore[]>, (data: TagStore[]) => any] {
  return useRef<TagStore[]>([])
}
