require('dotenv').config()


const { leerInput,pausa, inquirerMenu, listarLugares } = require("./helper/inquirer")
const Busquedas = require("./model/busquedas");


const main = async () => {

    const busquedas = new Busquedas();
    busquedas.leerDB();
    let opt;
    do {
        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                //Mostrar mensaje
                const lugar = await leerInput('Ciudad: ');
                //buscar los lugares
                const lugares = await busquedas.ciudad(lugar);
                const id = await listarLugares(lugares);

                if (id === '0') continue;

                console.log({id});
                const lugarSel = lugares.find(l => l.id === id);
                busquedas.agregarHistorial(lugarSel.nombre);
                console.log(lugarSel);
                //Seleccionar el lugares
                const clima = await busquedas.buscarClima(lugarSel.lng, lugarSel.lat);
                console.log(clima);

                //Clima

                //Mostrar resultados
                console.log('\nInfomración de la ciudad\n'.green);
                console.log(`Ciudad: ${lugarSel.nombre}`);
                console.log(`Lat: ${lugarSel.lat}`);
                console.log(`Lng: ${lugarSel.lng}`);
                console.log(`Temperatura: ${clima.temperatura}`);
                console.log(`Mínima: ${clima.minima}`);
                console.log(`Máxima: ${clima.maxima}`);
                console.log(`Clima: ${clima.clima_desc}`);



                break;
            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(idx, lugar);
                });

                break



            default:
                break;
        }



        if (opt !== 0) await pausa();

    } while (opt !== 0);
    

}

main();