<template>
  <!-- Tooltip -->
  <v-tooltip
    v-if="tooltip"
    :bottom="bottom"
    :left="left"
    :right="right"
    :top="top"
  >
    <template v-slot:activator="{ on }">
      <v-avatar
        v-on="on"
        v-if="user.image"
        class="pa-0 ma-0"
        :size="size"
        :tile="tile"
      >
        <v-img lazy-src :src="user.image.url" alt="John Doe" />
      </v-avatar>
      <v-avatar
        v-else
        v-on="on"
        :color="stringToColour(user.name)"
        :size="size"
      >
        <span
          :class="getContrastYIQ(user.name) + '--text'"
          :style="`font-size: ${(size * 2) / 5}px`"
          >{{ getShortName(user.name) }}</span
        >
      </v-avatar>
    </template>
    <span class="text-capitalize">{{ user.name }}</span>
  </v-tooltip>
  <!-- no tooltip -->
  <div v-else>
    <div v-if="user">
      <v-avatar class="ma-0 pa-0" :size="size" :tile="tile" v-if="user.image">
        <v-img :src="user.image.url" :alt="user.name" />
      </v-avatar>
      <v-avatar v-else :color="stringToColour(user.name)" :size="size">
        <span
          :class="getContrastYIQ(user.name) + '--text'"
          :style="`font-size: ${(size * 2) / 5}px`"
          >{{ getShortName(user.name) }}</span
        >
      </v-avatar>
    </div>
    <div v-else>
      <v-avatar
        class="ma-0 pa-0"
        :size="size"
        :tile="tile"
        color="blue white--text"
      >
        LM
      </v-avatar>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Avatar',
  props: {
    user: Object,
    tooltip: {
      type: Boolean,
      default: false
    },
    msgTooltip: {
      type: String,
      default: 'Avatar'
    },
    size: {
      type: Number || String,
      default: 30
    },
    isTeamLogo: {
      type: Boolean,
      default: false
    },
    tile: {
      type: Boolean,
      default: false
    },
    left: {
      type: Boolean,
      default: false
    },
    right: {
      type: Boolean,
      default: false
    },
    top: {
      type: Boolean,
      default: false
    },
    bottom: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /*
        Get short name
        @return 2 char Name (Uppercase)
    */
    getShortName(fullName) {
      let shortName = ''
      if (fullName) {
        let arr = fullName.split(' ')
        if (arr.length == 1) {
          shortName = arr[0].slice(0, 2).toUpperCase()
        } else if (arr.length > 1) {
          let firstName = arr[0]
          let lastName = arr[arr.length - 1]
          shortName = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
        }
      }
      return shortName
    },
    /*
        Create string to color
        @return hex color #a24123
    */
    stringToColour(str) {
      var hash = 0
      if (str) {
        for (var i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash)
        }
        var colour = '#'
        for (var i = 0; i < 3; i++) {
          var value = (hash >> (i * 8)) & 0xff
          colour += ('00' + value.toString(16)).substr(-2)
        }
        return colour
      } else {
        return '#000000'
      }
    },
    /*
        Make contrast color of text
        @return hex color #gasdfg
    */
    getContrastYIQ(str) {
      let hexcolor = this.stringToColour(str)
      var r = parseInt(hexcolor.substr(0, 2), 16)
      var g = parseInt(hexcolor.substr(2, 2), 16)
      var b = parseInt(hexcolor.substr(4, 2), 16)
      var yiq = (r * 299 + g * 587 + b * 114) / 1000
      return yiq >= 128 ? 'black' : 'white'
    }
  }
}
</script>
