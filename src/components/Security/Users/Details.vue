<template>
  <div class="UsersManagement">
    <b-container class="UserList--container">
      <b-row>
        <b-col cols="8">
          <headline>User Details - {{ $route.params.id }}</headline>
        </b-col>
        <b-col class="text-right mt-3">
          <b-button
            class="mr-2"
            data-cy="UsersManagement-createBtn"
            variant="primary"
            :disabled="!canCreateUser"
            :to="{ name: 'SecurityUsersCreate' }"
            >Update User</b-button
          >
          <b-button
            class="mr-2"
            data-cy="UsersManagement-createBtn"
            variant="warning"
            :disabled="!canCreateUser"
            :to="{ name: 'SecurityUsersCreate' }"
            >Delete User</b-button
          >
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="6">
          <b-overlay :show="loading" rounded="sm">
            <b-card :busy="loading" no-body class="my-4">
              <b-card-header> <h4>Main informations</h4> </b-card-header>
              <b-list-group flush>
                <b-list-group-item href="#">
                  <span>
                    <!-- <i class="fas fa-user" /> -->
                    KUID: {{ user._id }}
                  </span>
                </b-list-group-item>
                <b-list-group-item href="#">
                  <span>
                    <!-- <i class="fas fa-id-card-alt" /> -->
                    Profiles:
                    <b-badge
                      v-for="profile in profileList"
                      :key="profile"
                      class="mr-1 mt-1 mb-1"
                      variant="primary"
                    >
                      <router-link
                        :to="{
                          name: 'SecurityProfilesUpdate',
                          params: { id: profile }
                        }"
                        class="truncate text-white"
                        >{{ profile }}</router-link
                      >
                    </b-badge>
                  </span>
                </b-list-group-item>
                <b-list-group-item href="#">
                  <span>
                    <!-- <i class="fas fa-address-card" /> -->
                    Strategies:
                    <b-list-group>
                      <b-list-group-item
                        v-for="[key, value] of Object.entries(strategies)"
                        :key="key"
                      >
                        <span> {{ key }}: {{ value.username }} </span>
                      </b-list-group-item>
                    </b-list-group>
                  </span>
                </b-list-group-item>
              </b-list-group>
            </b-card>
          </b-overlay>
          <b-overlay :show="loading" rounded="sm">
            <b-card :busy="loading" no-body class="my-4">
              <b-card-header>
                <b-row align-h="between" align-v="center" class="mx-1">
                  <h4>API Keys</h4>
                  <b-button>
                    +
                  </b-button>
                </b-row>
              </b-card-header>
              <b-list-group flush>
                <b-list-group-item>
                  <b-row align-h="between" align-v="center" class="px-2">
                    2340R82F93H4380UR38HFD34F8H43
                    <b-button
                      class="UserListAPIKey-delete"
                      href=""
                      variant="link"
                      title="Delete API Key"
                    >
                      <i class="fa fa-trash" />
                    </b-button>
                  </b-row>
                </b-list-group-item>

                <b-list-group-item>
                  <b-row align-h="between" align-v="center" class="px-2">
                    2394239F23H34F923JF23F304FU9
                    <b-button
                      class="UserListAPIKey-delete"
                      href=""
                      variant="link"
                      title="Delete API Key"
                    >
                      <i class="fa fa-trash" />
                    </b-button>
                  </b-row>
                </b-list-group-item>
                <b-list-group-item>
                  <b-row align-h="between" align-v="center" class="px-2">
                    204RUT43U9F34FH34HF34FH30H9FJ
                    <b-button
                      class="UserListAPIKey-delete"
                      href=""
                      variant="link"
                      title="Delete API Key"
                    >
                      <i class="fa fa-trash" />
                    </b-button>
                  </b-row>
                </b-list-group-item>
                <b-list-group-item>
                  <b-row align-h="between" align-v="center" class="px-2">
                    23R0U439FHH340FI34H0834G9FJF29J
                    <b-button
                      class="UserListAPIKey-delete"
                      href=""
                      variant="link"
                      title="Delete API Key"
                    >
                      <i class="fa fa-trash" />
                    </b-button>
                  </b-row>
                </b-list-group-item>
              </b-list-group>
            </b-card>
          </b-overlay>
        </b-col>
        <b-col cols="6">
          <b-overlay :show="loading" rounded="sm">
            <b-card :busy="loading" no-body class="my-4">
              <b-card-header>
                <b-row align-h="between" align-v="center" class="mx-1">
                  <h4>Custom content</h4>
                  <b-form-checkbox v-model="checked" name="check-button" switch>
                    <b>JSON</b>
                  </b-form-checkbox>
                </b-row>
              </b-card-header>
              <b-card-body>
                <pre v-json-formatter="{ content: user, open: true }" />
              </b-card-body>
            </b-card>
          </b-overlay>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Headline from '../../Materialize/Headline'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import jsonFormatter from '../../../directives/json-formatter.directive'

export default {
  name: 'SecurityUsersDetails',
  components: {
    Headline
  },
  directives: {
    jsonFormatter
  },
  data() {
    return {
      user: {},
      loading: true
    }
  },
  computed: {
    ...mapGetters('kuzzle', ['wrapper', '$kuzzle']),
    ...mapGetters('auth', ['canSearchUser', 'canCreateUser']),
    profileList() {
      if (!_.get(this.user, '_source.profileIds', null)) {
        return []
      }
      const sorted = [...this.user._source.profileIds].sort()
      return sorted
    },
    strategies() {
      return this.user.credentials || {}
    }
  },
  async created() {
    await this.fetchUser()
  },
  methods: {
    async fetchUser() {
      this.loading = true
      try {
        const result = await this.$kuzzle.security.getUser(
          this.$route.params.id
        )
        this.user = result
        this.user.credentials = {}
        const strategies = await this.$kuzzle.auth.getStrategies()
        for (const strategy of strategies) {
          try {
            const res = await this.$kuzzle.security.getCredentials(
              strategy,
              this.$route.params.id
            )
            this.$log.debug('res', res)
            this.user.credentials[strategy] = res
          } catch (e) {
            this.$log.debug('ERROR', e)
            /* eslint-disable no-empty */
            // Strategies contains local by default but some user
            // might not have local credentials
          }
        }
        this.$log.debug('user credentials', this.user.credentials)
      } catch (error) {
        this.$log.error(error)
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.UserManagement {
  margin-bottom: 3em;
}
::v-deep .usersDropdown {
  background-color: $light-grey-color;
  border: none;
}
.UserList--container {
  transition: max-width 0.6s;
}

::v-deep .show .usersDropdown i {
  transform: rotate(90deg);
}
</style>
