<template>
  <div class="OfflinePage">
    <b-container>
      <b-jumbotron>
        <template v-slot:header>
          <img
            alt="Welcome to the Kuzzle Admin Console"
            class="mb-3"
            height="60"
            src="../../assets/logo.svg"
          />
          <h2>
            Connecting to Kuzzle at
            <span class="code">{{ host }}:{{ port }}</span>
          </h2>
        </template>

        <hr class="my-4" />

        <b-row align-v="center">
          <b-col sm="1">
            <b-spinner variant="secondary" label="Spinning"> </b-spinner
          ></b-col>
          <b-col sm="6" class="align-middle"> </b-col>
          <b-col sm="2" class="text-right">
            <span class="text-muted align-middle">Connection:</span>
          </b-col>
          <b-col sm="3" class="text-right">
            <environment-switch
              @environment::create="editEnvironment"
              @environment::delete="deleteEnvironment"
              @environment::importEnv="importEnv"
            />
          </b-col>
        </b-row>
      </b-jumbotron>
    </b-container>
  </div>
</template>

<script>
import EnvironmentSwitch from './Environments/EnvironmentsSwitch'

export default {
  name: 'OfflinePage',
  components: {
    EnvironmentSwitch
  },
  computed: {
    currentEnvironment() {
      return this.$store.direct.getters.kuzzle.currentEnvironment
    },
    host() {
      return this.currentEnvironment ? this.currentEnvironment.host : ''
    },
    port() {
      return this.currentEnvironment ? this.currentEnvironment.port : ''
    },
    errorInternalMessage() {
      return this.$store.state.kuzzle.errorFromKuzzle
    }
  },
  methods: {
    editEnvironment(id) {
      this.$emit('environment::create', id)
    },
    deleteEnvironment(id) {
      this.$emit('environment::delete', id)
    },
    importEnv() {
      this.$emit('environment::importEnv')
    }
  }
}
</script>

<style lang="sass" scoped>
.OfflinePage
  height: 100vh
  display: flex
  justify-content: center
  align-items: center
</style>
