<template>
  <ZyModal
      :minWidth="650"
      :show="state.modal.show"
      :title="state.modal.title"
      :key="state.modal.key"
      @close="closeModal"
  >
    <component :is="state.modal.component" v-bind="state.modal.props" @close="closeModal"/>
  </ZyModal>
</template>

<script setup>
import {ref, reactive} from "vue";
import ZyModal from "./ZyModal.vue";

const state = reactive({
  modal: {
    show: false,
    title: '',
    key: '',
    component: null,
    props: {}
  }
})
const openModal = (title, key, component, props) => {
  state.modal.show = true;
  state.modal.title = title;
  state.modal.key = key;
  state.modal.component = component;
  state.modal.props = props;
}
const closeModal = () => {
  state.modal.show = false;
  state.modal.title = '';
  state.modal.key = '';
  state.modal.component = null;
  state.modal.props = {};
}
</script>
