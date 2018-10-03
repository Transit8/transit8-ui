import Vue from 'vue'

const notify = {
  info (note) {
    Vue.notify({type: 'success', group: 'artwork-actions', title: note.title, text: note.text})
  },
  warn (note) {
    Vue.notify({type: 'warn', group: 'artwork-actions', title: note.title, text: note.text})
  },
  error (note) {
    Vue.notify({type: 'error', group: 'artwork-actions', title: note.title, text: note.text})
  },
}

export default notify
