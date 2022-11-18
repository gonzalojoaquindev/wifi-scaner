import { Pool } from 'pg';

const pool = new Pool({
    host: 'ec2-54-159-22-90.compute-1.amazonaws.com',
    port: '5432',
    user: 'hudiymjhvbnhkb',
    password: '53ac32a431a77722f81a26921e6f6ae00ac81b63881a3154350716890436d859',
    database: 'd3fpgekbe5es29'
});

module.exports = pool;