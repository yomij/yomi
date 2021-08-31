import { ref, Ref } from 'vue'

export default function<T>(initialValue?: T): [Ref<T>, (data: T) => any] {
  const state = ref<T | undefined>(initialValue) as Ref<T>
  return [state, (value: T) => (state.value = value) ]
}
