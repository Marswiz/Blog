function getScrewLength(screwDiameter = 6, innerLength = 10, ifHasPlate = true) {
    getScrewLength
    // screwDiameter: 螺纹直径，默认M6；
    // innerLength: 被连接物厚度 mm；
    // ifHasPlate： 是否有平垫，默认为True；
    let paraTable = { // 螺纹直径对应的： [平垫厚度， 螺母厚度]
        2: [0.35, 1.6],
        3: [0.55, 2.4],
        4: [0.9, 3.2],
        5: [1.1, 4.7],
        6: [1.8, 5.2],
        8: [1.8, 6.8],
        10: [2.2, 8.4],
        12: [2.7, 10.8],
        16: [3.3, 14.8],
        20: [3.3, 18],
        24: [4.3, 21.5],
        30: [4.3, 25.6]
    };

    if (ifHasPlate && !paraTable.hasOwnProperty(screwDiameter)) {
        document.querySelector('#resultValue').innerText = '【不存在的螺纹直径。】';
        return;
    }
    let res = ifHasPlate ? innerLength + 0.3 * screwDiameter + paraTable[screwDiameter].reduce((a, b) => a + b) : innerLength + 0.3 * screwDiameter + paraTable[screwDiameter][1];
    document.querySelector('#resultValue').innerText = Math.ceil(res);
}

// test
let inputs = document.querySelectorAll('input');

function refresh() {
    getScrewLength(+inputs[0].value, +inputs[1].value, inputs[2].checked);
}
refresh();
for (let i of inputs) {
    i.addEventListener('input', refresh);
}