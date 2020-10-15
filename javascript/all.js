//*************************取資料*************************//
const xhr = new XMLHttpRequest();
xhr.open('get', 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json', true);
xhr.send(null);


//*************************指向目標*************************//
const selectArea = document.querySelector('.selectArea');//指向上方選擇地區欄位
const attractionsList = document.querySelector('.attractions-list');//指向下方輸入欄位
const areaName = document.querySelector('.areaName');//指向中間的區域名
const hotZoneContent = document.querySelector('.hotZone-content');//指向熱門地區的區塊
const selectPage = document.querySelector('.pageSwitch'); //下方切換頁面欄位



//*************************監聽對象*************************//
selectArea.addEventListener('change', function () { //監聽地區選項是否被改變
  if (selectArea.value === ""){
    areaName.textContent = "";
    selectPage.innerHTML = "";
    attractionsList.innerHTML = "";
    return nowPage = 1; //將nowPage重製為1
  }else{
    areaData = getAreaData(); //得出本次的areaData
    countPageInner(areaData); //算出頁數並填入下方區域
    let nowData = choiceNowData(areaData,1); //此處用1去代替nowPage，因為永遠從第一頁開始
    dataInner(nowData); //組成字串並填入
    return nowPage = 1; //將nowPage重製為1
  }
}, false); //
hotZoneContent.addEventListener('click', hotZoneBtnChange, false); //熱門地區區塊是否被點擊，fuction中已包含取資料排字串及填入
selectPage.addEventListener('click', changePage, false); //監聽下方的切換頁面欄位，fuction中已包含取資料排字串及填入



//*************************定義內容*************************//
let nowPage = 1 || changePage; //現在頁面位置
let areaData = "" || getAreaData; //當前區域的資料，儲存出來方便換頁操作
const prevText = '<li class="pagePrev">< prev</li>'; //定義往前按鈕的字串
const nextText = '<li class="pageNext">next ></li>'; //定義往後按鈕的字串
const noData = "";



//*************************各種行為*************************//
////*****取得資料後的的行為////
xhr.onload = function returnOption() {//傳回資料後優先將所有行政區填入banner中的選擇框內
  let data = getDataCorrect(); //取得xhr中的所需資料
  let len = data.length;
  let area = [];
  for (var i = 0; len > i; i++) {
    area.push(data[i].Zone);//將area變成所有項目所在區域的陣列
  }
  area = area.filter(function (element, index, self) {
    return self.indexOf(element) === index;
  });//去掉area中的重複項
  let str = "";
  let areaLen = area.length;
  for (var i = 0; areaLen > i; i++) {
    str += `<option value="${area[i]}">${area[i]}</option>`;
  }
  selectArea.innerHTML = `<option value="">--請選擇行政區--</option><option value="全部景點">全部景點</option>${str}`//將所有行政區填入banner中的選擇框內
  return nowPage = 1;
}
///////////////////////////////////////////


////*****從xhr中取得陣列資料，進行排錯並將ticketinfo進行判斷調整////
function getDataCorrect() {
  let data = JSON.parse(xhr.responseText).result.records;
  data[59].Zone = "岡山區";//調整錯誤資料
  data[59].Add = "高雄市岡山區本工一路25號";//調整錯誤資料
  let len = data.length;
  for (let i = 0; len > i; i++) {//檢查ticketInfo的部份，讓該項為空值的景點不會傳回空蕩的圖標
    if (data[i].Ticketinfo != "") {
      data[i].Ticketinfo = `<div class="attractions-ticket col-6 text-center"><img class="attractions-icon" src="images/icons_tag.png" alt=""><span>${data[i].Ticketinfo}</span></div>`
    }
  }
  return data;
}
///////////////////////////////////////////


////*****通過改變選擇框內的選項去改變撈取的資料////
function getAreaData() {
  areaName.textContent = selectArea.value;//修改上方區域名
  let data = getDataCorrect(); //把全部資料放進data作陣列
  let len = data.length;
  let areaData = [];
  //選出符合條件的資料放入areaData
  if (selectArea.value === "全部景點") {
    for (let i = 0; len > i; i++) {
      areaData.push(data[i]);
    }
  } else {
    for (let i = 0; len > i; i++) {
      if (data[i].Zone === selectArea.value) {
        areaData.push(data[i]);
      }
    }
  }//這個時候的areaData就是這次我們要取出的資料了
  console.log(areaData);
  return areaData;
}
///////////////////////////////////////////


////*****通過改變選擇框內的選項去改變撈取的資料////
function dataInner(items) {
  let str = getInnerData(items);
  attractionsList.innerHTML = str;
}
///////////////////////////////////////////


////*****算好頁數、製作相應字串並填入下方的字串////
function countPageInner(items) {
  let len = items.length;
  let pageBar = ""; //要傳入下方的字串
  let allPage = Math.ceil(len / 10); //計算頁數
  if (Math.ceil(len / 10) == 1) {
    pageBar = `<li class="pageNumber active">1</li>`
  } else {
    let str = ""
    for (let i = 2; i <= allPage; i++) {
      str += `<li class="pageNumber">${i}`
    }
    pageBar = `${prevText}<li class="pageNumber active">1</li>${str}${nextText}`
  }
  selectPage.innerHTML = pageBar;
  return allPage
}
///////////////////////////////////////////


////*****依據算好的頁數，重新修正areaData的內容////
function choiceNowData(items,page) {
  let allPage = Math.ceil(items.length / 10); //計算頁數; //本次資料總頁數
  let len = items.length;
  let nowData = [];
  if (allPage == 1) {
    let nowData = items;
    return nowData;
  } else {
    if(page == 1){
      for(let i = 0 ;i<10;i++){
        nowData.push(items[i]); 
      }
      return nowData;
    }else{
      for(let i = (page-1)*10;i<(page*10)&&i<len;i++){
        nowData.push(items[i]); 
      }
      return nowData;
    }
  }
}
///////////////////////////////////////////


////*****將areaData資料進行排列組合，取得要填進attractions-list的字串////
function getInnerData(items) {
  let str = "";
  let len = items.length;
  for (let i = 0; len > i; i++) {    //下方為要插入attractions-list的資料
    str += `<div class="attractions row">         
    <div class="attractions-img bg-cover col-12" style="background-image: url(${items[i].Picture1});">
      <div class="d-flex h-100 justify-content-between align-items-end attractions-name-area">
          <span class="attractions-name">${items[i].Name}</span>
          <span class="attractions-area">${items[i].Zone}</span>
      </div>
    </div>
    <div class="attractions-time col-12 d-flex align-items-center">
      <img class="attractions-icon" src="images/icons_clock.png" alt=""><span>${items[i].Opentime}</span>
    </div>
    <div class="attractions-address col-12">
      <img class="attractions-icon" src="images/icons_pin.png" alt=""><span>${items[i].Add}</span>
    </div>
    <div class="attractions-tel col-5 d-inline-block">
      <img class="attractions-icon" src="images/icons_phone.png" alt=""><span class="mr-auto">${items[i].Tel}</span>
    </div>
    ${items[i].Ticketinfo}
  </div>`
  }
  return str;
}
///////////////////////////////////////////


////*****換頁的動作////
function changePage(e) {
  if (e.target.nodeName !== "LI") { return };  //確認指向到數字或前後按鈕
  let len = areaData.length;
  let activePage = document.querySelector('.active'); //指向現在有active標籤li，也就是現在呈現的頁面
  switch (e.target.className) {
    case 'pagePrev':
      if (nowPage == 1) {
        return; //當現在已經是第一頁時無反應
      } else {
        nowPage = nowPage - 1
        activePage.previousSibling.classList.add('active');//在現在頁面的上一頁增加active
        activePage.classList.remove('active');//移除現在頁面的active
      }
      break;
    case 'pageNumber': //此部份因現在頁面含有active，所以不會進入這個case而會歸到default
      nowPage = parseInt(e.target.textContent);
      activePage.classList.remove('active');
      e.target.classList.add('active');
      break;
    case 'pageNext':
      if (Math.ceil(len / 10) == nowPage) {
        return nowPage; //當現在已經是最後一頁時無反應
      } else {
        nowPage = nowPage + 1;
        activePage.nextSibling.classList.add('active');//在現在頁面的下一頁增加active
        activePage.classList.remove('active');//移除現在頁面的active
      }
      break;
    default:
      break;
  }
  console.log(nowPage);
  let nowData = choiceNowData(areaData,nowPage);
  dataInner(nowData); //組成字串並填入
  return nowPage;
}
///////////////////////////////////////////


////*****通過點擊熱區按鈕去上方選擇框內容，再執行getAreaData////
function hotZoneBtnChange(e) {
  if (e.target.nodeName !== "BUTTON") { return };  //確認指向到四個button
  selectArea.value = e.target.textContent; //修改banner中間選擇框的值
  areaData = getAreaData(); //得出本次的areaData
  countPageInner(areaData); //算出頁數並填入下方區域
  let nowData = choiceNowData(areaData,1);
  dataInner(nowData); //組成字串並填入
  return nowPage = 1;
}
///////////////////////////////////////////


//JQ//*****滾動回到首頁最上方////
$('.goTop').click(function (event) {
  $('html,body').animate({
    scrollTop: 0
  }, 1000);
});
///////////////////////////////////////////


//JQ//*****滾動到區域標題欄位////
$('.down-icon').click(function (event) {
  $('html,body').animate({
    scrollTop: $('.areaName').offset().top
  }, 500);
});
///////////////////////////////////////////


//JQ//*****滾動監測backtop按鈕是否出現////
$(window).scroll(function () {
  var scrollPos = $(window).scrollTop();
  var windowHeight = $(window).height();
  if (scrollPos >= (windowHeight * 0.8)) {
    $('.goTop').show();
  } else {
    $('.goTop').hide();
  }
});
///////////////////////////////////////////