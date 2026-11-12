(function(){
"use strict";
var sections={
 essays:{title:"Essays",kicker:"THE LONG ARGUMENT",intro:"Criticism, cultural history, strange connections, sharp questions. A growing catalog of essays and investigations."},
 poems:{title:"Poems",kicker:"THE LINE BREAK",intro:"Collections, chapbooks, verse and experiments. Poetry gets its own room, instead of sharing a shelf with the links."},
 "learning-curve":{title:"The Learning Curve",kicker:"TOOLS, NOT TESTAMENTS",intro:"An approachable directory of free guides, research tools and educational resources. Pick an aisle and follow the curiosity."}
};
var name=location.pathname.split("/").filter(Boolean)[0]||"essays",section=sections[name]||sections.essays,db=window.PCP_DB||{},root=document.getElementById("section-list"),search=document.getElementById("section-search");
document.title=section.title+" | Pressure Cooker Poetry";
document.getElementById("section-kicker").textContent=section.kicker;
document.getElementById("section-title").textContent=section.title;
document.getElementById("section-intro").textContent=section.intro;
document.querySelectorAll("[data-section]").forEach(function(a){if(a.dataset.section===name)a.setAttribute("aria-current","page")});
function el(tag,cls,text){var x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=text;return x}
function card(title,label,description,items,link,linkText){
 var a=el("article","entry");a.append(el("span","kind",label),el("h2","",title),el("p","",description));
 if(items&&items.length){var u=el("ul","extracts");items.forEach(function(s){u.append(el("li","",s))});a.append(u)}
 if(link){var b=el("a","go",linkText||"Explore");b.href=link;a.append(b)}
 return a
}
var cards=[];
if(name==="essays"){
 (db.essays||[]).forEach(function(e){cards.push(card(e.t,"Essay · catalog entry",e.dek||"Full essay text is being prepared for publication.",[],null))});
 if(!cards.length)cards.push(card("Essays are being organized","Coming soon","This collection is taking shape.",[],null));
}else if(name==="poems"){
 Object.keys(db.books||{}).forEach(function(t){var poems=db.books[t]||[];cards.push(card(t,poems.length+" poems · collection","Browse the collection and its current table of contents.",poems.slice(0,8),"/kitchen/","Explore the Kitchen archive"))});
 if(!cards.length)cards.push(card("The poetry shelf","Coming soon","Poetry will live here.",[],null));
}else{
 (db.aisles||[]).forEach(function(a){cards.push(card(a.name,a.n+" free resources",a.sign,a.sample||[],"/kitchen/#/food-bank/"+encodeURIComponent(a.id),"Open resource aisle"))});
}
function draw(){var q=search.value.trim().toLowerCase();root.textContent="";var shown=0;cards.forEach(function(c){if(c.textContent.toLowerCase().includes(q)){root.append(c);shown++}});document.getElementById("section-count").textContent=shown+" of "+cards.length+" entries";if(!shown)root.append(el("p","empty","Nothing matches that search."))}
search.addEventListener("input",draw);draw();
})();