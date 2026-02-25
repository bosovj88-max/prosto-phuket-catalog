// ====== 1) НАСТРОЙКИ КАТЕГОРИЙ ======
const CATEGORIES = [
  { id: "auto",  emoji:"🚗", label: {ru:"Авто", en:"Auto", uk:"Авто"} },
  { id: "bikes", emoji:"🏍", label: {ru:"Байки", en:"Bikes", uk:"Байки"} },
  { id: "exc",   emoji:"🏝", label: {ru:"Экскурсии", en:"Excursions", uk:"Екскурсії"} },
  { id: "yacht", emoji:"🛥", label: {ru:"Яхты / катера", en:"Yachts / Boats", uk:"Яхти / катери"} },
  { id: "villas",emoji:"🏡", label: {ru:"Виллы", en:"Villas", uk:"Вілли"} },
];

// ====== 2) ДАННЫЕ КАТАЛОГА ======
// ⚠️ Вставь прямые ссылки на картинки (см. блок "Как получить прямую ссылку из Dropbox")
const ITEMS = [
  // -------- AUTO: MG5 (1 обложка + 3 внутри) --------
  {
    id: "mg5-2024",
    category: "auto",
    cover: "https://img.pcauto.com/model/images/modelPic/my/2024/08/712/440909732_1724393151285.jpg",
    gallery: [
      "https://img.pcauto.com/model/images/modelPic/my/2024/08/712/440909732_1724393151285.jpg",
      "https://img.pcauto.com/model/images/modelPic/my/2024/08/712/440909732_1724393151285.jpg",
      "https://img.pcauto.com/model/images/modelPic/my/2024/08/712/440909732_1724393151285.jpg",
      "https://img.pcauto.com/model/images/modelPic/my/2024/08/712/440909732_1724393151285.jpg",
    ],
    meta: { ru:"Sedan • 2024", en:"Sedan • 2024", uk:"Sedan • 2024" },
    title: { ru:"MG5 / 2024", en:"MG5 / 2024", uk:"MG5 / 2024" },
    text: {
      ru:"Комфортный современный седан для города и поездок по острову.",
      en:"A modern and comfortable sedan for city driving and island trips.",
      uk:"Сучасний комфортний седан для поїздок островом."
    },
    specs: {
      ru:[
        "Коробка передач: AT",
        "Количество мест: 5",
        "Apple CarPlay",
        "Камера 360°",
        "Круиз-контроль",
        "Bluetooth",
        "Салон кожвинил",
      ],
      en:[
        "Transmission: Automatic",
        "Seats: 5",
        "Apple CarPlay",
        "360° camera",
        "Cruise control",
        "Bluetooth",
        "Leather-style interior",
      ],
      uk:[
        "Коробка передач: автомат",
        "Кількість місць: 5",
        "Apple CarPlay",
        "Камера 360°",
        "Круїз-контроль",
        "Bluetooth",
        "Салон (шкірозамінник)",
      ]
    },
    note: { ru:"Цены и контакты в каталоге не публикуются.", en:"No prices or contacts in this catalog.", uk:"Ціни та контакти в каталозі не публікуються." }
  },

  // -------- BIKES (1 обложка + 1 внутри) --------
  bikeItem("scoopy-110", "Scoopy", 110),
  bikeItem("click-160",  "Click", 160),
  bikeItem("adv-160",    "ADV", 160),
  bikeItem("forza-350",  "Forza", 350, "Maxi Scooter"),
  bikeItem("tmax-560",   "T-Max", 560, "Big Scooter"),
  bikeItem("xadv-750",   "X-ADV", 750, "Adventure Scooter"),
  bikeItem("forza-750",  "Forza", 750, "Premium Scooter"),
];

// helper to generate bikes quickly
function bikeItem(id, name, cc, subType){
  const type = subType || "Scooter";
  return {
    id,
    category:"bikes",
    cover:"PASTE_IMAGE_URL_HERE",
    gallery:[
      "PASTE_IMAGE_URL_HERE",
      "PASTE_IMAGE_URL_HERE",
    ],
    meta:{ ru:`${cc} cc • ${type}`, en:`${cc} cc • ${type}`, uk:`${cc} cc • ${type}` },
    title:{ ru:`${name} ${cc}cc`, en:`${name} ${cc}cc`, uk:`${name} ${cc}cc` },
    text:{
      ru:"Надежный и удобный байк для передвижения по острову.",
      en:"A reliable and comfortable bike for getting around the island.",
      uk:"Надійний та зручний байк для пересування островом."
    },
    specs:{
      ru:["Коробка передач: автомат","Мест: 2","ABS","Багажник под сиденьем","USB","Держатель для телефона"],
      en:["Transmission: Automatic","Seats: 2","ABS","Under-seat storage","USB","Phone holder"],
      uk:["Коробка передач: автомат","Місць: 2","ABS","Багажник під сидінням","USB","Тримач для телефону"],
    },
    note:{ ru:"Цены и контакты в каталоге не публикуются.", en:"No prices or contacts in this catalog.", uk:"Ціни та контакти в каталозі не публікуються." }
  }
}

// ====== 3) ЛОГИКА ОТРИСОВКИ ======
let state = { lang:"ru", cat:"auto", selected:null };

const tabsEl = document.getElementById("tabs");
const listEl = document.getElementById("listView");
const detailEl = document.getElementById("detailView");
const backBtn = document.getElementById("backBtn");

const mainImg = document.getElementById("mainImg");
const thumbsEl = document.getElementById("thumbs");
const dTitle = document.getElementById("dTitle");


const dMeta  = document.getElementById("dMeta");
const dText  = document.getElementById("dText");
const dSpecs = document.getElementById("dSpecs");
const dNote  = document.getElementById("dNote");

renderTabs();
renderList();
wireLang();

backBtn.addEventListener("click", () => {
  state.selected = null;
  detailEl.classList.add("is-hidden");
  listEl.classList.remove("is-hidden");
  window.scrollTo({top:0, behavior:"instant"});
});

function wireLang(){
  document.querySelectorAll(".lang .chip").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      document.querySelectorAll(".lang .chip").forEach(b=>b.classList.remove("is-active"));
      btn.classList.add("is-active");
      state.lang = btn.dataset.lang;
      if(state.selected) renderDetail(state.selected);
      else renderList();
      renderTabs(true);
    });
  });
}

function renderTabs(updateOnly=false){
  if(!updateOnly){
    tabsEl.innerHTML = "";
    CATEGORIES.forEach(c=>{
      const b = document.createElement("button");
      b.className = "chip";
      b.dataset.cat = c.id;
      b.addEventListener("click", ()=>{
        state.cat = c.id;
        state.selected = null;
        detailEl.classList.add("is-hidden");
        listEl.classList.remove("is-hidden");
        setActiveTab();
        renderList();
      });
      tabsEl.appendChild(b);
    });
  }
  // update labels + active
  [...tabsEl.querySelectorAll(".chip")].forEach(b=>{
    const cat = CATEGORIES.find(x=>x.id===b.dataset.cat);
    b.textContent = ${cat.emoji} ${cat.label[state.lang]};
  });
  setActiveTab();
}

function setActiveTab(){
  [...tabsEl.querySelectorAll(".chip")].forEach(b=>{
    b.classList.toggle("is-active", b.dataset.cat===state.cat);
  });
}

function renderList(){
  const items = ITEMS.filter(x=>x.category===state.cat);

  // empty states for coming soon categories
  if(items.length===0){
    listEl.innerHTML = `
      <div class="card" style="grid-column:1/-1">
        <div class="card__h">${comingSoonText()}</div>
        <div class="meta">${hintText()}</div>
      </div>`;
    return;
  }

  listEl.innerHTML = "";
  items.forEach(it=>{
    const el = document.createElement("div");
    el.className = "item";
    el.innerHTML = `
      <img class="item__img" src="${it.cover}" alt="">
      <div class="item__body">
        <div class="item__title">${it.title[state.lang]}</div>
        <div class="item__sub">${it.meta[state.lang]}</div>
      </div>`;
    el.addEventListener("click", ()=>{
      state.selected = it.id;
      renderDetail(it.id);
      listEl.classList.add("is-hidden");
      detailEl.classList.remove("is-hidden");
      window.scrollTo({top:0, behavior:"instant"});
    });
    listEl.appendChild(el);
  });
}

function renderDetail(id){
  const it = ITEMS.find(x=>x.id===id);
  if(!it) return;

  dTitle.textContent = it.title[state.lang];
  dMeta.textContent  = it.meta[state.lang];
  dText.textContent  = it.text[state.lang];
  dNote.textContent  = it.note?.[state.lang] || "";

  // specs
  dSpecs.innerHTML = "";
  (it.specs[state.lang] || []).forEach(s=>{
    const li = document.createElement("li");
    li.textContent = s;
    dSpecs.appendChild(li);
  });

  // gallery
  const imgs = (it.gallery && it.gallery.length) ? it.gallery : [it.cover];
  mainImg.src = imgs[0];
  thumbsEl.innerHTML = "";
  imgs.forEach((src, idx)=>{
    const t = document.createElement("img");
    t.className = "thumb";
    t.src = src;
    t.alt = "";
    t.addEventListener("click", ()=> mainImg.src = imgs[idx]);
    thumbsEl.appendChild(t);
  });
}

function comingSoonText(){
  if(state.lang==="ru") return "Раздел наполняется. Скоро добавим контент.";
  if(state.lang==="uk") return "Розділ наповнюється. Скоро додамо контент.";
  return "This section is being updated. Content coming soon.";
}

function hintText(){
  if(state.lang==="ru") return "Добавим фото и описание — и раздел появится в каталоге.";
  if(state.lang==="uk") return "Додамо фото та опис — і розділ з’явиться в каталозі.";
  return "Add photos and descriptions — the section will appear in the catalog.";
}
