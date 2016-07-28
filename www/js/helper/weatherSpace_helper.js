var WeatherSpaceHelper = {
    /**
     * @param {Number} lat
     * @param {Number} long
     *
     * @return {Promise}
     */
    getTemperatureByLatLong: function getTemperatureByLatLong(lat, long) {
        var now = new Date();

        return $.get('https://www.wetter.space/cgi-bin/jsonGenerator.cgi', {
            lat: lat,
            long: long,
            start_date: '2000-01-01',
            end_date: now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2),
            element: 'Lufttemperatur Tagesmittel'
        });
    },

    /**
     * @param {Number} lat
     * @param {Number} long
     *
     * @return {Promise}
     */
    getPrecitipationByLatLong: function getPrecitipationByLatLong(lat, long) {
        var now = new Date();

        return $.get('https://www.wetter.space/cgi-bin/jsonGenerator.cgi', {
            lat: lat,
            long: long,
            start_date: '2000-01-01',
            end_date: now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2),
            element: 'Niederschlagshöhe'
        });
    }
};
