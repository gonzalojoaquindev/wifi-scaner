import pool from "../database/keys";
import cloudinary from "../lib/cloudinary";
import { DateTime } from "luxon";

const scanner = require('node-wifi-scanner');

/* let timer = setInterval(() => {
    scanner.scan((err, networks) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(networks);
    });
}, 2000) */

const ap = {};
let redes = null

ap.create = (req, res) => {
    console.log('request ', req.body)
    const { date } = req.body
    console.log('guardando escaner realizado en ', date)
    scanner.scan((err, networks) => {
        if (err) {
            console.error(err);
            return;
        }
        redes = networks
        /* console.log("dentro ", redes) */
        redes.forEach(element => {
            const { ssid, mac, rssi, channel } = element
            /*  console.log(ssid); */
            try {

                pool.query(
                    "INSERT INTO scan (ssid, mac, rssi, channel, date ) VALUES ($1, $2, $3, $4, $5)", [ssid, mac, rssi, channel, date]
                );

            } catch (error) {
                res.status(500).json({ message: 'ocurrió un error' })
                console.log(error)
            }
        });
    });
}






/* ap.create = async (req, res) => {
    console.log("mensaje:", req.body)
    const { name, mac, ssid, description } = req.body
    try {
        console.log("name:", name)
        await pool.query(
            "INSERT INTO inventary (name, mac, ssid, description ) VALUES ($1, $2, $3, $4)", [name, mac, ssid, description]
        );


    } catch (error) {
        res.status(500).json({ message: 'ocurrió un error' })
        console.log(error)
    }

} */

/* 
ap.read = async (req, res) => {

    try {
        const scan = await (await pool.query("select inventary.name, scan.ssid, scan.mac, scan.rssi, scan.channel from scan inner join inventary on inventary.mac = scan.mac")).rows;
        res.status(200).json({ message: "Escaneando con nombre", scan })

    } catch (error) {
        res.status(500).json({ message: 'ocurrió un error' })
    }
} */

ap.prueba = async (req, res) => {
    const { date } = req.body
    console.log('probando')
    try {
        const lastScan = await (await pool.query("SELECT inventary.name, scan.ssid, scan.mac, scan.rssi, scan.channel FROM scan LEFT JOIN inventary ON inventary.mac = scan.mac WHERE date=$1", [date])).rows;
        console.log(lastScan)
        res.status(200).json({ message: "Leyendo ultimo scaneo de redes", lastScan })

    } catch (error) {
        res.status(500).json({ message: 'ocurrió un error' })
    }
}


ap.read = async (req, res) => {
    /* const date = DateTime.fromISO() */
    try {
        scanner.scan((err, networks) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(networks);
            const scan = networks
            res.status(200).json({ message: "scaneando", scan })
        });

    } catch (error) {
        res.status(500).json({ message: 'ocurrió un error' })
    }
}


/* ap.read = async (req, res) => {

    try {
        const scan = await (await pool.query('SELECT * FROM scan')).rows[0];
        console.log(scan)
        res.status(200).json({ message: "ap leida correctamente", scan })
    } catch (error) {
        res.status(500).json({ message: 'ocurrió un error' })
    }
} */

ap.update = async (req, res) => {

    const id = req.params.id;
    console.log('la id para editar es: ', id)
    const { create_by_id, assigned_id, teamwork, ot, area, sector, service, component, equipment, description, equipment_status, no_service, notice_date, priority } = req.body;
    try {
        await pool.query('UPDATE ap SET create_by_id=$1, assigned_id=$2, teamwork=$3 , ot=$4, area=$5 , sector=$6 ,service=$7 , component=$8 , equipment=$9 , description=$10 , equipment_status=$11 , no_service=$12 , notice_date=$13 , priority=$14 WHERE id=$15', [create_by_id, assigned_id, teamwork, ot, area, sector, service, component, equipment, description, equipment_status, no_service, notice_date, priority, id]);
        const ap = await (await pool.query("select ap.id, to_char(ap.notice_date, 'DD-MM-YYYY') as notice_date, users.name, ap.assigned_id, ap.ot, areas.name as area, sectors.name as sector, components.name as component, equipments.name as equipment, services.name as service from ap inner join areas on areas.id = ap.area inner join sectors on sectors.id = ap.sector inner join components on components.id = ap.component inner join equipments on equipments.id = ap.equipment inner join services on services.id = ap.service inner join users on users.id = ap.create_by_id WHERE ap.id = $1", [id])).rows[0];
        res.status(200).json({ message: `ap ${ap.ot} editada correctamente`, ap })

    } catch (error) {
        res.status(500).json({
            message: 'Un error ha ocurrido',
            error
        })
    }
}
ap.delete = async (req, res) => {
    const id = req.params.id;
    try {
        await pool.query('DELETE FROM ap WHERE id=$1', [id]);
        res.status(200).json({ message: "ap eliminada correctamente" })

    } catch (error) {
        res.status(500).json({ message: 'ocurrió un error' })
    }

}



ap.getap = async (req, res) => {
    const { id } = req.body
    console.log('id: ', id)
    try {

        const incomplete = await (await pool.query("select ap.id, ap.description, to_char(ap.notice_date, 'DD-MM-YYYY') as notice_date,  ap.ot, sectors.name as sector, equipments.name as equipment, services.name as service from ap inner join sectors on sectors.id = ap.sector inner join equipments on equipments.id = ap.equipment inner join services on services.id = ap.service inner join users on users.id = ap.create_by_id where create_by_id =$1 and ot_status is null", [id])).rows;
        const complete = await (await pool.query("select ap.id, users.name as close_by, users.avatar as avatar, ap.description, to_char(ap.notice_date, 'DD-MM-YYYY') as notice_date,  ap.ot, sectors.name as sector, equipments.name as equipment, services.name as service from ap inner join sectors on sectors.id = ap.sector inner join equipments on equipments.id = ap.equipment inner join services on services.id = ap.service INNER JOIN users ON users.id = ap.close_by where create_by_id =$1 and ot_status is not null", [id])).rows;


        res.status(200).json({ incomplete, complete });


    } catch (error) {
        res.status(500).json({
            message: 'An error has ocurred',
            error
        })
        console.log(error)
    }

},

    ap.getMyapAssigned = async (req, res) => {
        const { id } = req.body
        console.log('id: ', id)
        try {
            const incomplete = await (await pool.query("select ap.id, to_char(ap.notice_date, 'DD-MM-YYYY') as notice_date, users.name as created_by, ap.assigned_id, ap.ot, areas.name as area, areas.color, sectors.name as sector, components.name as component, equipments.name as equipment, services.name as service, ap.description from ap inner join areas on areas.id = ap.area inner join sectors on sectors.id = ap.sector inner join components on components.id = ap.component inner join equipments on equipments.id = ap.equipment inner join services on services.id = ap.service inner join users on users.id = ap.create_by_id where $1 = any(assigned_id) and ot_status is null", [id])).rows;

            const complete = await (await pool.query("select ap.id, to_char(ap.notice_date, 'DD-MM-YYYY') as notice_date, users.name as created_by, ap.assigned_id, ap.ot, areas.name as area, areas.color, sectors.name as sector, components.name as component, equipments.name as equipment, services.name as service, ap.description from ap inner join areas on areas.id = ap.area inner join sectors on sectors.id = ap.sector inner join components on components.id = ap.component inner join equipments on equipments.id = ap.equipment inner join services on services.id = ap.service inner join users on users.id = ap.create_by_id where $1 = any(assigned_id) and ot_status is not null", [id])).rows;


            res.status(200).json({ incomplete, complete });

        } catch (error) {
            res.status(500).json({
                message: 'An error has ocurred',
                error
            })
            console.log(error)
        }

    },

    ap.readap = async (req, res) => {
        const id = req.params.id
        console.log(id)
        try {
            const ap = await (await pool.query("SELECT ap.id, to_char(ap.notice_date,'DD-MM-YYYY') as notice_date, users.name as created_by, ap.assigned_id, ap.ot, areas.name as area, areas.color, sectors.name as sector, components.name as component, equipments.name as equipment, services.name as service, ap.description FROM ap INNER JOIN areas on areas.id = ap.area inner join sectors on sectors.id = ap.sector inner join components on components.id = ap.component inner join equipments on equipments.id = ap.equipment inner join services on services.id = ap.service inner join users on users.id = ap.create_by_id WHERE ap.id=$1", [id])).rows[0];
            res.status(200).json({ message: "ap leida correctamente", ap })
        } catch (error) {
            res.status(500).json({ message: 'ocurrió un error' })
            console.log(error)
        }
    }


ap.addDelivery = async (req, res) => {
    const { ap_id, close_by, start_date, end_date, start_time, end_time, workers, ot_status, failure, ot } = req.body;
    console.log('estoy escuchando, me estas mandando: ', req.body)
    /*   const d_filename = req.files.d_file.name;
      const d_file = await cloudinary(req.files.d_file.tempFilePath); */
    const start = DateTime.fromISO(start_date + 'T' + start_time)
    const end = DateTime.fromISO(end_date + 'T' + end_time)
    const hours = end.diff(start, 'hours').values.hours
    const duration = hours.toFixed(1)
    const hh = (workers * hours).toFixed(1)
    console.log('duration: ', duration)
    console.log('hh: ', hh)
    try {
        await pool.query(
            /*  "INSERT INTO apdelivery (ap_id, close_by, start_date, end_date, start_time, end_time, duration, workers, hh, ot_status, failure) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)", [ap_id, close_by, start_date, end_date, start_time, end_time, duration, workers, hh, ot_status, failure]
         ); */
            "UPDATE ap set close_by = $1, start_date =$2, end_date=$3, start_time=$4, end_time=$5, duration=$6, workers=$7, hh=$8, ot_status=$9, failure=$10 WHERE id = $11", [close_by, start_date, end_date, start_time, end_time, duration, workers, hh, ot_status, failure, ap_id]
        );
        res.status(200).json({
            message: `ap ${ot} cerrada correctamente`,
        });
    } catch (error) {
        res.status(500).json({
            message: "An error has ocurred",
            error,
        });
        console.log(error)
    }
};






module.exports = ap;