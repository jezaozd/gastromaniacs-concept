const formats={
 mafia:{name:'Гастромафия',image:'blind-tasting.jpg',alt:'Гости дегустируют блюда с закрытыми глазами',description:'Угадываем ингредиенты с закрытыми глазами. Обсуждаем версии, ищем сообщников и доверяем вкусовой интуиции.',url:'mafia',action:'Обсудить Гастромафию'},
 physics:{name:'Гастрофизика',image:'dinner.jpg',alt:'Кулинарная команда готовит блюда с эффектной подачей',description:'Ужин, в котором свет, звук и подача становятся частью знакомства со вкусом. Для тех, кому интересно исследовать свои ощущения.',url:'physics',action:'Обсудить Гастрофизику'},
 quiz:{name:'Гастроквиз',image:'outdoor.jpg',alt:'Стол с деревянными игровыми коробками на событии Гастроманьяков',description:'Объединяемся в команды, открываем гастрономические загадки и ищем ответы вместе. Общий стол становится игровым полем.',url:'game',action:'Обсудить Гастроквиз'},
 custom:{name:'Ваша история',image:'quiz.jpg',alt:'Участники события вместе собирают большой кроссворд',description:'От любимых вкусов именинника до задачи вашего бренда. Придумаем легенду, последовательность блюд и моменты, в которых участвует каждый.',url:'creative',action:'Обсудить нашу историю'}
};
const tabs=[...document.querySelectorAll('[data-format]')];
const panel=document.querySelector('#format-panel');
const photo=document.querySelector('#format-photo');
const selection=document.querySelector('#selected-format');
let request=0;
function chooseFormat(key,focus=false){
 const data=formats[key];if(!data)return;
 const current=++request;
 tabs.forEach(tab=>{const active=tab.dataset.format===key;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;if(active&&focus)tab.focus()});
 panel.setAttribute('aria-labelledby',`tab-${key}`);
 document.querySelector('#format-description').textContent=data.description;
 const action=document.querySelector('#format-choose');action.firstChild.textContent=data.action+' ';
 document.querySelector('#format-source').href='https://gastromaniacs.ru/'+data.url;
 selection.value=key;
 const image=new Image();image.src='assets/'+data.image;
 image.decode().then(()=>{if(current!==request)return;photo.src=image.src;photo.alt=data.alt;panel.classList.remove('is-changing');void panel.offsetWidth;panel.classList.add('is-changing')}).catch(()=>{if(current===request){photo.src=image.src;photo.alt=data.alt}});
}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>chooseFormat(tab.dataset.format));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowDown'||event.key==='ArrowRight')next=(index+1)%tabs.length;if(event.key==='ArrowUp'||event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next!==undefined){event.preventDefault();chooseFormat(tabs[next].dataset.format,true)}})});
document.querySelectorAll('[data-pick]').forEach(link=>link.addEventListener('click',()=>chooseFormat(link.dataset.pick)));
document.querySelector('#event-brief').addEventListener('submit',event=>{
 event.preventDefault();
 const purpose=document.querySelector('#purpose').value;
 const key=selection.value;
 const name=formats[key]?.name||'Хочу совет команды';
 const guests=document.querySelector('#guests').value||'пока не определились';
 const date=document.querySelector('#event-date').value.trim()||'обсудим';
 const body=`Здравствуйте, Даша и Алина!\n\nХотим обсудить гастрономическое событие.\nДля кого: ${purpose}.\nСценарий: ${name}.\nГостей: ${guests}.\nКогда: ${date}.\n\nПодскажите, пожалуйста, какие варианты возможны и от чего будет зависеть стоимость.\n\nМой контакт для ответа: `;
 const text=document.querySelector('#draft-text');text.value=body;
 const updateDraft=()=>{document.querySelector('#draft-link').href='mailto:gastromaniacs@yandex.ru?subject='+encodeURIComponent('Наше событие — '+name)+'&body='+encodeURIComponent(text.value)};
 text.oninput=updateDraft;updateDraft();
 document.querySelector('#draft-preview').hidden=false;
 document.querySelector('#brief-status').textContent='Черновик готов ниже. Проверьте его перед отправкой.';
 text.focus({preventScroll:true});text.scrollIntoView({block:'center',behavior:'auto'});
});

// Offstage scenes stay out of the keyboard path; the three anchor controls
// remain available. Static/mobile/reduced-motion versions expose every scene.
const stageMode=matchMedia('(min-width:1000px) and (prefers-reduced-motion:no-preference)');
let stageObserver;
function syncStageAccess(){
 stageObserver?.disconnect();
 const scenes=[...document.querySelectorAll('.scene')];
 scenes.forEach(scene=>{scene.inert=false});
 if(!stageMode.matches||!CSS.supports('animation-timeline:view()'))return;
 scenes.forEach((scene,index)=>{scene.inert=index!==0});
 stageObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{entry.target.inert=entry.intersectionRatio<.85})},{root:document.querySelector('.stage'),threshold:[0,.85,1]});
 scenes.forEach(scene=>stageObserver.observe(scene));
}
stageMode.addEventListener('change',syncStageAccess);syncStageAccess();
