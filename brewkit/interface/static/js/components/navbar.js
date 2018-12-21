let NavBarComponent = Vue.component('main-navbar', {
  props: [],
  data: function () {
    return {
      user: {},
      configurationSelect: '',
      configs: []
    }
  },
  methods: {
    logout() {
      Middleware.logout();
    },
    selectConfig(config) {
      Cookies.set('configuration', config.name)
      this.$emit('select-config', config);
    },
    reselectConfig() {
      prevName = Cookies.get('configuration')
      if(prevName) {
        config = this.configs.filter(c => c.name == prevName)[0];
        this.selectConfig(config)
        this.configurationSelect = config.name
      }
    }
  },
  watch: {
    configurationSelect: function () {
      if (this.configurationSelect != 'Select a Configuration') {
        this.selectConfig(this.configs.filter(x => x.name == this.configurationSelect)[0])
      } else {
        this.selectConfig({devices: []})
      }
    }
  },
  mounted() {
    socket.emit('get_configurations', (configs) => {
      this.configs = JSON.parse(configs);
      this.reselectConfig();
    });

    this.user = JSON.parse(Cookies.get('user'))
  },
  template: `
    <nav id="navbar" class="uk-navbar-container" uk-navbar>
      <!-- Nav Items -->
      <div class="uk-navbar-left uk-margin-left">
        <ul class="uk-navbar-nav">
          <li>
            <a href="/">Dashboard</a>
          </li>
          <li>
            <a href="/configure">Configure</a>
          </li>
          <li>
            <a href="/procedures">Procedures</a>
          </li>
        </ul>
      </div>
      <!-- Configuration select -->
      <div class="uk-navbar-right">
        <div class="container uk-margin-right">
          <div uk-grid>
            <div>
              <select v-model="configurationSelect" id="configurationSelect" class="uk-select">
                <option selected="selected">Select a Configuration</option>
                <option v-for="config in configs" :value="config.name">{{ config.name }}</option>
              </select>
            </div>
            <div>
              <div class="uk-margin-small-top">
                <ul class="uk-iconnav">
                  <li><a href="#" uk-icon="icon: more-vertical"></a></li>
                </ul>
                <div uk-dropdown="mode: click">
                  <ul class="uk-nav uk-dropdown-nav">
                    <li class="uk-nav-header">
                      <span uk-icon="user"></span>
                      {{ user.username }}
                    </li>
                    <li v-if="user.role == 'brewer'">
                      Brewer
                    </li>
                    <li v-if="user.role == 'brewer'">
                      <a href="#promote-modal" uk-toggle>
                        Promote a User
                      </a>
                    </li>
                    <hr>
                    <li>
                      <a @click="logout()" href="#">
                        <span uk-icon="sign-out"></span>
                        Logout
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </nav>
  `
})