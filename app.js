const kitchens = [
 {name:"Кухня «Modern»",area:"Индивидуальный проект",price:"от 189 000 ₽",description:"Современная кухня в тёплых спокойных оттенках.",image:"kitchen-1.png"},
 {name:"Кухня «White Wood»",area:"32 м²",price:"850 000 ₽",description:"Светлая угловая кухня с белыми фасадами и натуральным деревом.",image:"kitchen-2.webp"},
 {name:"Кухня «Graphite»",area:"27 м²",price:"720 000 ₽",description:"Стильная графитовая кухня с белыми верхними фасадами и мраморной панелью.",image:"kitchen-3.jpg"}
];
const list=document.getElementById("kitchen-list");
kitchens.forEach(k=>list.innerHTML+=`<article class="kitchen-card"><img src="${k.image}" alt="${k.name}"><div class="kitchen-info"><h3>${k.name}</h3><div class="area">${k.area}</div><p>${k.description}</p><div class="price">${k.price}</div><a class="button" href="#order">Заказать</a></div></article>`);
