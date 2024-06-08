const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5500;

app.use(cors());
app.use(bodyParser.json());

app.post('/calculate', (req, res) => {
    const { walls, doors, windows } = req.body;

    const doorArea = 0.8 * 1.9;
    const windowArea = 2.0 * 1.2;
    const coveragePerLiter = 5;

    let totalArea = 0;

    for (let i = 0; i < walls.length; i++) {
        let wallArea = walls[i].height * walls[i].width;
        
        // Validate wall area
        if (wallArea < 1 || wallArea > 50) {
            return res.status(400).json({ error: `Parede ${i + 1} A superfície deve estar compreendida entre 1 e 50 metros quadrados.` });
        }

        let doorAreaTotal = doors[i] * doorArea;
        let windowAreaTotal = windows[i] * windowArea;

        // Validate total area of doors and windows
        if (doorAreaTotal + windowAreaTotal > wallArea / 2) {
            return res.status(400).json({ error: `Área total das portas e janelas da parede ${i + 1} deve ser, no máximo, 50% do wall area.` });
        }

        // Validate wall height if there is a door
        if (doors[i] > 0 && walls[i].height < 1.9 + 0.3) {
            return res.status(400).json({ error: `Parede ${i + 1} deve ser pelo menos 30 cm mais alto do que a altura da porta.` });
        }

        totalArea += wallArea - doorAreaTotal - windowAreaTotal;
    }

    const paintNeeded = totalArea / coveragePerLiter;
    const canSizes = [18, 3.6, 2.5, 0.5];
    let cans = [];
    let remainingPaint = paintNeeded;

    for (let size of canSizes) {
        let count = Math.floor(remainingPaint / size);
        if (count > 0) {
            cans.push({ size, count });
            remainingPaint -= count * size;
        }
    }

    res.json({ totalArea, paintNeeded, cans });
});

app.listen(PORT, () => {
    console.log(`O servidor está a funcionar na porta ${PORT}`);
});
