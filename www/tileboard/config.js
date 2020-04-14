// GLOBAL VARS
var activePlayer;
var todPlaylist;

// FUNCTION FOR SPLITTING CONFIG
function loadJS(url) {
   var xhttp = new XMLHttpRequest();
   var script = document.createElement( "script" );
   xhttp.open("GET", url+suffix, false);
   xhttp.send();
   script.text = xhttp.responseText;
   document.head.appendChild( script ).parentNode.removeChild( script );
}

// FUNCTION FOR SUBMENU
function submenuItem(item, pageIndex, activeIndex){
  for (subpage in CONFIG.pages[pageIndex].groups[0].items){
    CONFIG.pages[pageIndex].groups[0].items[subpage].classes = ['-submenu-button'];
  }
  item.classes.push('-submenu-button-active');

  for (lightgroup in CONFIG.pages[pageIndex].groups){
    if (lightgroup != 0){
      CONFIG.pages[pageIndex].groups[lightgroup].hidden = true;
    }
  }
  CONFIG.pages[pageIndex].groups[activeIndex].hidden = false;
}

// FUNCTION FOR SETTING ACTIVEPLAYER
function setActivePlayer(playerId, activeIndex){
  for (player in CONFIG.pages[5].groups[0].items){
    if (player != 0){
      CONFIG.pages[5].groups[0].items[player].classes = ['-action-btn','-inline'];
    }
  }
  CONFIG.pages[5].groups[0].items[activeIndex].classes.push('-active');
  activePlayer = playerId;
}

// FUNCTION FOR GETTING TIME ELAPSED
function elapsedTime(last_changed_ts){
  last_changed = Date.parse( last_changed_ts );
  time_since = new Date( Date.now() - last_changed - 3600000 );

  var elapsed = '';

  if (time_since.getHours() != 0){
    elapsed = elapsed.concat(time_since.getHours()+'h ');
  }

  elapsed = elapsed.concat(time_since.getMinutes()+'m');

  return elapsed;
}

// FUNCTION FOR GETTING TIME UNTIL
function timeUntil(date_ts){
  splits = date_ts.split("-");
  time_until = Date.parse(splits[1]+"-"+splits[0]+"-"+splits[2]) - Date.now();
  days_until = Math.ceil((((time_until / 1000) / 60) / 60) / 24);

  if (days_until == 0){
    return "vandaag";
  } else if (days_until == 1){
    return "morgen";
  } else {
    return "over "+days_until+" dagen";
  }

}

var CONFIG = {

   customTheme: null, // CUSTOM_THEMES.TRANSPARENT, CUSTOM_THEMES.MATERIAL, CUSTOM_THEMES.MOBILE, CUSTOM_THEMES.COMPACT, CUSTOM_THEMES.HOMEKIT, CUSTOM_THEMES.WINPHONE, CUSTOM_THEMES.WIN95
   transition: TRANSITIONS.SIMPLE, //ANIMATED or SIMPLE (better perfomance)
   entitySize: ENTITY_SIZES.NORMAL, //SMALL, BIG are available
   tileSize: 150,
   tileMargin: 6,
   serverUrl: 'http://' + location.hostname + ':8123',
   wsUrl: 'ws://' + location.hostname + ':8123/api/websocket',
   authToken: null, // optional long-lived token (CAUTION: only if TileBoard is not exposed to the internet)
   //googleApiKey: "XXXXXXXXXX", // Required if you are using Google Maps for device tracker
   //mapboxToken: "XXXXXXXXXX", // Required if you are using Mapbox for device tracker
   debug: false, // Prints entities and state change info to the console.
   pingConnection: true, //ping connection to prevent silent disconnections

   // next fields are optional
   events: [],
   timeFormat: 24,
   menuPosition: MENU_POSITIONS.BOTTOM, // or BOTTOM
   hideScrollbar: false, // horizontal scrollbar
   groupsAlign: GROUP_ALIGNS.HORIZONTALLY, // or VERTICALLY
   onReady: function () {},

   header: { // https://github.com/resoai/TileBoard/wiki/Header-configuration
      styles: {
         padding: '15px 15px 0',
         fontSize: '28px'
      },
      right: [
        {
          type: HEADER_ITEMS.WEATHER,
          id: 'weather.huis',
          icon: '&weather.huis.state',
          icons: {
            'clear': 'clear',
            'clear-night': 'nt-clear',
            'cloudy': 'cloudy',
            'rain': 'rain',
            'sleet': 'sleet',
            'snow': 'snow',
            'wind': 'hazy',
            'fog': 'fog',
            'partlycloudy': 'partlycloudy',
          },
          fields: {
            temperature: '&weather.huis.attributes.temperature',
            temperatureUnit: '°C',
          },
        }
      ],
      left: [
         {
            type: HEADER_ITEMS.TIME,
            dateFormat: 'EEEE, LLLL dd', //https://docs.angularjs.org/api/ng/filter/date
         }
      ]
   },

   /*screensaver: {// optional. https://github.com/resoai/TileBoard/wiki/Screensaver-configuration
      timeout: 300, // after 5 mins of inactive
      slidesTimeout: 10, // 10s for one slide
      styles: { fontSize: '40px' },
      leftBottom: [{ type: SCREENSAVER_ITEMS.DATETIME }], // put datetime to the left-bottom of screensaver
      slides: [
         { bg: 'images/bg1.jpeg' },
         {
            bg: 'images/bg2.png',
            rightTop: [ // put text to the 2nd slide
               {
                  type: SCREENSAVER_ITEMS.CUSTOM_HTML,
                  html: 'Welcome to the <b>TileBoard</b>',
                  styles: { fontSize: '40px' }
               }
            ]
         },
         { bg: 'images/bg3.jpg' }
      ]
   },*/

   pages: [

     // HOMEPAGE [index=0]
     {
        title: 'Main page',
        bg: '',
        icon: 'mdi-home-outline', // home icon
        tileSize: 200,
        groupMarginCss: '0px 140px 0px 140px',
        groups: [
           {
              title: '',
              width: 5,
              height: 1,
              items: [

                // PERSON PETER
                {
                   position: [0, 0],
                   type: TYPES.CUSTOM,
                   title: 'Peter',
                   subtitle: '&sensor.roompresence_peter.state',
                   id: {},
                   icon: '',
                   classes: ['-big-round-img'],
                   bgSuffix: '/local/img/pkorthout.jpg',
                   action: function(item, entity) {
                     window.openPage(CONFIG.pages[8]);
                   },
                   secondaryAction: function(item, entity) {

                   }
                },

                // HOUSE MODE
                {
                   position: [1.25, 0],
                   type: TYPES.CUSTOM,
                   title: 'Huismodus',
                   subtitle: '&input_select.house_mode.state',
                   id: 'input_select.house_mode',
                   state: false,
                   icons: {
                       Thuis: 'mdi-home',
                       Gast: 'mdi-account-multiple',
                       Weg: 'mdi-account-arrow-right',
                       Vakantie: 'mdi-account-arrow-right',
                       Nacht: 'mdi-weather-night'
                   },
                   classes: ['-big-round-icon'],
                   action: function(item, entity) {
                     window.openPage(CONFIG.pages[10]);
                   },
                },

                // ALARM
                // HOUSE MODE
                {
                   position: [2.5, 0],
                   type: TYPES.INPUT_BOOLEAN,
                   title: 'Alarmsysteem',
                   subtitle: function (item, entity) {
                        if (entity.state === 'on'){
                          return "Actief";
                        } else {
                          return "Niet actief";
                        }
                     },
                   id: 'input_boolean.alarm_armed',
                   icons: {
                      on: 'mdi-shield-lock-outline',
                      off: 'mdi-shield-off-outline'
                    },
                   state: false,
                   states: {
                     on: 'Actief',
                     off: 'Niet actief'
                   },
                   classes: ['-big-round-icon', '-alarm'],
                },

                // PERSON SHARONA
                {
                   position: [3.75, 0],
                   type: TYPES.CUSTOM,
                   title: 'Sharona',
                   subtitle: '&sensor.roompresence_sharona.state',
                   id: {},
                   icon: '',
                   classes: ['-big-round-img'],
                   bgSuffix: '/local/img/skorthout.jpg',
                   action: function(item, entity) {
                     window.openPage(CONFIG.pages[9]);
                   },
                   secondaryAction: function(item, entity) {

                   }
                },

              ]
           }
        ]
     },


     // LIGHTS [index=1]
     {
       title: 'Lights',
       bg: '',
       icon: 'mdi-lightbulb-outline', // home icon
       tileSize: 200,
       groupMarginCss: '120px 100px 0px 100px',
       groups: [

          // SIDEMENU
          {
            title: '',
            width: 1.25,
            height: 1.5,
            items: [
              // LIGHTS LIVINGROOM
              {
                 position: [0, 0],
                 height: 0.5,
                 width: 1.25,
                 type: TYPES.CUSTOM,
                 title: 'Woonkamer',
                 subtitle: '',
                 id: {},
                 icon: '',
                 classes: ['-submenu-button', '-submenu-button-active'],
                 action: function(item, entity) {
                   submenuItem(item,1,1);
                 },
              },

              // LIGHTS KITCHEN
              {
                 position: [0, 0.5],
                 height: 0.5,
                 width: 1.25,
                 type: TYPES.CUSTOM,
                 title: 'Keuken',
                 subtitle: '',
                 id: {},
                 icon: '',
                 classes: ['-submenu-button'],
                 action: function(item, entity) {
                   submenuItem(item,1,2);
                 },
              },

              // LIGHTS DINNERTABLE
              {
                 position: [0, 1],
                 height: 0.5,
                 width: 1.25,
                 type: TYPES.CUSTOM,
                 title: 'Eetkamer',
                 subtitle: '',
                 id: {},
                 icon: '',
                 classes: ['-submenu-button'],
                 action: function(item, entity) {
                   submenuItem(item,1,3);
                 },
              },

            ]
          },

          // LICHT - WOONKAMER
          {
            hidden: false,
            title: '',
            width: 3,
            height: 2.5,
            items: [

              {
                 position: [1, 0],
                 height: 1,
                 width: 1,
                 type: TYPES.LIGHT,
                 title: 'Woonkamer',
                 subtitle: '',
                 id: 'light.woonkamer',
                 state: false,
                 icons: {
                    on: 'mdi-lightbulb-outline',
                    off: 'mdi-lightbulb-off-outline'
                 },
                 classes: ['-big-round-icon','-light'],
              },

              {
                position: [0,1.25],
                height: 0.75,
                width: 0.75,
                type: TYPES.SCENE,
                id: 'scene.woonkamer_standaard',
                state: false,
                title: 'Standaard',
                icon: 'mdi-lightbulb-multiple-outline',
                classes: ['-small-round-icon'],
              },

              {
                position: [0.75,1.25],
                height: 0.75,
                width: 0.75,
                type: TYPES.SCENE,
                id: 'scene.woonkamer_helder',
                state: false,
                title: 'Helder',
                icon: 'mdi-lightbulb-multiple-outline',
                classes: ['-small-round-icon'],
              },

              {
                position: [1.5,1.25],
                height: 0.75,
                width: 0.75,
                type: TYPES.SCENE,
                id: 'scene.woonkamer_ontspannen',
                state: false,
                title: 'Ontspannen',
                icon: 'mdi-lightbulb-multiple-outline',
                classes: ['-small-round-icon'],
              },

              {
                position: [2.25,1.25],
                height: 0.75,
                width: 0.75,
                type: TYPES.SCENE,
                id: 'scene.woonkamer_gedimd',
                state: false,
                title: 'Gedimd',
                icon: 'mdi-lightbulb-multiple-outline',
                classes: ['-small-round-icon'],
              },

            ]
          },

          // LICHT - KEUKEN
          {
            hidden: true,
            title: '',
            width: 3,
            height: 2.5,
            items: [

              {
                 position: [1, 0],
                 height: 1,
                 width: 1,
                 type: TYPES.LIGHT,
                 title: 'Keuken',
                 subtitle: '',
                 id: 'light.keuken',
                 state: false,
                 icons: {
                    on: 'mdi-lightbulb-outline',
                    off: 'mdi-lightbulb-off-outline'
                 },
                 classes: ['-big-round-icon','-light'],
              },

              {
                position: [0,1.25],
                height: 0.75,
                width: 0.75,
                type: TYPES.SCENE,
                id: 'scene.keuken_standaard',
                state: false,
                title: 'Standaard',
                icon: 'mdi-lightbulb-multiple-outline',
                classes: ['-small-round-icon'],
              },

              {
                position: [0.75,1.25],
                height: 0.75,
                width: 0.75,
                type: TYPES.SCENE,
                id: 'scene.keuken_helder',
                state: false,
                title: 'Helder',
                icon: 'mdi-lightbulb-multiple-outline',
                classes: ['-small-round-icon'],
              },

              {
                position: [1.5,1.25],
                height: 0.75,
                width: 0.75,
                type: TYPES.SCENE,
                id: 'scene.keuken_ontspannen',
                state: false,
                title: 'Ontspannen',
                icon: 'mdi-lightbulb-multiple-outline',
                classes: ['-small-round-icon'],
              },

              {
                position: [2.25,1.25],
                height: 0.75,
                width: 0.75,
                type: TYPES.SCENE,
                id: 'scene.keuken_gedimd',
                state: false,
                title: 'Gedimd',
                icon: 'mdi-lightbulb-multiple-outline',
                classes: ['-small-round-icon'],
              },

            ]
          },

          // LICHT - EETTAFEL
          {
            hidden: true,
            title: '',
            width: 3,
            height: 2.5,
            items: [

              {
                 position: [1, 0],
                 height: 1,
                 width: 1,
                 type: TYPES.LIGHT,
                 title: 'Eetkamer',
                 subtitle: '',
                 state: false,
                 id: 'light.eettafel_lamp',
                 icons: {
                    on: 'mdi-lightbulb-outline',
                    off: 'mdi-lightbulb-off-outline'
                 },
                 classes: ['-big-round-icon','-light'],
              },

              {
                position: [0,1.25],
                height: 0.75,
                width: 0.75,
                type: TYPES.SCENE,
                id: 'scene.eettafel_standaard',
                state: false,
                title: 'Standaard',
                icon: 'mdi-lightbulb-multiple-outline',
                classes: ['-small-round-icon'],
              },

              {
                position: [0.75,1.25],
                height: 0.75,
                width: 0.75,
                type: TYPES.SCENE,
                id: 'scene.eettafel_helder',
                state: false,
                title: 'Helder',
                icon: 'mdi-lightbulb-multiple-outline',
                classes: ['-small-round-icon'],
              },

              {
                position: [1.5,1.25],
                height: 0.75,
                width: 0.75,
                type: TYPES.SCENE,
                id: 'scene.eettafel_ontspannen',
                state: false,
                title: 'Ontspannen',
                icon: 'mdi-lightbulb-multiple-outline',
                classes: ['-small-round-icon'],
              },

              {
                position: [2.25,1.25],
                height: 0.75,
                width: 0.75,
                type: TYPES.SCENE,
                id: 'scene.eettafel_gedimd',
                state: false,
                title: 'Gedimd',
                icon: 'mdi-lightbulb-multiple-outline',
                classes: ['-small-round-icon'],
              },

            ]
          }

       ]
     },

     // CLIMATE [index=2]
     {
       title: 'Climate',
       bg: '',
       icon: 'mdi-thermometer', // home icon
       tileSize: 200,
       groupMarginCss: '120px 100px 0px 100px',
       groups: [

          // SIDEMENU
          {
            title: '',
            width: 1.25,
            height: 2,
            items: [
              // CLIMATE LIVINGROOM
              {
                 position: [0, 0],
                 height: 0.5,
                 width: 1.25,
                 type: TYPES.CUSTOM,
                 title: 'Woonkamer',
                 subtitle: '',
                 id: {},
                 icon: '',
                 classes: ['-submenu-button', '-submenu-button-active'],
                 action: function(item, entity) {
                   submenuItem(item,2,1);
                 },
               },
               // CLIMATE MASTERBEDROOM
               {
                  position: [0, 0.5],
                  height: 0.5,
                  width: 1.25,
                  type: TYPES.CUSTOM,
                  title: 'Slaapkamer',
                  subtitle: '',
                  id: {},
                  icon: '',
                  classes: ['-submenu-button'],
                  action: function(item, entity) {
                    submenuItem(item,2,2);
                  },
                },
                // CLIMATE BABYROOM
                {
                   position: [0, 1],
                   height: 0.5,
                   width: 1.25,
                   type: TYPES.CUSTOM,
                   title: 'Babykamer',
                   subtitle: '',
                   id: {},
                   icon: '',
                   classes: ['-submenu-button'],
                   action: function(item, entity) {
                     submenuItem(item,2,3);
                   },
                 },
                 // CLIMATE ATTIC
                 {
                    position: [0, 1.5],
                    height: 0.5,
                    width: 1.25,
                    type: TYPES.CUSTOM,
                    title: 'Zolder',
                    subtitle: '',
                    id: {},
                    icon: '',
                    classes: ['-submenu-button'],
                    action: function(item, entity) {
                      submenuItem(item,2,4);
                    },
                  },
              ]

            },

            // CLIMATE LIVINGROOM
            {
              title: '',
              width: 2.5,
              height: 1,
              items: [
                {
                  position: [0,0],
                  height: 1,
                  width: 1,
                  type: TYPES.GAUGE,
                  title: 'Temperatuur',
                  id: 'sensor.woonkamer_temp_temperature',
                  state: false,
                  value: function(item, entity){
                      return entity.state;
                   },
                  classes: ['-big-round-gauge'],
                  settings: {
                     size: 200,
                     type: 'arch', // Options are: 'full', 'semi', and 'arch'. Defaults to 'full'
                     min: 0, // Defaults to 0
                     max: 50, // Defaults to 100
                     cap: 'round', // Options are: 'round', 'butt'. Defaults to 'butt'
                     thick: 6, // Defaults to 6
                     label: '', // Defaults to undefined
                     append: '@attributes.unit_of_measurement', // Defaults to undefined
                     prepend: '', // Defaults to undefined
                     duration: 500, // Defaults to 1500ms
                     thresholds: { 0: { color: '#eb3b5a'}, 15: { color: '#20bf6b'}, 25: { color: '#eb3b5a' } },  // Defaults to undefined
                     labelOnly: false, // Defaults to false
                     foregroundColor: 'rgba(0, 150, 136, 1)', // Defaults to rgba(0, 150, 136, 1)
                     backgroundColor: 'rgba(0, 0, 0, 0.1)', // Defaults to rgba(0, 0, 0, 0.1)
                     fractionSize: 1, // Number of decimal places to round the number to. Defaults to current locale formatting
                  },
                },
                {
                  position: [1.5,0],
                  height: 1,
                  width: 1,
                  type: TYPES.GAUGE,
                  title: 'Luchtvochtigheid',
                  id: 'sensor.woonkamer_temp_humidity',
                  state: false,
                  value: function(item, entity){
                      return entity.state;
                   },
                  classes: ['-big-round-gauge'],
                  settings: {
                     size: 200,
                     type: 'arch', // Options are: 'full', 'semi', and 'arch'. Defaults to 'full'
                     min: 0, // Defaults to 0
                     max: 100, // Defaults to 100
                     cap: 'round', // Options are: 'round', 'butt'. Defaults to 'butt'
                     thick: 6, // Defaults to 6
                     label: '', // Defaults to undefined
                     append: '@attributes.unit_of_measurement', // Defaults to undefined
                     prepend: '', // Defaults to undefined
                     duration: 500, // Defaults to 1500ms
                     thresholds: { 0: { color: '#eb3b5a'}, 15: { color: '#20bf6b'}, 70: { color: '#eb3b5a' } },  // Defaults to undefined
                     labelOnly: false, // Defaults to false
                     foregroundColor: 'rgba(0, 150, 136, 1)', // Defaults to rgba(0, 150, 136, 1)
                     backgroundColor: 'rgba(0, 0, 0, 0.1)', // Defaults to rgba(0, 0, 0, 0.1)
                     fractionSize: 1, // Number of decimal places to round the number to. Defaults to current locale formatting
                  },
                },
              ]
            },

            // CLIMATE MASTER BEDROOM
            {
              hidden: true,
              title: '',
              width: 2.5,
              height: 1,
              items: [
                {
                  position: [0,0],
                  height: 1,
                  width: 1,
                  type: TYPES.GAUGE,
                  title: 'Temperatuur',
                  id: 'sensor.slaapkamer_temp_temperature',
                  state: false,
                  value: function(item, entity){
                      return entity.state;
                   },
                  classes: ['-big-round-gauge'],
                  settings: {
                     size: 200,
                     type: 'arch', // Options are: 'full', 'semi', and 'arch'. Defaults to 'full'
                     min: 0, // Defaults to 0
                     max: 50, // Defaults to 100
                     cap: 'round', // Options are: 'round', 'butt'. Defaults to 'butt'
                     thick: 6, // Defaults to 6
                     label: '', // Defaults to undefined
                     append: '@attributes.unit_of_measurement', // Defaults to undefined
                     prepend: '', // Defaults to undefined
                     duration: 500, // Defaults to 1500ms
                     thresholds: { 0: { color: '#eb3b5a'}, 15: { color: '#20bf6b'}, 25: { color: '#eb3b5a' } },  // Defaults to undefined
                     labelOnly: false, // Defaults to false
                     foregroundColor: 'rgba(0, 150, 136, 1)', // Defaults to rgba(0, 150, 136, 1)
                     backgroundColor: 'rgba(0, 0, 0, 0.1)', // Defaults to rgba(0, 0, 0, 0.1)
                     fractionSize: 1, // Number of decimal places to round the number to. Defaults to current locale formatting
                  },
                },
                {
                  position: [1.5,0],
                  height: 1,
                  width: 1,
                  type: TYPES.GAUGE,
                  title: 'Luchtvochtigheid',
                  id: 'sensor.slaapkamer_temp_humidity',
                  state: false,
                  value: function(item, entity){
                      return entity.state;
                   },
                  classes: ['-big-round-gauge'],
                  settings: {
                     size: 200,
                     type: 'arch', // Options are: 'full', 'semi', and 'arch'. Defaults to 'full'
                     min: 0, // Defaults to 0
                     max: 100, // Defaults to 100
                     cap: 'round', // Options are: 'round', 'butt'. Defaults to 'butt'
                     thick: 6, // Defaults to 6
                     label: '', // Defaults to undefined
                     append: '@attributes.unit_of_measurement', // Defaults to undefined
                     prepend: '', // Defaults to undefined
                     duration: 500, // Defaults to 1500ms
                     thresholds: { 0: { color: '#eb3b5a'}, 15: { color: '#20bf6b'}, 70: { color: '#eb3b5a' } },  // Defaults to undefined
                     labelOnly: false, // Defaults to false
                     foregroundColor: 'rgba(0, 150, 136, 1)', // Defaults to rgba(0, 150, 136, 1)
                     backgroundColor: 'rgba(0, 0, 0, 0.1)', // Defaults to rgba(0, 0, 0, 0.1)
                     fractionSize: 1, // Number of decimal places to round the number to. Defaults to current locale formatting
                  },
                },
              ]
            },

            // CLIMATE BABYROOM
            {
              hidden: true,
              title: '',
              width: 2.5,
              height: 1,
              items: [
                {
                  position: [0,0],
                  height: 1,
                  width: 1,
                  type: TYPES.GAUGE,
                  title: 'Temperatuur',
                  id: 'sensor.babykamer_temp_temperature',
                  state: false,
                  value: function(item, entity){
                      return entity.state;
                   },
                  classes: ['-big-round-gauge'],
                  settings: {
                     size: 200,
                     type: 'arch', // Options are: 'full', 'semi', and 'arch'. Defaults to 'full'
                     min: 0, // Defaults to 0
                     max: 50, // Defaults to 100
                     cap: 'round', // Options are: 'round', 'butt'. Defaults to 'butt'
                     thick: 6, // Defaults to 6
                     label: '', // Defaults to undefined
                     append: '@attributes.unit_of_measurement', // Defaults to undefined
                     prepend: '', // Defaults to undefined
                     duration: 500, // Defaults to 1500ms
                     thresholds: { 0: { color: '#eb3b5a'}, 15: { color: '#20bf6b'}, 25: { color: '#eb3b5a' } },  // Defaults to undefined
                     labelOnly: false, // Defaults to false
                     foregroundColor: 'rgba(0, 150, 136, 1)', // Defaults to rgba(0, 150, 136, 1)
                     backgroundColor: 'rgba(0, 0, 0, 0.1)', // Defaults to rgba(0, 0, 0, 0.1)
                     fractionSize: 1, // Number of decimal places to round the number to. Defaults to current locale formatting
                  },
                },
                {
                  position: [1.5,0],
                  height: 1,
                  width: 1,
                  type: TYPES.GAUGE,
                  title: 'Luchtvochtigheid',
                  id: 'sensor.babykamer_temp_humidity',
                  state: false,
                  value: function(item, entity){
                      return entity.state;
                   },
                  classes: ['-big-round-gauge'],
                  settings: {
                     size: 200,
                     type: 'arch', // Options are: 'full', 'semi', and 'arch'. Defaults to 'full'
                     min: 0, // Defaults to 0
                     max: 100, // Defaults to 100
                     cap: 'round', // Options are: 'round', 'butt'. Defaults to 'butt'
                     thick: 6, // Defaults to 6
                     label: '', // Defaults to undefined
                     append: '@attributes.unit_of_measurement', // Defaults to undefined
                     prepend: '', // Defaults to undefined
                     duration: 500, // Defaults to 1500ms
                     thresholds: { 0: { color: '#eb3b5a'}, 15: { color: '#20bf6b'}, 70: { color: '#eb3b5a' } },  // Defaults to undefined
                     labelOnly: false, // Defaults to false
                     foregroundColor: 'rgba(0, 150, 136, 1)', // Defaults to rgba(0, 150, 136, 1)
                     backgroundColor: 'rgba(0, 0, 0, 0.1)', // Defaults to rgba(0, 0, 0, 0.1)
                     fractionSize: 1, // Number of decimal places to round the number to. Defaults to current locale formatting
                  },
                },
              ]
            },

            // CLIMATE ATTIC
            {
              hidden: true,
              title: '',
              width: 2.5,
              height: 1,
              items: [
                {
                  position: [0,0],
                  height: 1,
                  width: 1,
                  type: TYPES.GAUGE,
                  title: 'Temperatuur',
                  id: 'sensor.zolder_temp_temperature',
                  state: false,
                  value: function(item, entity){
                      return entity.state;
                   },
                  classes: ['-big-round-gauge'],
                  settings: {
                     size: 200,
                     type: 'arch', // Options are: 'full', 'semi', and 'arch'. Defaults to 'full'
                     min: 0, // Defaults to 0
                     max: 50, // Defaults to 100
                     cap: 'round', // Options are: 'round', 'butt'. Defaults to 'butt'
                     thick: 6, // Defaults to 6
                     label: '', // Defaults to undefined
                     append: '@attributes.unit_of_measurement', // Defaults to undefined
                     prepend: '', // Defaults to undefined
                     duration: 500, // Defaults to 1500ms
                     thresholds: { 0: { color: '#eb3b5a'}, 15: { color: '#20bf6b'}, 25: { color: '#eb3b5a' } },  // Defaults to undefined
                     labelOnly: false, // Defaults to false
                     foregroundColor: 'rgba(0, 150, 136, 1)', // Defaults to rgba(0, 150, 136, 1)
                     backgroundColor: 'rgba(0, 0, 0, 0.1)', // Defaults to rgba(0, 0, 0, 0.1)
                     fractionSize: 1, // Number of decimal places to round the number to. Defaults to current locale formatting
                  },
                },
                {
                  position: [1.5,0],
                  height: 1,
                  width: 1,
                  type: TYPES.GAUGE,
                  title: 'Luchtvochtigheid',
                  id: 'sensor.zolder_temp_humidity',
                  state: false,
                  value: function(item, entity){
                      return entity.state;
                   },
                  classes: ['-big-round-gauge'],
                  settings: {
                     size: 200,
                     type: 'arch', // Options are: 'full', 'semi', and 'arch'. Defaults to 'full'
                     min: 0, // Defaults to 0
                     max: 100, // Defaults to 100
                     cap: 'round', // Options are: 'round', 'butt'. Defaults to 'butt'
                     thick: 6, // Defaults to 6
                     label: '', // Defaults to undefined
                     append: '@attributes.unit_of_measurement', // Defaults to undefined
                     prepend: '', // Defaults to undefined
                     duration: 500, // Defaults to 1500ms
                     thresholds: { 0: { color: '#eb3b5a'}, 15: { color: '#20bf6b'}, 70: { color: '#eb3b5a' } },  // Defaults to undefined
                     labelOnly: false, // Defaults to false
                     foregroundColor: 'rgba(0, 150, 136, 1)', // Defaults to rgba(0, 150, 136, 1)
                     backgroundColor: 'rgba(0, 0, 0, 0.1)', // Defaults to rgba(0, 0, 0, 0.1)
                     fractionSize: 1, // Number of decimal places to round the number to. Defaults to current locale formatting
                  },
                },
              ]
            },


          ]
      },

      // DOORS & WINDOWS [index=3]
      {
        title: 'Deuren en ramen',
        bg: '',
        icon: 'mdi-door',
        tileSize: 200,
        groupMarginCss: '120px 100px 0px 100px',
        groups: [

          // SIDEMENU
          {
            title: '',
            width: 1.25,
            height: 1,
            items: [
              // DOORS
              {
                 position: [0, 0],
                 height: 0.5,
                 width: 1.25,
                 type: TYPES.CUSTOM,
                 title: 'Deuren',
                 subtitle: '',
                 id: {},
                 icon: '',
                 classes: ['-submenu-button', '-submenu-button-active'],
                 action: function(item, entity) {
                   submenuItem(item,3,1);
                 },
               },
               // WINDOWS
               {
                  position: [0, 0.5],
                  height: 0.5,
                  width: 1.25,
                  type: TYPES.CUSTOM,
                  title: 'Ramen',
                  subtitle: '',
                  id: {},
                  icon: '',
                  classes: ['-submenu-button'],
                  action: function(item, entity) {
                    submenuItem(item,3,2);
                  },
                },
              ]
            },

            // DOORS
            {
              hidden: false,
              title: '',
              width: 3,
              height: 1,
              items: [
                {
                  position: [0, 0],
                  width: 3,
                  height: 0.5,
                  type: TYPES.CUSTOM,
                  title: 'Voordeur',
                  subtitle: function(){
                    if (this.parseFieldValue('&binary_sensor.hal_entree_voordeur_contact.state') == "on"){
                      return 'Open';
                    } else {
                      return 'Gesloten';
                    }
                  },
                  state: false,
                  id: 'binary_sensor.hal_entree_voordeur_contact',
                  icon: '',
                  classes: ['-discriptive-btn','-door-window'],
                },
                {
                  position: [0, 0.5],
                  width: 3,
                  height: 0.5,
                  type: TYPES.CUSTOM,
                  title: 'Achterdeur',
                  subtitle: function(){
                    if (this.parseFieldValue('&binary_sensor.woonkamer_achterdeur_contact.state') == "on"){
                      return 'Open';
                    } else {
                      return 'Gesloten';
                    }
                  },
                  state: false,
                  id: 'binary_sensor.woonkamer_achterdeur_contact',
                  icon: '',
                  classes: ['-discriptive-btn','-door-window'],
                },
              ]
            },

            // WINDOWS
            {
              hidden: false,
              title: '',
              width: 3,
              height: 1.5,
              items: [
                {
                  position: [0, 0],
                  width: 3,
                  height: 0.5,
                  type: TYPES.CUSTOM,
                  title: 'Babykamer',
                  subtitle: function(){
                    if (this.parseFieldValue('&binary_sensor.babykamer_raam_contact.state') == "on"){
                      return 'Open';
                    } else {
                      return 'Gesloten';
                    }
                  },
                  state: false,
                  id: 'binary_sensor.babykamer_raam_contact',
                  icon: '',
                  classes: ['-discriptive-btn','-door-window'],
                },
                {
                  position: [0, 0.5],
                  width: 3,
                  height: 0.5,
                  type: TYPES.CUSTOM,
                  title: 'Studeerkamer',
                  subtitle: function(){
                    if (this.parseFieldValue('&binary_sensor.studeerkamer_raam_contact.state') == "on"){
                      return 'Open';
                    } else {
                      return 'Gesloten';
                    }
                  },
                  state: false,
                  id: 'binary_sensor.studeerkamer_raam_contact',
                  icon: '',
                  classes: ['-discriptive-btn','-door-window'],
                },
                {
                  position: [0, 1],
                  width: 3,
                  height: 0.5,
                  type: TYPES.CUSTOM,
                  title: 'Zolder',
                  subtitle: function(){
                    if (this.parseFieldValue('&binary_sensor.zolder_raam_contact.state') == "on"){
                      return 'Open';
                    } else {
                      return 'Gesloten';
                    }
                  },
                  state: false,
                  id: 'binary_sensor.zolder_raam_contact',
                  icon: '',
                  classes: ['-discriptive-btn','-door-window'],
                },
              ]
            },
        ]
      },

      // MEDIA [index=4]
      {
        title: 'Media',
        bg: '',
        icon: 'mdi-television', // home icon
        tileSize: 200,
        groupMarginCss: '0px 120px 0px 120px',
        groups: [
          {
            title: '',
            width: 2,
            height: 2,
            items: [
              {
                hidden: function (item, entity){
                  if (entity.state == "playing"){
                    return false;
                  } else {
                    return true;
                  }
                },
                position: [0,0],
                height: 2,
                width: 2,
                type: TYPES.CUSTOM,
                title: '@attributes.media_title',
                subtitle: function(){
                  activeChild = this.parseFieldValue('&media_player.mediacenter_woonkamer.attributes.active_child');
                  if (activeChild == "media_player.stb_arris_uhd"){
                    return this.parseFieldValue('&media_player.stb_arris_uhd.attributes.source');
                  } else if (activeChild == "media_player.mediacenter"){
                    runningApp = this.parseFieldValue('&media_player.mediacenter_woonkamer.attributes.app_name');
                    if (runningApp == "Netflix"){
                      return "Netflix";
                    } else if (runningApp == "YouTube"){
                      return "Youtube";
                    }
                  }
                },
                id: 'media_player.mediacenter_woonkamer',
                icon: function(){
                  activeChild = this.parseFieldValue('&media_player.mediacenter_woonkamer.attributes.active_child');
                  if (activeChild == "media_player.stb_arris_uhd"){
                    return "mdi-television-box"
                  } else if (activeChild == "media_player.mediacenter") {
                    runningApp = this.parseFieldValue('&media_player.mediacenter_woonkamer.attributes.app_name');
                    if (runningApp == "Netflix"){
                      return "mdi-netflix";
                    } else if(runningApp == "YouTube"){
                      return "mdi-youtube";
                    }
                  }

                },
                classes: ['-custom-media_player'],
                state: false,
              },
              {
                hidden: function (item, entity){
                  var mediacenter_state = this.parseFieldValue('&media_player.mediacenter_woonkamer.state');

                  if (mediacenter_state == "off" || mediacenter_state == "idle"){
                    return false;
                  } else {
                    return true;
                  }
                },
                position: [0,0],
                height: 2,
                width: 2,
                type: TYPES.CUSTOM,
                title: 'Mediacenter',
                subtitle: 'Er wordt geen media afgespeeld.',
                id: [],
                classes: ['-custom-media_player-placeholder'],
                state: false,
              },
            ]
          },

          {
            title: '',
            width: 2,
            height: 2,
            items: [
              {
                position: [0,0],
                height: 0.5,
                width: 2,
                type: TYPES.SCRIPT,
                id: 'script.watch_tv',
                title: 'TV Kijken',
                classes: ['-action-btn'],
                state: false,
              },
              {
                position: [0,0.5],
                height: 0.5,
                width: 2,
                type: TYPES.POPUP_IFRAME,
                id: [],
                title: 'Film / serie kijken',
                classes: ['-action-btn'],
                state: false,
                url: 'https://emby.shortwood-online.nl',
              },
              {
                position: [0,1],
                height: 0.5,
                width: 2,
                type: TYPES.SCRIPT,
                id: 'script.listen_music',
                title: 'Muziek luisteren',
                classes: ['-action-btn'],
                state: false,
              },
              {
                position: [0,1.5],
                height: 0.5,
                width: 2,
                type: TYPES.SCRIPT,
                id: 'script.shutdown_mediacenter',
                title: 'Afsluiten',
                classes: ['-action-btn -action-red'],
                state: false,
              },
            ]
          },
        ]
      },

      // MUSIC [index=5]
      {
        title: 'Music',
        bg: '',
        icon: 'mdi-speaker', // home icon
        tileSize: 200,
        groupMarginCss: '0px 90px 0px 120px',
        groups: [

          // NOT PLAYING
          {
            title: '',
            hidden: function (){
              group_downstairs = this.parseFieldValue('&media_player.beneden.state');
              group_upstairs = this.parseFieldValue('&media_player.boven.state');
              media_player_kitchen = this.parseFieldValue('&media_player.keuken.state');
              if ((group_downstairs != "playing" && group_downstairs != "paused") &&
                (group_upstairs != "playing" && group_upstairs != "paused") &&
                (media_player_kitchen != "playing" && media_player_kitchen != "paused"))
              {
                return false;
              } else {
                return true;
              }
            },
            width: 2,
            height: 2,
            items: [
              {
                id: [],
                position: [0,0],
                height: 2,
                width: 2,
                type: TYPES.CUSTOM,
                subtitle: '',
                classes: ['-custom-music_player-placeholder']
              },
              {
                id: [],
                position: [0.1,0.1],
                height: 0.35,
                width: 1.8,
                type: TYPES.CUSTOM,
                title: 'Alle apparaten',
                classes: ['-action-btn','-inline','-active'],
                action: function(){
                  setActivePlayer('media_player.alle_apparaten',1);
                }
              },
              {
                id: [],
                position: [0.1,0.45],
                height: 0.35,
                width: 1.8,
                type: TYPES.CUSTOM,
                title: 'Beneden',
                classes: ['-action-btn','-inline'],
                action: function(){
                  setActivePlayer('media_player.beneden',2);
                }
              },
              {
                id: [],
                position: [0.1,0.8],
                height: 0.35,
                width: 1.8,
                type: TYPES.CUSTOM,
                title: 'Boven',
                classes: ['-action-btn','-inline'],
                action: function(){
                  setActivePlayer('media_player.boven',3);
                }
              },
              {
                id: [],
                position: [0.1,1.15],
                height: 0.35,
                width: 1.8,
                type: TYPES.CUSTOM,
                title: 'Keuken',
                classes: ['-action-btn','-inline'],
                action: function(){
                  setActivePlayer('media_player.keuken',4);
                }
              },
              {
                id: [],
                position: [0.1,1.5],
                height: 0.35,
                width: 1.8,
                type: TYPES.CUSTOM,
                title: 'Mediacenter',
                classes: ['-action-btn','-inline'],
                action: function(){
                  setActivePlayer('media_player.mediacenter',5);
                }
              }
            ]
          },
          {
            title: '',
            hidden: function (){
              group_downstairs = this.parseFieldValue('&media_player.beneden.state');
              group_upstairs = this.parseFieldValue('&media_player.boven.state');
              media_player_kitchen = this.parseFieldValue('&media_player.keuken.state');
              media_player_woonkamer = this.parseFieldValue('&media_player.woonkamer_2.state');
              media_player_mediacenter = this.parseFieldValue('&media_player.mediacenter');
              if ((group_downstairs != "playing" && group_downstairs != "paused") &&
                (group_upstairs != "playing" && group_upstairs != "paused") &&
                (media_player_kitchen != "playing" && media_player_kitchen != "paused"))
              {
                return false;
              } else {
                return true;
              }
            },
            width: 2,
            height: 1.5,
            items: [
              {
                id: [],
                position: [0,0],
                height: 0.5,
                width: 2,
                type: TYPES.CUSTOM,
                title: function(item,entity){
                  time = new Date();

                  if (0 <= time.getHours() && time.getHours() < 11){
                    todPlaylist = 'spotify:playlist:37i9dQZF1DX5dJCW6dyCUe';
                    return "Ochtendplaylist afspelen";
                  } else if (11 <= time.getHours() && time.getHours() < 17){
                    todPlaylist = 'spotify:playlist:37i9dQZF1DX9u7XXOp0l5L';
                    return "Middagplaylist afspelen";
                  } else if (17 <= time.getHours() && time.getHours() < 19){
                    todPlaylist = 'spotify:playlist:37i9dQZF1DX2FsCLsHeMrM';
                    return "Kookplaylist afspelen";
                  } else if (19 <= time.getHours() && time.getHours() <= 23){
                    todPlaylist = 'spotify:playlist:37i9dQZF1DX9TriA5Rm2k8';
                    return "Avondplaylist afspelen";
                  }
                },
                classes: ['-action-btn'],
                action: function(){
                  var offset = Math.floor(Math.random() * 51);
                  this.apiRequest({
                    type: 'call_service',
                    domain: 'script',
                    service: 'play_playlist_on',
                    service_data: {
                      device: activePlayer,
                      playlist: todPlaylist,
                      offset_nr: offset
                    }
                  });
                },
              },
              {
                id: [],
                position: [0,0.5],
                height: 0.5,
                width: 2,
                type: TYPES.CUSTOM,
                title: 'Peter\'s favorieten afspelen',
                classes: ['-action-btn'],
                action: function(){
                  var offset = Math.floor(Math.random() * 10);
                  this.apiRequest({
                    type: 'call_service',
                    domain: 'script',
                    service: 'play_playlist_on',
                    service_data: {
                      device: activePlayer,
                      playlist: 'spotify:playlist:7B9EXUACaF7uZVLpdnaMaX',
                      offset_nr: offset
                    }
                  });
                },
              },
              {
                id: [],
                position: [0,1],
                height: 0.5,
                width: 2,
                type: TYPES.CUSTOM,
                title: 'Sharona\'s favorieten afspelen',
                classes: ['-action-btn'],
                action: function(){
                  var offset = Math.floor(Math.random() * 100);
                  this.apiRequest({
                    type: 'call_service',
                    domain: 'script',
                    service: 'play_playlist_on',
                    service_data: {
                      device: activePlayer,
                      playlist: 'spotify:playlist:4Bw1ZHM4kTHiQ2pwSZayeE',
                      offset_nr: offset
                    }
                  });
                },
              },
            ]
          },

          // PLAYER
          {
            title: '',
            width: 2,
            height: 2,
            items: [
              {
                position: [0,0],
                height: 2,
                width: 2,
                type: TYPES.CUSTOM,
                title: '@attributes.media_title',
                subtitle: '@attributes.media_artist',
                id: 'media_player.keuken',
                bgSuffix: '@attributes.entity_picture_local',
                classes: ['-custom-music_player'],
                state: false,
              }
            ]
          },
          {
            title: '',
            width: 2,
            height: 1.75,
            items: [
              {
                position: [0.0125,0],
                height: 0.30,
                width: 0.30,
                type: TYPES.CUSTOM,
                icon: function(){
                  group_downstairs = this.parseFieldValue('&media_player.beneden.state');
                  group_upstairs = this.parseFieldValue('&media_player.boven.state');
                  media_player_kitchen = this.parseFieldValue('&media_player.keuken.state');
                  media_player_woonkamer = this.parseFieldValue('&media_player.woonkamer_2.state');
                  media_player_mediacenter = this.parseFieldValue('&media_player.mediacenter');

                  if (group_downstairs == "playing" || group_upstairs == "playing" ||
                      media_player_kitchen == "playing" || media_player_mediacenter == "playing"){
                        return "mdi-pause-circle-outline";
                  } else {
                        return "mdi-play-circle-outline";
                  }
                },
                id: [],
                classes: ['-custom-music_player-control'],
                state: false,
                action: function(item,entity){
                  group_downstairs = this.parseFieldValue('&media_player.beneden.state');
                  group_upstairs = this.parseFieldValue('&media_player.boven.state');
                  media_player_kitchen = this.parseFieldValue('&media_player.keuken.state');
                  media_player_woonkamer = this.parseFieldValue('&media_player.woonkamer_2.state');
                  media_player_mediacenter = this.parseFieldValue('&media_player.mediacenter');

                  if (group_downstairs == "playing" || group_downstairs == "paused"){
                    this.apiRequest({
                      type: 'call_service',
                      domain: 'media_player',
                      service: 'media_play_pause',
                      service_data: {
                        entity_id: 'media_player.beneden'
                      }
                    });
                  } else if (group_upstairs == "playing" || group_downstairs == "paused"){
                    this.apiRequest({
                      type: 'call_service',
                      domain: 'media_player',
                      service: 'media_play_pause',
                      service_data: {
                        entity_id: 'media_player.boven'
                      }
                    });
                  } else if (media_player_kitchen == "playing" || media_player_kitchen == "paused"){
                    this.apiRequest({
                      type: 'call_service',
                      domain: 'media_player',
                      service: 'media_play_pause',
                      service_data: {
                        entity_id: 'media_player.keuken'
                      }
                    });
                  } else if (media_player_mediacenter == "playing" || media_player_mediacenter == "paused"){
                    this.apiRequest({
                      type: 'call_service',
                      domain: 'media_player',
                      service: 'media_play_pause',
                      service_data: {
                        entity_id: 'media_player.mediacenter_woonkamer'
                      }
                    });
                  }
                }
              },
              {
                position: [0.3625,0],
                height: 0.30,
                width: 0.30,
                type: TYPES.CUSTOM,
                icon: 'mdi-stop-circle-outline',
                id: [],
                classes: ['-custom-music_player-control'],
                state: false,
                action: function(item,entity){
                  group_downstairs = this.parseFieldValue('&media_player.beneden.state');
                  group_upstairs = this.parseFieldValue('&media_player.boven.state');
                  media_player_kitchen = this.parseFieldValue('&media_player.keuken.state');
                  media_player_woonkamer = this.parseFieldValue('&media_player.woonkamer_2.state');
                  media_player_mediacenter = this.parseFieldValue('&media_player.mediacenter');

                  if (group_downstairs == "playing" || group_downstairs == "paused"){
                    this.apiRequest({
                      type: 'call_service',
                      domain: 'media_player',
                      service: 'turn_off',
                      service_data: {
                        entity_id: 'media_player.beneden'
                      }
                    });
                  } else if (group_upstairs == "playing" || group_downstairs == "paused"){
                    this.apiRequest({
                      type: 'call_service',
                      domain: 'media_player',
                      service: 'turn_off',
                      service_data: {
                        entity_id: 'media_player.boven'
                      }
                    });
                  } else if (media_player_kitchen == "playing" || media_player_kitchen == "paused"){
                    this.apiRequest({
                      type: 'call_service',
                      domain: 'media_player',
                      service: 'turn_off',
                      service_data: {
                        entity_id: 'media_player.keuken'
                      }
                    });
                  } else if (media_player_mediacenter == "playing" || media_player_mediacenter == "paused"){
                    this.apiRequest({
                      type: 'call_service',
                      domain: 'media_player',
                      service: 'turn_off',
                      service_data: {
                        entity_id: 'media_player.mediacenter_woonkamer'
                      }
                    });
                  }
                }
              },
              {
                position: [0.6925,0],
                height: 0.30,
                width: 0.30,
                type: TYPES.CUSTOM,
                icon: 'mdi-skip-previous-circle-outline',
                id: [],
                classes: ['-custom-music_player-control'],
                state: false,
                action: function(item,entity){
                  group_downstairs = this.parseFieldValue('&media_player.beneden.state');
                  group_upstairs = this.parseFieldValue('&media_player.boven.state');
                  media_player_kitchen = this.parseFieldValue('&media_player.keuken.state');
                  media_player_woonkamer = this.parseFieldValue('&media_player.woonkamer_2.state');
                  media_player_mediacenter = this.parseFieldValue('&media_player.mediacenter');

                  if (group_downstairs == "playing" || group_downstairs == "paused"){
                    this.apiRequest({
                      type: 'call_service',
                      domain: 'media_player',
                      service: 'media_previous_track',
                      service_data: {
                        entity_id: 'media_player.beneden'
                      }
                    });
                  } else if (group_upstairs == "playing" || group_downstairs == "paused"){
                    this.apiRequest({
                      type: 'call_service',
                      domain: 'media_player',
                      service: 'media_previous_track',
                      service_data: {
                        entity_id: 'media_player.boven'
                      }
                    });
                  } else if (media_player_kitchen == "playing" || media_player_kitchen == "paused"){
                    this.apiRequest({
                      type: 'call_service',
                      domain: 'media_player',
                      service: 'media_previous_track',
                      service_data: {
                        entity_id: 'media_player.keuken'
                      }
                    });
                  } else if (media_player_mediacenter == "playing" || media_player_mediacenter == "paused"){
                    this.apiRequest({
                      type: 'call_service',
                      domain: 'media_player',
                      service: 'media_previous_track',
                      service_data: {
                        entity_id: 'media_player.mediacenter_woonkamer'
                      }
                    });
                  }
                }
              },
              {
                position: [1.0425,0],
                height: 0.30,
                width: 0.30,
                type: TYPES.CUSTOM,
                icon: 'mdi-skip-next-circle-outline',
                id: [],
                classes: ['-custom-music_player-control'],
                state: false,
                action: function(item,entity){
                  group_downstairs = this.parseFieldValue('&media_player.beneden.state');
                  group_upstairs = this.parseFieldValue('&media_player.boven.state');
                  media_player_kitchen = this.parseFieldValue('&media_player.keuken.state');
                  media_player_woonkamer = this.parseFieldValue('&media_player.woonkamer_2.state');
                  media_player_mediacenter = this.parseFieldValue('&media_player.mediacenter');

                  if (group_downstairs == "playing" || group_downstairs == "paused"){
                    this.apiRequest({
                      type: 'call_service',
                      domain: 'media_player',
                      service: 'media_next_track',
                      service_data: {
                        entity_id: 'media_player.beneden'
                      }
                    });
                  } else if (group_upstairs == "playing" || group_downstairs == "paused"){
                    this.apiRequest({
                      type: 'call_service',
                      domain: 'media_player',
                      service: 'media_next_track',
                      service_data: {
                        entity_id: 'media_player.boven'
                      }
                    });
                  } else if (media_player_kitchen == "playing" || media_player_kitchen == "paused"){
                    this.apiRequest({
                      type: 'call_service',
                      domain: 'media_player',
                      service: 'media_next_track',
                      service_data: {
                        entity_id: 'media_player.keuken'
                      }
                    });
                  } else if (media_player_mediacenter == "playing" || media_player_mediacenter == "paused"){
                    this.apiRequest({
                      type: 'call_service',
                      domain: 'media_player',
                      service: 'media_next_track',
                      service_data: {
                        entity_id: 'media_player.mediacenter_woonkamer'
                      }
                    });
                  }
                }
              },
              {
                position: [0,0.5],
                height: 0.25,
                width: 2,
                type: TYPES.SLIDER,
                id: 'media_player.beneden',
                unit: '%',
                state: false,
                title: 'Beneden',
                slider: {
                  field: 'volume_level',
                  max: 1,
                  min: 0,
                  step: 0.1,
                  request: {
                    type: 'call_service',
                    domain: 'media_player',
                    service: 'volume_set',
                    field: 'volume_level'
                  }
                },
                classes: ['-custom-volume_slider'],
              },
              {
                position: [0,0.75],
                height: 0.25,
                width: 2,
                type: TYPES.SLIDER,
                id: 'media_player.boven',
                unit: '%',
                state: false,
                title: 'Boven',
                slider: {
                  field: 'volume_level',
                  max: 1,
                  min: 0,
                  step: 0.1,
                  request: {
                    type: 'call_service',
                    domain: 'media_player',
                    service: 'volume_set',
                    field: 'volume_level'
                  }
                },
                classes: ['-custom-volume_slider'],
              },
              {
                position: [0,1],
                height: 0.25,
                width: 2,
                type: TYPES.SLIDER,
                id: 'media_player.keuken',
                unit: '%',
                state: false,
                title: 'Keuken',
                slider: {
                  field: 'volume_level',
                  max: 1,
                  min: 0,
                  step: 0.1,
                  request: {
                    type: 'call_service',
                    domain: 'media_player',
                    service: 'volume_set',
                    field: 'volume_level'
                  }
                },
                classes: ['-custom-volume_slider'],
              },
              {
                position: [0,1.25],
                height: 0.25,
                width: 2,
                type: TYPES.SLIDER,
                id: 'media_player.woonkamer_2',
                unit: '%',
                state: false,
                title: 'Woonkamer',
                slider: {
                  field: 'volume_level',
                  max: 1,
                  min: 0,
                  step: 0.1,
                  request: {
                    type: 'call_service',
                    domain: 'media_player',
                    service: 'volume_set',
                    field: 'volume_level'
                  }
                },
                classes: ['-custom-volume_slider'],
              },
              {
                position: [0,1.50],
                height: 0.25,
                width: 2,
                type: TYPES.SLIDER,
                id: 'media_player.mediacenter',
                unit: '%',
                state: false,
                title: 'Mediacenter',
                slider: {
                  field: 'volume_level',
                  max: 1,
                  min: 0,
                  step: 0.1,
                  request: {
                    type: 'call_service',
                    domain: 'media_player',
                    service: 'volume_set',
                    field: 'volume_level'
                  }
                },
                classes: ['-custom-volume_slider'],
              },
            ]
          },
        ]
      },

      // APPLIANCES [index=6]
      {
        title: 'Appliances',
        bg: '',
        icon: 'mdi-washing-machine', // home icon
        tileSize: 200,
        groupMarginCss: '0px 265px 0px 265px',
        groups: [
          {
            title: '',
            width: 3.75,
            height: 1,
            items: [
              {
              // WASHING MACHINE
                 position: [0, 0],
                 type: TYPES.CUSTOM,
                 title: 'Wasmachine',
                 subtitle: function(item, entity){
                   wm = this.parseFieldValue('&input_select.wasmachine_status.state');

                   if (wm == 'Schoon'){
                     return 'Schoon';
                   }

                   if (wm == 'Wassen'){
                     return 'Wassen (' + elapsedTime( this.parseFieldValue('&input_select.wasmachine_status.last_changed') ) +')';
                   }

                   if (wm == 'Inactief'){
                     return 'Inactief';
                   }

                 },
                 id: 'input_select.wasmachine_status',
                 state: false,
                 icon: '',
                 classes: ['-big-round-icon'],
                 icon: 'mdi-washing-machine',
                 action: function(item, entity) {

                 },
              },

              {
              // DRYER
                 position: [1.25, 0],
                 type: TYPES.CUSTOM,
                 title: 'Droger',
                 subtitle: function(item, entity){
                   td = this.parseFieldValue('&input_select.droger_status.state');

                   if (td == 'Schoon'){
                     return 'Schoon';
                   }

                   if (td == 'Drogen'){
                     return 'Drogen (' + elapsedTime( this.parseFieldValue('&input_select.droger_status.last_changed') ) +')';
                   }

                   if (td == 'Inactief'){
                     return 'Inactief';
                   }

                 },
                 id: 'input_select.droger_status',
                 state: false,
                 icon: '',
                 classes: ['-big-round-icon'],
                 icon: 'mdi-tumble-dryer',
                 action: function(item, entity) {

                 },
              },

              {
              // DISHWASHER
                 position: [2.50, 0],
                 type: TYPES.CUSTOM,
                 title: 'Vaatwasser',
                 subtitle: function(item, entity){
                   dw = this.parseFieldValue('&input_select.vaatwasser_status.state');

                   if (dw == 'Schoon'){
                     return 'Schoon';
                   }

                   if (dw == 'Wassen'){
                     return 'Wassen (' + elapsedTime( this.parseFieldValue('&input_select.vaatwasser_status.last_changed') ) +')';
                   }

                   if (dw == 'Inactief'){
                     return 'Inactief';
                   }


                 },
                 id: 'input_select.vaatwasser_status',
                 state: false,
                 icon: 'mdi-dishwasher',
                 classes: ['-big-round-icon'],
                 action: function(item, entity) {

                 },
              },
            ]
          }
        ]
      },

      // RECYCLING [index=7]
      {
        title: 'Recycling',
        bg: '',
        icon: 'mdi-recycle', // home icon
        tileSize: 200,
        groupMarginCss: '0px 265px 0px 265px',
        groups: [
          {
            title: '',
            width: 3.75,
            height: 1,
            items: [
              {
                position: [0, 0],
                type: TYPES.CUSTOM,
                title: 'PMD',
                subtitle: function(item,entity){
                  return timeUntil(entity.state);
                },
                id: 'sensor.avalex_pmd',
                icon: 'mdi-trash-can-outline',
                state: function(item,entity){
                  if (this.parseFieldValue('&sensor.avalex_vandaag.state') == "pmd"){
                    return 'on';
                  } else {
                    return 'off';
                  }
                },
                classes: ['-big-round-icon', '-recycle'],
                customStyles: {
                  'background-color': '#778ca3'
                },
              },
              {
                position: [1.25, 0],
                type: TYPES.CUSTOM,
                title: 'GFT',
                subtitle: function(item,entity){
                  return timeUntil(entity.state);
                },
                id: 'sensor.avalex_gft',
                icon: 'mdi-trash-can-outline',
                state: function(item,entity){
                  if (this.parseFieldValue('&sensor.avalex_vandaag.state') == "gft"){
                    return 'on';
                  } else {
                    return 'off';
                  }
                },
                classes: ['-big-round-icon', '-recycle'],
                customStyles: {
                  'background-color': '#20bf6b'
                },
              },
              {
                position: [2.5, 0],
                type: TYPES.CUSTOM,
                title: 'Papier',
                subtitle: function(item,entity){
                  return timeUntil(entity.state);
                },
                id: 'sensor.avalex_papier',
                icon: 'mdi-trash-can-outline',
                state: false,
                classes: ['-big-round-icon'],
                customStyles: {
                  'background-color': '#3867d6'
                },
              },
            ]
          }
        ],
      },

      // PERSON PETER [index=8]
      {
        title: 'Peter',
        showInMenu: false,
        bg: '',
        icon: '', // home icon
        tileSize: 200,
        groupMarginCss: '0px 170px 0px 170px',
        groups: [
          {
            title: '',
            width: 1,
            height: 1,
            items: [
              {
                position: [0, 0],
                type: TYPES.CUSTOM,
                title: 'Peter',
                id: {},
                icon: '',
                classes: ['-big-round-img'],
                bgSuffix: '/local/img/pkorthout.jpg',
                action: function(){
                  window.openPage(CONFIG.pages[0]);
                }
              }
            ]
          },
          {
            title: '',
            width: 2,
            height: 1.25,
            items: [
              {
                position: [0, 0],
                width: 2,
                height: 0.5,
                type: TYPES.INPUT_BOOLEAN,
                title: 'Slaapmodus',
                state: false,
                id: 'input_boolean.peter_inbed',
                icon: '',
                classes: ['-action-btn'],
                action: function(item,entity){
                  if (entity.state == "off"){
                    this.apiRequest({
                      type: 'call_service',
                      domain: 'automation',
                      service: 'trigger',
                      service_data: {
                        entity_id: 'automation.applewatch_peter_sleepmode_on'
                      }
                    });
                  } else {
                    this.apiRequest({
                      type: 'call_service',
                      domain: 'automation',
                      service: 'trigger',
                      service_data: {
                        entity_id: 'automation.applewatch_peter_sleepmode_off'
                      }
                    });
                  }
                },
              },
              {
                position: [0, 0.75],
                width: 2,
                height: 0.25,
                type: TYPES.CUSTOM,
                title: 'Kamer',
                subtitle: '&sensor.roompresence_peter.state',
                state: false,
                id: [],
                icon: '',
                classes: ['-discriptive-btn','-half'],
              },
              {
                position: [0, 1],
                width: 2,
                height: 0.25,
                type: TYPES.CUSTOM,
                title: 'Huidige reistijd',
                subtitle: '&sensor.reistijd_peter_werk.state minuten',
                state: false,
                id: [],
                icon: '',
                classes: ['-discriptive-btn','-half'],
              },
            ]
          },
        ]
      },

      // PERSON SHARONA [index=9]
      {
        title: 'Sharona',
        showInMenu: false,
        bg: '',
        icon: '', // home icon
        tileSize: 200,
        groupMarginCss: '0px 170px 0px 170px',
        groups: [
          {
            title: '',
            width: 1,
            height: 1,
            items: [
              {
                position: [0, 0],
                type: TYPES.CUSTOM,
                title: 'Sharona',
                id: {},
                icon: '',
                classes: ['-big-round-img'],
                bgSuffix: '/local/img/skorthout.jpg',
                action: function(){
                  window.openPage(CONFIG.pages[0]);
                }
              }
            ]
          },
          {
            title: '',
            width: 2,
            height: 1.75,
            items: [
              {
                position: [0, 0],
                width: 2,
                height: 0.5,
                type: TYPES.INPUT_BOOLEAN,
                title: 'Slaapmodus',
                state: false,
                id: 'input_boolean.sharona_inbed',
                icon: '',
                classes: ['-action-btn'],
                action: function(item,entity){
                  if (entity.state == "on"){
                    this.apiRequest({
                      type: 'call_service',
                      domain: 'automation',
                      service: 'trigger',
                      service_data: {
                        entity_id: 'automation.applewatch_sharona_sleepmode_off'
                      }
                    });
                  } else {
                    this.apiRequest({
                      type: 'call_service',
                      domain: 'automation',
                      service: 'trigger',
                      service_data: {
                        entity_id: 'automation.applewatch_sharona_sleepmode_on'
                      }
                    });
                  }
                },
              },
              {
                position: [0, 0.75],
                width: 2,
                height: 0.5,
                type: TYPES.CUSTOM,
                title: 'Kamer',
                subtitle: '&sensor.roompresence_sharona.state',
                state: false,
                id: [],
                icon: '',
                classes: ['-discriptive-btn','-half'],
              },
              {
                position: [0, 1.25],
                width: 2,
                height: 0.5,
                type: TYPES.CUSTOM,
                title: 'Huidige reistijd',
                subtitle: '&sensor.reistijd_sharona_werk.state minuten',
                state: false,
                id: [],
                icon: '',
                classes: ['-discriptive-btn','-half'],
              },
            ]
          },
        ]
      },

      // HOUSE [index=10]
      {
        title: 'House',
        showInMenu: false,
        bg: '',
        icon: '', // home icon
        tileSize: 200,
        groupMarginCss: '0px 170px 0px 170px',
        groups: [
          {
            title: '',
            width: 1,
            height: 1,
            items: [
              {
                position: [0, 0],
                type: TYPES.CUSTOM,
                title: 'Huis',
                id: {},
                icon: 'mdi-home',
                classes: ['-big-round-icon'],
                action: function(){
                  window.openPage(CONFIG.pages[0]);
                }
              }
            ]
          },
          {
            title: '',
            width: 2,
            height: 2,
            items: [
              {
                position: [0, 0],
                width: 0.5,
                height: 0.5,
                type: TYPES.CUSTOM,
                title: '',
                subtitle: '&sensor.total_lights_on.state',
                state: false,
                id: [],
                icon: 'mdi-lightbulb-outline',
                classes: ['-round-icon-number'],
              },
              {
                position: [0.75, 0],
                width: 0.5,
                height: 0.5,
                type: TYPES.CUSTOM,
                title: '',
                subtitle: '&sensor.total_doors_open.state',
                state: false,
                id: [],
                icon: 'mdi-door',
                classes: ['-round-icon-number'],
              },
              {
                position: [1.5, 0],
                width: 0.5,
                height: 0.5,
                type: TYPES.CUSTOM,
                title: '',
                subtitle: '&sensor.total_windows_open.state',
                state: false,
                id: [],
                icon: 'mdi-window-closed',
                classes: ['-round-icon-number'],
              },
              {
                position: [0, 1],
                width: 2,
                height: 0.5,
                id: [],
                type: TYPES.CUSTOM,
                title: 'Gastmodus',
                state: false,
                icon: '',
                id: 'input_select.house_mode',
                classes: ['-action-btn','-action-guest'],
                action: function(item, entity){
                  this.apiRequest({
                    type: 'call_service',
                    domain: 'script',
                    service: 'enable_guest_mode',
                  });
                }
              },
              {
                position: [0, 1.5],
                width: 2,
                height: 0.5,
                id: [],
                type: TYPES.CUSTOM,
                title: 'Huis afsluiten',
                state: false,
                icon: '',
                classes: ['-action-btn', '-action-red'],
              }
            ]
          },
        ]
      },
   ],

   events: [
     {
       command: 'music_playing',
       action: function(e){
         window.openPage(CONFIG.pages[5]);
         if (typeof fully !== undefined) {
            fully.turnScreenOn();
            fully.bringToForeground();
         }
       }
     },

   ]
}
