const pool = require('../config/db');
const haversine = require('haversine-distance');
const validateInput = require('../utils/validation');

exports.addSchool = (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    const validation = validateInput({ name, address, latitude, longitude });
    if (!validation.valid) {
        return res.status(400).json({ error: validation.message });
    }

    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    const values = [name, address, latitude, longitude];

    pool.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Database error', details: err.message });
        }
        res.status(201).json({ message: 'School added successfully', schoolId: result.insertId });
    });
};

exports.listSchools = (req, res) => {
    const { latitude, longitude } = req.query;
    const userLocation = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };

    if (isNaN(userLocation.latitude) || isNaN(userLocation.longitude)) {
        return res.status(400).json({ error: 'Invalid latitude or longitude' });
    }

    pool.query('SELECT * FROM schools', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error', details: err.message });

        const sortedSchools = results
            .map(school => ({
                ...school,
                distance: haversine(userLocation, { latitude: school.latitude, longitude: school.longitude })
            }))
            .sort((a, b) => a.distance - b.distance);

        res.json(sortedSchools);
    });
};
