const init2d = (width, height) => {
    // Инициализация полотна в 2D

    // Получаем полотно и контекст 2d
    const canvas = document.querySelector("#canvas-2d");
    const ctx = canvas.getContext("2d");

    // Если контекста не существует выходим из функции
    if (!ctx) return;

    // Устанавливаем размеры полотна
    canvas.width = width;
    canvas.height = height;

    return {ctx, width, height};
};

// Отрисовка объекта по его координатам
const draw2d = (data, ctx) => {
    // Очищаем предыдущие элементы отрисовки
    ctx.beginPath();

    // Перемещаем точку по заданным координатам
    ctx.moveTo(data[1].StartX, data[1].StartY);

    // В цикле рисуем линию от предыдущей координаты к текущей
    data.forEach((el, i) => {
        if (i <= 1) return; // кроме первого и второго элемента

        ctx.lineTo(el.StartX, el.StartY);
    });

    // Заливаем текущий рисуемый элемент цветом, указанным в объекте
    ctx.fillStyle = data[0].fill;
    // Устанавливаем цвет обводки цветом из объекта
    ctx.strokeStyle = data[0].fillStroke;
    // и также устанавливаем толщину обводки
    ctx.lineWidth = data[0].lineWidth;
    // Включаем обводку
    ctx.stroke();
    // Заливаем
    ctx.fill();
};

const drawObj = ({ctx, width, height}) => {
    // Получаем объект по заданным координатам
    const shuriken = getObjData(width / 2, height / 2);

    // Отрисовываем каждый элемент в объекте
    for (let key in shuriken.objects) {
        draw2d(shuriken.objects[key], ctx);
    }
};

drawObj(init2d(500, 500));
