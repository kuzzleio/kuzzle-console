<template>
  <!-- <div
    data-cy="JSONEditor"
    ref="jsoneditor"
    :class="classes"
    :id="id"
    :style="style"
  /> -->
  <MonacoEditor
    width="600"
    :height="height"
    theme="vs-light"
    :options="options"
    :value="content"
  ></MonacoEditor>
</template>
<script>
import MonacoEditor from 'monaco-editor-vue'

// import Vue from 'vue'
let editor

export default {
  name: 'JsonEditor',
  props: {
    content: String,
    myclass: {
      type: String,
      default: ''
    },
    readonly: Boolean,
    id: String,
    height: { type: Number, default: 250 },
    refreshAce: {
      type: Boolean,
      default: false
    }
  },
  components: {
    MonacoEditor
  },
  computed: {
    options() {
      return {
        lineNumbers: "true",
        acceptSuggestionOnEnter: "on",
        autoClosingBrackets: true,
        autoClosingQuotes: true,
        autoIndent: "full",
        language: "javascript",
        colorDecorators: true,
        columnSelection: true,
        formatOnType: true,
        tabCompletion: "on"
      }
    },
    classes() {
      return (this.readonly ? 'readonly ' : '') + this.myclass
    },
    style() {
      if (this.height === undefined) {
        return { 'min-height': '250px' }
      } else {
        return { 'min-height': this.height + 'px!important' }
      }
    }
  },
  methods: {
    onChange(value) {
      console.log(value)
    },
    getRawValue() {
      return editor.getValue()
    },
    getEditor() {
      return editor
    },
    setContent(value) {
      this.$log.debug('Setting content', value)
      editor.getSession().setValue(value)
    }
  },
  watch: {
    // refreshAce() {
    //   setTimeout(() => {
    //     editor.focus()
    //   }, 500)
    // }
  },
  mounted() {
    // Vue.nextTick(() => {
    //   /* eslint no-undef: 0 */
    //   editor = ace.edit(this.$refs.jsoneditor, {
    //     mode: 'ace/mode/json'
    //   })
    //   editor.setTheme('ace/theme/tomorrow')
    //   editor.setFontSize(15)
    //   editor.getSession().setTabSize(2)
    //   editor.setReadOnly(this.readonly)
    //   editor.$blockScrolling = Infinity
    //   this.setContent(this.content)
    //   // WARNING - Beware of update loops!
    //   // This event is triggered both when the content changes after
    //   // user interaction and when it is set programmatically.
    //   editor.on('change', () => {
    //     this.$emit('change', this.getRawValue())
    //   })
    // })
  }
  // beforeDestroy() {
  //   if (editor) {
  //     editor.removeAllListeners('change')
  //   }
  // }
}
</script>

<style lang="scss" rel="stylesheet/scss">
// .ace_text-input {
//   position: relative;
// }

// .ace-tomorrow.ace_editor.readonly {
//   background-color: #d6d6d6;
//   .ace_gutter,
//   .ace_active-line {
//     background-color: #d6d6d6;
//   }
//   .ace_selection {
//     background: #a7c4de;
//   }
// }
</style>
