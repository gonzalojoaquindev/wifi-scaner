import pool from "../database/keys";
import cloudinary from "../lib/cloudinary";
import { DateTime } from "luxon";

const pm03 = {};

pm03.create = async (req, res) => {
    console.log(req.body)
    const { create_by_id, assigned_id, teamwork, area, sector, service, component, equipment, description, equipment_status, no_service, notice_date, priority } = req.body
    console.log(notice_date)
    try {

        const count = await (await pool.query("select * from pm03 where notice_date = $1;", [notice_date])).rowCount;
        console.log('las pm03 del dia son:', count);
        const day = notice_date.substr(8, 2)
        const month = notice_date.substr(5, 2)
        const year = notice_date.substr(2, 2)
        let separator = count > 9 ? "8" : "80";

        const ot = day + month + year + separator + count
        console.log(ot)
        await pool.query(
            "INSERT INTO pm03 (create_by_id, assigned_id, teamwork , ot, area , sector ,service , component , equipment , description , equipment_status , no_service , notice_date , priority ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)", [create_by_id, assigned_id, teamwork, ot, area, sector, service, component, equipment, description, equipment_status, no_service, notice_date, priority]
        );

        const pm03 = await (await pool.query("select pm03.id,pm03.description, pm03.ot, to_char(pm03.notice_date, 'DD-MM-YYYY') as notice_date, areas.name as area, sectors.name as sector, components.name as component, equipments.name as equipment, services.name as service from pm03 inner join areas on areas.id = pm03.area inner join sectors on sectors.id = pm03.sector inner join components on components.id = pm03.component inner join equipments on equipments.id = pm03.equipment inner join services on services.id = pm03.service inner join users on users.id = pm03.create_by_id ORDER BY id DESC LIMIT 1")).rows[0];
        res.status(200).json({ message: `PM03 "${pm03.ot}" agregada correctamente`, pm03 })

    } catch (error) {
        res.status(500).json({ message: 'ocurrió un error' })
        console.log(error)
    }


}


pm03.read = async (req, res) => {
    const id = req.params.id
    console.log(id)
    try {
        const pm03 = await (await pool.query('SELECT * FROM pm03 WHERE id=$1', [id])).rows[0];
        res.status(200).json({ message: "PM03 leida correctamente", pm03 })
    } catch (error) {
        res.status(500).json({ message: 'ocurrió un error' })
    }
}

pm03.update = async (req, res) => {

    const id = req.params.id;
    console.log('la id para editar es: ', id)
    const { create_by_id, assigned_id, teamwork, ot, area, sector, service, component, equipment, description, equipment_status, no_service, notice_date, priority } = req.body;
    try {
        await pool.query('UPDATE pm03 SET create_by_id=$1, assigned_id=$2, teamwork=$3 , ot=$4, area=$5 , sector=$6 ,service=$7 , component=$8 , equipment=$9 , description=$10 , equipment_status=$11 , no_service=$12 , notice_date=$13 , priority=$14 WHERE id=$15', [create_by_id, assigned_id, teamwork, ot, area, sector, service, component, equipment, description, equipment_status, no_service, notice_date, priority, id]);
        const pm03 = await (await pool.query("select pm03.id, to_char(pm03.notice_date, 'DD-MM-YYYY') as notice_date, users.name, pm03.assigned_id, pm03.ot, areas.name as area, sectors.name as sector, components.name as component, equipments.name as equipment, services.name as service from pm03 inner join areas on areas.id = pm03.area inner join sectors on sectors.id = pm03.sector inner join components on components.id = pm03.component inner join equipments on equipments.id = pm03.equipment inner join services on services.id = pm03.service inner join users on users.id = pm03.create_by_id WHERE pm03.id = $1", [id])).rows[0];
        res.status(200).json({ message: `PM03 ${pm03.ot} editada correctamente`, pm03 })

    } catch (error) {
        res.status(500).json({
            message: 'Un error ha ocurrido',
            error
        })
    }
}
pm03.delete = async (req, res) => {
    const id = req.params.id;
    try {
        await pool.query('DELETE FROM pm03 WHERE id=$1', [id]);
        res.status(200).json({ message: "PM03 eliminada correctamente" })

    } catch (error) {
        res.status(500).json({ message: 'ocurrió un error' })
    }

}



pm03.getPm03 = async (req, res) => {
    const { id } = req.body
    console.log('id: ', id)
    try {

        const incomplete = await (await pool.query("select pm03.id, pm03.description, to_char(pm03.notice_date, 'DD-MM-YYYY') as notice_date,  pm03.ot, sectors.name as sector, equipments.name as equipment, services.name as service from pm03 inner join sectors on sectors.id = pm03.sector inner join equipments on equipments.id = pm03.equipment inner join services on services.id = pm03.service inner join users on users.id = pm03.create_by_id where create_by_id =$1 and ot_status is null", [id])).rows;
        const complete = await (await pool.query("select pm03.id, users.name as close_by, users.avatar as avatar, pm03.description, to_char(pm03.notice_date, 'DD-MM-YYYY') as notice_date,  pm03.ot, sectors.name as sector, equipments.name as equipment, services.name as service from pm03 inner join sectors on sectors.id = pm03.sector inner join equipments on equipments.id = pm03.equipment inner join services on services.id = pm03.service INNER JOIN users ON users.id = pm03.close_by where create_by_id =$1 and ot_status is not null", [id])).rows;


        res.status(200).json({ incomplete, complete });


    } catch (error) {
        res.status(500).json({
            message: 'An error has ocurred',
            error
        })
        console.log(error)
    }

},

    pm03.getMyPm03Assigned = async (req, res) => {
        const { id } = req.body
        console.log('id: ', id)
        try {
            const incomplete = await (await pool.query("select pm03.id, to_char(pm03.notice_date, 'DD-MM-YYYY') as notice_date, users.name as created_by, pm03.assigned_id, pm03.ot, areas.name as area, areas.color, sectors.name as sector, components.name as component, equipments.name as equipment, services.name as service, pm03.description from pm03 inner join areas on areas.id = pm03.area inner join sectors on sectors.id = pm03.sector inner join components on components.id = pm03.component inner join equipments on equipments.id = pm03.equipment inner join services on services.id = pm03.service inner join users on users.id = pm03.create_by_id where $1 = any(assigned_id) and ot_status is null", [id])).rows;

            const complete = await (await pool.query("select pm03.id, to_char(pm03.notice_date, 'DD-MM-YYYY') as notice_date, users.name as created_by, pm03.assigned_id, pm03.ot, areas.name as area, areas.color, sectors.name as sector, components.name as component, equipments.name as equipment, services.name as service, pm03.description from pm03 inner join areas on areas.id = pm03.area inner join sectors on sectors.id = pm03.sector inner join components on components.id = pm03.component inner join equipments on equipments.id = pm03.equipment inner join services on services.id = pm03.service inner join users on users.id = pm03.create_by_id where $1 = any(assigned_id) and ot_status is not null", [id])).rows;


            res.status(200).json({ incomplete, complete });

        } catch (error) {
            res.status(500).json({
                message: 'An error has ocurred',
                error
            })
            console.log(error)
        }

    },

    pm03.readPm03 = async (req, res) => {
        const id = req.params.id
        console.log(id)
        try {
            const pm03 = await (await pool.query("SELECT pm03.id, to_char(pm03.notice_date,'DD-MM-YYYY') as notice_date, users.name as created_by, pm03.assigned_id, pm03.ot, areas.name as area, areas.color, sectors.name as sector, components.name as component, equipments.name as equipment, services.name as service, pm03.description FROM pm03 INNER JOIN areas on areas.id = pm03.area inner join sectors on sectors.id = pm03.sector inner join components on components.id = pm03.component inner join equipments on equipments.id = pm03.equipment inner join services on services.id = pm03.service inner join users on users.id = pm03.create_by_id WHERE pm03.id=$1", [id])).rows[0];
            res.status(200).json({ message: "PM03 leida correctamente", pm03 })
        } catch (error) {
            res.status(500).json({ message: 'ocurrió un error' })
            console.log(error)
        }
    }


pm03.addDelivery = async (req, res) => {
    const { pm03_id, close_by, start_date, end_date, start_time, end_time, workers, ot_status, failure, ot } = req.body;
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
            /*  "INSERT INTO pm03delivery (pm03_id, close_by, start_date, end_date, start_time, end_time, duration, workers, hh, ot_status, failure) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)", [pm03_id, close_by, start_date, end_date, start_time, end_time, duration, workers, hh, ot_status, failure]
         ); */
            "UPDATE pm03 set close_by = $1, start_date =$2, end_date=$3, start_time=$4, end_time=$5, duration=$6, workers=$7, hh=$8, ot_status=$9, failure=$10 WHERE id = $11", [close_by, start_date, end_date, start_time, end_time, duration, workers, hh, ot_status, failure, pm03_id]
        );
        res.status(200).json({
            message: `PM03 ${ot} cerrada correctamente`,
        });
    } catch (error) {
        res.status(500).json({
            message: "An error has ocurred",
            error,
        });
        console.log(error)
    }
};






module.exports = pm03;