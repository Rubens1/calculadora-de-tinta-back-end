const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5500;

app.use(cors()); // Habilita o CORS para todas as rotas
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/calculate', (req, res) => {
    const { walls, doors, windows } = req.body;

    const doorArea = 2.0 * 0.8; // Assumindo portas de 2m x 0.8m
    const windowArea = 1.2 * 1.2; // Assumindo janelas de 1.2m x 1.2m
    const coveragePerLiter = 5; // 1 litro de tinta cobre 5m²

    let totalArea = 0;

    walls.forEach((wall, index) => {
        let wallArea = wall.height * wall.width;
        let doorAreaTotal = doors[index] * doorArea;
        let windowAreaTotal = windows[index] * windowArea;
        totalArea += wallArea - doorAreaTotal - windowAreaTotal;
    });

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

    if (remainingPaint > 0) {
        let smallestCan = canSizes[canSizes.length - 1];
        let count = Math.ceil(remainingPaint / smallestCan);
        cans.push({ size: smallestCan, count });
    }

    res.json({ totalArea, paintNeeded, cans });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
