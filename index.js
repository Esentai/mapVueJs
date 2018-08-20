var config = {
    apiKey: "AIzaSyC4x1PNCbT3g9a2V3pz-m-Y_DBRuqyEQVw",
    authDomain: "smart-belgi.firebaseapp.com",
    databaseURL: "https://smart-belgi.firebaseio.com",
    projectId: "smart-belgi",
    storageBucket: "smart-belgi.appspot.com",
    messagingSenderId: "676628858623"
};
firebase.initializeApp(config);

const database = firebase.database();


const vm = new Vue({

    el: "#root",

    data: () => {
        return {
            map: {},
            icons: [],
        };

    },

    created: function() {
        this.createMap();

    },
    methods: {
        createMap: function () {
            database.ref('sign').on('value', this.saveData);

            ymaps.ready(() => {
                const map = new window.ymaps.Map("map", {
                    center: [43.200098, 76.904913],
                    zoom: 17,
                    controls: [],
                });
                map.controls.add(new ymaps.control.ZoomControl({options: { position: { left: 10, top: 90 }}}));
                this.$data.map = map;
            })
        },

        createPlacemark: function(lat, lng, icon) {
            let place = new ymaps.Placemark([lat, lng], {
                balloonContent: '<div>Facebook</div>'
            }, {
                iconLayout: 'default#image',
                iconImageHref: icon,
                iconImageSize: [50, 50],
            });
            place.events.add('click', this.up);
            return(
                place
            )
        },

        up: function () {
            let map = this.$data.map;
            var updates = {};
            updates['sign/sign1/icon'] = 'https://image.flaticon.com/icons/svg/515/515018.svg';
            database.ref().update(updates);
        },

        saveData: function (snapshot) {
            let value = snapshot.val();
            Object.entries(value).map(([key, v]) => {
                console.log(v);
                this.$data.map.geoObjects.add(this.createPlacemark(v.lat, v.lng, v.icon))
            });
        },
    }
});
