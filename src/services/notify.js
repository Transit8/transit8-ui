import Vue from 'vue'

const notify = {
  inform (note) {
    Vue.notify({type: 'success', group: 'artwork-actions', title: note.title, text: note.message})
  },
  warn (note) {
    Vue.notify({type: 'warn', group: 'artwork-actions', title: note.title, text: note.message})
  },
  error (note) {
    Vue.notify({type: 'error', group: 'artwork-actions', title: note.title, text: note.message})
  },
}

export default notify
