// HOMEPAGE [index=0]
{
   title: 'Main page',
   bg: '',
   icon: 'mdi-home-outline', // home icon
   tileSize: 200,
   groupMarginCss: '140px',
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
                 window.openPage(CONFIG.pages[1]);
              },
              secondaryAction: function(item, entity) {

              }
           },

           // HOUSE MODE
           {
              position: [1.25, 0],
              type: TYPES.SCRIPT,
              title: 'Huismodus',
              subtitle: '&input_select.house_mode.state',
              id: 'script.enable_guest_mode',
              state: false,
              icon: function (item,entity){
                if (this.parseFieldValue('&input_select.house_mode.state') == "Thuis"){
                  return 'mdi-home';
                } else if (this.parseFieldValue('&input_select.house_mode.state') == "Gast"){
                  return 'mdi-account-multiple';
                }
              },
              classes: ['-big-round-icon', '-no-triangle'],
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
              classes: ['-big-round-icon'],
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

              },
              secondaryAction: function(item, entity) {

              }
           },

         ]
      }
   ]
},
