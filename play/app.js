import {VERSION,almatyDay,validDay,roundsFor,restore,scoreFor} from './core.js';
const $=id=>document.getElementById(id);
const q=new URLSearchParams(location.search), today=almatyDay();
const day=validDay(q.get('day'))?q.get('day'):today;
let lang=['en','ru'].includes(q.get('lang'))?q.get('lang'):(location.hostname.endsWith('.kz')?'ru':'en');
const words={
  en:{eyebrow:'THE DAILY DETOUR · 01',title:'KAZAKHSTAN',orNot:'OR NOT?',intro:'Some places look a world away. Others are closer than you think.',rules:'Five real photos. Trust your eyes. About a minute, no signup, no timer.',start:'Take the challenge ↗',resume:'Continue the challenge ↗',view:'See your result ↗',five:'05 PHOTOS',signup:'ZERO SIGNUPS',photoTag:'REAL PLACES. UNEXPECTED ANSWERS.',look:'LOOK CLOSER',question:'Is this Kazakhstan?',hint:'Mountains, lakes, a little misdirection. Go with your instinct.',yes:'Yes, Kazakhstan',no:'Somewhere else',next:'Next photo →',finish:'See my result →',visit:'I want to go here ↗',changes:'Resized / cropped for display. No AI-generated scenery.',passport:'YOUR EXPLORER CARD',turn:"YOUR FRIEND’S TURN",challenge:'Think they can beat you?',same:'Send the same five photos. No answers in the link.',share:'Challenge a friend ↗',copy:'Copy result & link',download:'Save image ↓',travel:"Liked the Kazakhstan landscapes? Let’s turn a photo into a real trip.",trip:'Explore private trips ↗',confirm:'Route, price and availability confirmed in chat.',again:'Review these photos',today:"Today’s challenge",daily:'A new combination every day · Almaty time · A small, growing photo collection.',credits:'Photo credits & privacy',privacy:'Your progress stays in this browser. No account, tracking cookies or leaderboard. Sharing opens only when you choose it. Scores are for fun, not a competition with prizes.',licenses:'Photographs are from Wikimedia Commons. Authors, originals and licenses are listed below. Resized and cropped only; image licenses remain unchanged. Sharing cards contain our graphics, not these photographs.',back:'Explore trips ↗',loading:'Loading photograph…',retry:'Retry photo',error:'This photo did not load. Retry to continue — no point lost.',correct:'You spotted it.',wrong:'A beautiful surprise.',inKz:'Kazakhstan',notKz:'Not Kazakhstan',round:'Photo',of:'of',date:'DAILY CHALLENGE',invited:'You opened a shared challenge for',unsupported:'This link uses an unknown game version. Opening the current version.',resultTitles:['The journey starts here','Curiosity looks good on you','An eye for adventure','A natural explorer','Almost a local','You know the way'],copied:'Result and challenge link copied.',copyFail:'Copy this link manually:',saved:'Your image is ready to save.',downloadFail:'Image export unavailable. Use Copy result & link instead.',fatal:'The game could not load. Please reload the page or explore our trips.',shareText:(s)=>`Kazakhstan or not? I got ${s}/5. Can you beat me?`,photoAlt:'Landscape for the geography challenge',record:'Saved progress restored.'},
  ru:{eyebrow:'МАЛЕНЬКОЕ ПРИКЛЮЧЕНИЕ · 01',title:'КАЗАХСТАН',orNot:'ИЛИ НЕТ?',intro:'Кажется, это другой конец света. А вдруг гораздо ближе?',rules:'Пять настоящих фото. Доверься глазам. Около минуты, без регистрации и таймера.',start:'Принять вызов ↗',resume:'Продолжить игру ↗',view:'Посмотреть результат ↗',five:'05 ФОТОГРАФИЙ',signup:'БЕЗ РЕГИСТРАЦИИ',photoTag:'РЕАЛЬНЫЕ МЕСТА. НЕОЖИДАННЫЕ ОТВЕТЫ.',look:'ПРИСМОТРИСЬ',question:'Это Казахстан?',hint:'Горы, озёра и немного сомнений. Доверься первому впечатлению.',yes:'Да, Казахстан',no:'Другая страна',next:'Следующее фото →',finish:'Мой результат →',visit:'Хочу сюда поехать ↗',changes:'Уменьшено / кадрировано для экрана. Без AI-пейзажей.',passport:'ТВОЯ КАРТОЧКА ПУТЕШЕСТВЕННИКА',turn:'ТЕПЕРЬ ОЧЕРЕДЬ ДРУГА',challenge:'А друзья угадают больше?',same:'Отправь те же пять фотографий. Ответов в ссылке нет.',share:'Бросить вызов другу ↗',copy:'Скопировать результат',download:'Скачать картинку ↓',travel:'Понравились пейзажи Казахстана? Давай превратим фотографию в настоящую поездку.',trip:'Посмотреть поездки ↗',confirm:'Маршрут, цену и доступность подтвердим в чате.',again:'Посмотреть фото ещё раз',today:'Сегодняшняя игра',daily:'Новая комбинация каждый день · Время Алматы · Небольшая коллекция, которую будем пополнять.',credits:'Авторы фото и конфиденциальность',privacy:'Прогресс хранится только в этом браузере. Без аккаунта, рекламных cookies и рейтинга. Отправка друзьям — только по твоему нажатию. Баллы для удовольствия, не конкурс с призами.',licenses:'Фотографии взяты с Wikimedia Commons. Ниже — авторы, оригиналы и лицензии. Только уменьшение и кадрирование; лицензии изображений сохраняются. На карточках для друзей — наша графика, не эти фотографии.',back:'К поездкам ↗',loading:'Загружаю фотографию…',retry:'Загрузить ещё раз',error:'Фото не загрузилось. Попробуй ещё раз — балл не потеряется.',correct:'Угадал!',wrong:'А вот и сюрприз.',inKz:'Казахстан',notKz:'Не Казахстан',round:'Фото',of:'из',date:'ВЫЗОВ ДНЯ',invited:'Это игра по ссылке друга за',unsupported:'Версия игры в ссылке неизвестна. Открыта текущая версия.',resultTitles:['Приключения начинаются','Любопытство тебе идёт','Есть глаз на красоту','Прирождённый исследователь','Почти местный','Ты знаешь дорогу'],copied:'Результат и ссылка скопированы.',copyFail:'Скопируй ссылку вручную:',saved:'Картинка готова к сохранению.',downloadFail:'Не удалось создать картинку. Скопируй результат и ссылку.',fatal:'Игра не загрузилась. Обнови страницу или переходи к поездкам.',shareText:(s)=>`Казахстан или нет? Я угадал ${s}/5. Сможешь больше?`,photoAlt:'Пейзаж для географической игры',record:'Сохранённый прогресс восстановлен.'}
};
const bank=[
  {id:'p01',kz:true,name:['Charyn Canyon, Kazakhstan','Чарынский каньон, Казахстан'],fact:['These red rock formations are in Charyn Canyon. You can explore this landscape on a trip from Almaty.','Эти красные скалы — Чарынский каньон. Сюда можно отправиться в поездку из Алматы.']},
  {id:'p02',kz:true,name:['Lake Kaindy, Kazakhstan','Озеро Каинды, Казахстан'],fact:['The tree trunks rising from the water belong to the sunken forest of Lake Kaindy.','Стволы, поднимающиеся из воды, — затопленный лес озера Каинды.']},
  {id:'p03',kz:true,name:['Big Almaty Lake, Kazakhstan','Большое Алматинское озеро, Казахстан'],fact:['A mountain lake south of Almaty. Access and route options must be checked before a trip.','Горное озеро к югу от Алматы. Доступ и варианты маршрута нужно уточнить перед поездкой.']},
  {id:'p04',kz:true,name:['Singing Dune, Kazakhstan','Поющий бархан, Казахстан'],fact:['Not the Sahara: this is the Singing Dune in Altyn-Emel National Park.','Не Сахара: это Поющий бархан в национальном парке Алтын-Эмель.']},
  {id:'p05',kz:false,name:['Lake Bled, Slovenia','Озеро Блед, Словения'],fact:['The island and its church are on Lake Bled in Slovenia. This one is outside our Kazakhstan routes.','Остров с церковью находится на озере Блед в Словении. Это место не входит в наши маршруты по Казахстану.']},
  {id:'p06',kz:false,name:['Moraine Lake, Canada','Озеро Морейн, Канада'],fact:['This is Moraine Lake in Banff National Park, Canada — not the mountains near Almaty.','Это озеро Морейн в национальном парке Банф, Канада, а не горы рядом с Алматы.']},
  {id:'p07',kz:false,name:['Horseshoe Bend, USA','Хорсшу-Бенд, США'],fact:['The Colorado River makes this famous bend near Page, Arizona. A canyon, but not Charyn.','Знаменитый изгиб реки Колорадо рядом с городом Пейдж в Аризоне. Каньон — но не Чарын.']}
];
const rounds=roundsFor(day,bank), key=`kbc-play-v${VERSION}-${day}`;
let answers=[], index=0, imageReady=false, review=false, active='intro', credits=[];
try{answers=restore(localStorage.getItem(key),rounds);}catch{}
const t=k=>words[lang][k], localized=a=>a[lang==='ru'?1:0];
function home(){return lang==='ru'?(location.hostname.endsWith('.kz')?'/':'https://kazakhstanbycar.kz/'):(location.hostname.endsWith('.kz')?'https://kazakhstanbycar.com/':'/');}
function tripUrl(){return home()+'?utm_source=game&utm_medium=interactive&utm_campaign=kazakhstan_or_not#tours';}
function challengeUrl(){const u=new URL('https://kazakhstanbycar.com/play/');u.search=new URLSearchParams({v:VERSION,day,lang,utm_source:'friend',utm_medium:'challenge',utm_campaign:'kazakhstan_or_not'});return u.href;}
function shareText(){return `${t('shareText')(scoreFor(answers,rounds))}\n${day}\n${challengeUrl()}`;}
function save(){try{localStorage.setItem(key,JSON.stringify({version:VERSION,answers}));}catch{}}
function show(section){active=section;['intro','game','result'].forEach(id=>$(id).hidden=id!==section);$('imageOutput').hidden=true;}
function dots(id, current){$(id).replaceChildren(...rounds.map((p,i)=>{const el=document.createElement('span');el.className='dot '+(answers[i]?(answers[i].guess===p.kz?'right':'wrong'):(i===current?'current':''));el.setAttribute('aria-label',`${i+1}: ${answers[i]?(answers[i].guess===p.kz?'✓':'×'):'—'}`);return el;}));}
function updateCopy(){
  document.documentElement.lang=lang; document.title=lang==='ru'?'Казахстан или нет? — Kazakhstan by Car':'Kazakhstan or not? — Kazakhstan by Car';
  document.querySelectorAll('[data-i]').forEach(el=>{el.textContent=t(el.dataset.i);});
  $('language').value=lang; $('back').textContent=t('back');$('back').href=home();
  $('trip').href=tripUrl();$('visit').href=tripUrl();$('today').href='./?lang='+lang;
  $('start').textContent=answers.length===5?t('view'):answers.length?t('resume'):t('start');
  $('invite').hidden=!q.has('day')&&!q.has('v');
  $('invite').textContent=q.has('v')&&q.get('v')!==VERSION?t('unsupported'):`${t('invited')} ${day}.`;
  renderCredits();
  if(active==='game') renderRound(false);
  if(active==='result') renderResult(false);
}
function renderCredits(){
  $('credits').replaceChildren(...credits.map(c=>{const li=document.createElement('li'),a=document.createElement('a'),l=document.createElement('a');a.href=c.source;a.textContent=c.title+' — '+c.author;a.target='_blank';a.rel='noopener';l.href=c.licenseUrl;l.textContent=c.license;l.target='_blank';l.rel='noopener';li.append(a,' · ',l);return li;}));
}
function updateImageState(){
  imageReady=$('photo').complete&&$('photo').naturalWidth>0;
  $('yes').disabled=$('no').disabled=!imageReady||!!answers[index];
  $('imageLoading').hidden=imageReady;
  $('retry').hidden=imageReady;
  $('imageLoading').textContent=t('error');
}
function renderRound(load=true){
  show('game'); const item=rounds[index], a=answers[index], credit=credits.find(c=>c.id===item.id);
  $('dayLabel').textContent=t('date')+' / '+day; $('counter').textContent=`${t('round')} ${index+1} ${t('of')} 5`;dots('progress',index);
  $('reveal').hidden=!a;$('answerHint').hidden=!!a;$('yes').hidden=$('no').hidden=!!a;
  $('photo').alt=a?localized(item.name):t('photoAlt')+' '+(index+1);
  if(load){imageReady=false;$('imageLoading').hidden=false;$('imageLoading').textContent=t('loading');$('retry').hidden=true;$('yes').disabled=$('no').disabled=true;$('photo').src=`assets/${item.id}.jpg`;}
  else if(imageReady){$('yes').disabled=$('no').disabled=!!a;}
  if(a){
    const right=a.guess===item.kz;
    $('verdict').textContent=(right?t('correct'):t('wrong'))+' · '+(item.kz?t('inKz'):t('notKz'));
    $('verdict').className='verdict '+(right?'correct':'incorrect');$('place').textContent=localized(item.name);$('fact').textContent=localized(item.fact);
    $('source').textContent=credit.author;$('source').href=credit.source;$('license').textContent=credit.license;$('license').href=credit.licenseUrl;
    $('visit').hidden=!item.kz;$('visit').href=tripUrl();$('next').textContent=index===4?t('finish'):t('next');
  }
  if(load){$('question').focus({preventScroll:true});if($('photo').complete)updateImageState();}
}
function answer(guess){
  if(!imageReady||answers[index]||review)return;
  answers.push({id:rounds[index].id,guess});save();renderRound(false);$('next').focus({preventScroll:true});
}
function renderResult(focus=true){
  show('result');const score=scoreFor(answers,rounds);$('resultTitle').textContent=t('resultTitles')[score];$('score').textContent=`${score}/5`;dots('resultDots',-1);$('resultDay').textContent=day;
  $('shareWa').href='https://wa.me/?text='+encodeURIComponent(shareText());$('trip').href=tripUrl();$('shareStatus').textContent='';if(focus)$('resultTitle').focus({preventScroll:true});
}
async function copy(){try{await navigator.clipboard.writeText(shareText());$('shareStatus').textContent=t('copied');}catch{$('shareStatus').textContent=t('copyFail')+' '+challengeUrl();}}
function resultCanvas(){
  const c=document.createElement('canvas');c.width=1080;c.height=1350;const ctx=c.getContext('2d');
  ctx.fillStyle='#122e29';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#ecaa78';ctx.font='bold 26px Arial';ctx.fillText('KAZAKHSTAN BY CAR',80,100);
  ctx.fillStyle='#f5f2e9';ctx.font='bold 90px Arial';ctx.fillText(lang==='ru'?'КАЗАХСТАН':'KAZAKHSTAN',80,265);ctx.fillStyle='#ecaa78';ctx.fillText(lang==='ru'?'ИЛИ НЕТ?':'OR NOT?',80,375);
  ctx.font='bold 230px Arial';ctx.fillStyle='#f5f2e9';ctx.fillText(`${scoreFor(answers,rounds)}/5`,75,670);
  rounds.forEach((p,i)=>{ctx.fillStyle=answers[i].guess===p.kz?'#a4d5ad':'#ecaa78';ctx.beginPath();ctx.arc(105+i*70,750,18,0,Math.PI*2);ctx.fill();});
  ctx.font='30px Arial';ctx.fillStyle='#f5f2e9';ctx.fillText(lang==='ru'?'Сможешь угадать больше?':'Can you beat my score?',80,850);ctx.font='24px Arial';ctx.fillText(day+' · DAILY CHALLENGE',80,910);
  ctx.fillStyle='#35584c';ctx.beginPath();ctx.moveTo(0,1175);ctx.lineTo(230,990);ctx.lineTo(400,1140);ctx.lineTo(620,940);ctx.lineTo(1080,1200);ctx.closePath();ctx.fill();
  ctx.fillStyle='#f5f2e9';ctx.font='bold 34px Arial';ctx.fillText('kazakhstanbycar.com/play/',80,1250);return c;
}
$('photo').addEventListener('load',updateImageState);$('photo').addEventListener('error',updateImageState);
$('retry').onclick=()=>{const img=$('photo');$('imageLoading').textContent=t('loading');$('retry').hidden=true;img.src=`assets/${rounds[index].id}.jpg?retry=${Date.now()}`;};
$('yes').onclick=()=>answer(true);$('no').onclick=()=>answer(false);
$('next').onclick=()=>{if(!answers[index])return;if(index===4)renderResult();else{index++;renderRound();}};
$('start').onclick=()=>{if(answers.length===5)renderResult();else{index=answers.length;renderRound();}};
$('again').onclick=()=>{review=true;index=0;renderRound();};
$('copy').onclick=copy;
$('share').onclick=async()=>{if(navigator.share){try{await navigator.share({title:'Kazakhstan or not?',text:t('shareText')(scoreFor(answers,rounds)),url:challengeUrl()});return;}catch(e){if(e.name==='AbortError')return;}}await copy();};
$('download').onclick=()=>{try{const url=resultCanvas().toDataURL('image/png');$('resultImage').src=url;$('resultImage').alt=t('shareText')(scoreFor(answers,rounds));$('saveImage').href=url;$('saveImage').download=`kazakhstan-challenge-${day}.png`;$('saveImage').textContent=lang==='ru'?'Скачать PNG ↓':'Download PNG ↓';$('imageOutput').hidden=false;$('shareStatus').textContent=t('saved');$('saveImage').focus();}catch{$('shareStatus').textContent=t('downloadFail');}};
$('language').onchange=()=>{lang=$('language').value;const url=new URL(location.href);url.searchParams.set('lang',lang);history.replaceState(null,'',url);updateCopy();};
updateCopy();$('start').disabled=true;
try{const res=await fetch('assets/credits.json');if(!res.ok)throw Error('credits');credits=await res.json();if(!bank.every(p=>credits.some(c=>c.id===p.id)))throw Error('incomplete credits');renderCredits();$('start').disabled=false;}catch{$('fatal').hidden=false;$('fatal').textContent=t('fatal');}
