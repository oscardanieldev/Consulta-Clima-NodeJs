const fs = require('fs');
const axios = require('axios');



class Busquedas{
    historial = [];
    dbPath = './db/database.json';
    constructor(){
        //TODO: leer DB si existe
    }

    get paramsMapBox() {
         return {
            'access_token':process.env.MAPBOX_KEY,
            'limit': 5,
            'language':'es'
         }
    }

    async ciudad(lugar=''){
        //petición hhtp
        // console.log('Ciudad:',lugar);

        try {
            //  const resp = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/-99.04538500559175,19.639117282887838.json?types=place%2Cpostcode%2Caddress&language=es&limit=1&access_token=pk.eyJ1Ijoib3NjYXJkYW5pZWxkZXYiLCJhIjoiY2wxcW14Ynp2MXBzcTNpczkyMnJoYXF4eCJ9.18HI5jntEzBWyfaVJQk6cQ');
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapBox
            });

            const resp = await instance.get();


            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));
            
        } catch (error) {
            return [];
        }
       



        return[]; //retornar lugares
    }

     paramsWeather = (lon, lat) => {
        return{
            lat,
            lon,
            'appid': process.env.OPEN_WEATHER,
            'units':'metric',
            'lang': 'es'
        }
    }

    async buscarClima(lon, lat){

        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: this.paramsWeather(lon, lat)
               
            });

            const resp = await instance.get();
            const clima = resp.data;
            return {
                temperatura :   clima.main.temp,
                minima:         clima.main.temp_min,
                maxima:         clima.main.temp_max,
                clima_desc:     clima.weather[0].description,
            }


        } catch (error) {
            console.log(error);
        }

    }


    agregarHistorial( lugar = '' ){

        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return;            
        }
        this.historial = this.historial.splice(0,5);
        this.historial.unshift(lugar);
        this.guardarDB();
    }


    guardarDB(){

        const payload = {
            historial: this.historial
        };  
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }
    leerDB(){
        if (!fs.existsSync(this.dbPath)) return;

        const info = fs.readFileSync(this.dbPath, {ecoding:'utf-8'});
        const data = JSON.parse(info);

        this.historial = data.historial;
    }

    get historialCapitalizado () {
        return this.historial.map(lugar => {

            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));
            return palabras.join(' ');
        })
    }

}

module.exports = Busquedas