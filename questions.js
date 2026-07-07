"use strict";
// ─── Helpers ─────────────────────────────────────────────────
function rnd(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
function pick(arr){return arr[rnd(0,arr.length-1)];}
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function gcd(a,b){return b===0?a:gcd(b,a%b);}
function lcm(a,b){return(a*b)/gcd(a,b);}
function simplify(n,d){const g=gcd(Math.abs(n),Math.abs(d));return{n:n/g,d:d/g};}
function fracStr(n,d){const f=simplify(n,d);if(f.d===1)return String(f.n);return`<span class="fraction"><span class="frac-num">${f.n}</span><span class="frac-bar"></span><span class="frac-den">${f.d}</span></span>`;}
function dec(x,p){return Math.round(x*10**p)/10**p;}
function mcOpts(correct,...wrongs){return shuffle([String(correct),...wrongs.map(String)]);}
function wrongNear(correct,n=3,spread=20){const s=new Set([correct]);let tries=0;while(s.size<n+1&&tries++<200){const w=correct+rnd(1,spread)*(Math.random()<.5?1:-1);if(w>0)s.add(w);}return[...s].filter(x=>x!==correct).slice(0,n);}

const GENERATORS={};

// ════════════════════════════════════════════════════
// GRADE 5 — NUMBER & OPERATIONS IN BASE TEN
// ════════════════════════════════════════════════════

GENERATORS["5-A.1"]=()=>{
  const d=[rnd(1,9),rnd(0,9),rnd(0,9),rnd(0,9),rnd(1,9)];
  const num=d[0]*10000+d[1]*1000+d[2]*100+d[3]*10+d[4];
  const exp=[d[0]?`${d[0]*10000}`:null,d[1]?`${d[1]*1000}`:null,d[2]?`${d[2]*100}`:null,d[3]?`${d[3]*10}`:null,`${d[4]}`].filter(Boolean).join(" + ");
  const toExp=Math.random()<.5;
  return{type:"input",typeBadge:"Expanded Form",
    question:toExp?`Write <strong>${num.toLocaleString()}</strong> in expanded form.`:`What number does <strong>${exp}</strong> equal?`,
    answer:toExp?exp:String(num),hint:"Each digit × its place value"};
};

GENERATORS["5-A.2"]=()=>{
  const names=["ones","tens","hundreds","thousands","ten-thousands"];
  const d=[rnd(1,9),rnd(1,9),rnd(1,9),rnd(1,9),rnd(1,9)];
  const num=d.reduce((s,v,i)=>s+v*10**i,0);
  const pi=rnd(0,4);
  return{type:"mc",typeBadge:"Place Value",
    question:`What digit is in the <strong>${names[pi]}</strong> place of <strong>${num.toLocaleString()}</strong>?`,
    options:mcOpts(d[pi],...shuffle(d.filter((_,i)=>i!==pi)).slice(0,3)),answer:String(d[pi])};
};

GENERATORS["5-C.1"]=()=>{
  const e=rnd(1,5);const v=10**e;
  return{type:"mc",typeBadge:"Powers of Ten",
    question:`Which correctly shows <strong>10<sup>${e}</sup></strong>?`,
    options:shuffle([`10<sup>${e}</sup> = ${v.toLocaleString()}`,`10<sup>${e}</sup> = ${v*10}`,`10<sup>${e}</sup> = ${v/10}`,`10<sup>${e}</sup> = ${e*10}`]),
    answer:`10<sup>${e}</sup> = ${v.toLocaleString()}`};
};

GENERATORS["5-C.2"]=()=>{
  const e=rnd(1,6);
  return{type:"input",typeBadge:"Powers of Ten",question:`Evaluate: <strong>10<sup>${e}</sup></strong>`,answer:String(10**e)};
};

GENERATORS["5-C.3"]=()=>{
  const e=rnd(1,5);
  return{type:"input",typeBadge:"Powers of Ten",question:`Write with an exponent: <strong>${(10**e).toLocaleString()} = 10<sup>?</sup></strong>`,answer:String(e),hint:"Count the zeros"};
};

GENERATORS["5-D.4"]=()=>{
  const n=rnd(2,9),e=rnd(1,4);
  return{type:"input",typeBadge:"Multiply by Power of Ten",question:`<strong>${n} × 10<sup>${e}</sup></strong> = ?`,answer:String(n*10**e)};
};

GENERATORS["5-W.1"]=()=>{
  const tenths=rnd(0,9),hundredths=rnd(0,9);
  const val=dec(tenths*0.1+hundredths*0.01,2);
  const wrong=[dec(val+0.1,2),dec(val-0.01,2),dec(val+0.01,2)].filter(x=>x>=0&&x!==val);
  return{type:"mc",typeBadge:"Decimal Blocks",
    question:`A decimal model shows <strong>${tenths} tenths</strong> and <strong>${hundredths} hundredths</strong> shaded. What decimal does it show?`,
    options:mcOpts(val,...wrong.slice(0,3)),answer:String(val)};
};

GENERATORS["5-W.3"]=()=>{
  const words=[
    {w:"three and forty-five hundredths",v:"3.45"},
    {w:"seven tenths",v:"0.7"},
    {w:"two and eight hundredths",v:"2.08"},
    {w:"twelve and three hundredths",v:"12.03"},
    {w:"five and sixty hundredths",v:"5.60"},
    {w:"one and nine tenths",v:"1.9"},
    {w:"four hundredths",v:"0.04"},
  ];
  const item=pick(words);
  const opts=shuffle([item.v,...words.filter(x=>x.v!==item.v).map(x=>x.v).slice(0,3)]);
  return{type:"mc",typeBadge:"Decimals in Words",question:`Which decimal equals <strong>"${item.w}"</strong>?`,options:opts,answer:item.v};
};

GENERATORS["5-W.4"]=()=>{
  const names=["tenths","hundredths","thousandths"];
  const d=[rnd(1,9),rnd(0,9),rnd(1,9)];
  const num=dec(d[0]*0.1+d[1]*0.01+d[2]*0.001,3);
  const pi=rnd(0,2);
  const wrongOpts=shuffle(d.filter((_,i)=>i!==pi)).slice(0,3);
  return{type:"mc",typeBadge:"Decimal Place Value",
    question:`What digit is in the <strong>${names[pi]}</strong> place of <strong>${num}</strong>?`,
    options:mcOpts(d[pi],...wrongOpts),answer:String(d[pi])};
};

GENERATORS["5-W.5"]=()=>{
  const qs=[
    {q:"How many times greater is the tenths place than the hundredths place?",a:"10",opts:["10","100","1000","5"]},
    {q:"How many hundredths are in 1 tenth?",a:"10",opts:["10","100","1","0.1"]},
    {q:"How many thousandths are in 1 hundredth?",a:"10",opts:["10","100","1000","0.01"]},
    {q:"The value of the tenths place is ___ the value of the hundredths place.",a:"10 times greater",opts:["10 times greater","10 times smaller","100 times greater","equal to"]},
  ];
  const item=pick(qs);
  return{type:"mc",typeBadge:"Decimal Place Values",question:item.q,options:shuffle(item.opts),answer:item.a};
};

GENERATORS["5-W.6"]=()=>{
  const a=rnd(1,9),b=rnd(0,9),c=rnd(0,9);
  const num=dec(a+b*0.1+c*0.01,2);
  const exp=`${a} + ${b*0.1} + ${c*0.01}`;
  const toExp=Math.random()<.5;
  return{type:"input",typeBadge:"Decimal Expanded Form",
    question:toExp?`Write <strong>${num}</strong> in expanded form.`:`What decimal does <strong>${exp}</strong> represent?`,
    answer:toExp?exp:String(num)};
};

GENERATORS["5-W.7"]=()=>{
  const a=rnd(1,9),b=rnd(1,9),c=rnd(1,9);
  const num=dec(a+b*0.1+c*0.01,2);
  return{type:"input",typeBadge:"Decimal Expanded (Fractions)",
    question:`Write <strong>${num}</strong> in expanded form using fractions.`,
    answer:`${a} + ${b}/10 + ${c}/100`,hint:`${num} = ones + tenths/10 + hundredths/100`};
};

GENERATORS["5-W.8"]=()=>{
  const a=rnd(1,5),b=rnd(1,9);
  const num=dec(a+b*0.1,1);
  const opts=[`${a} + ${b*0.1}`,`${a-1} + ${1+b*0.1}`,`${a} ones and ${b} tenths`,`${a*10+b} tenths`];
  const correct=`${a} + ${b*0.1}`;
  return{type:"mc",typeBadge:"Decompose Decimals",
    question:`Which shows a way to decompose <strong>${num}</strong>?`,
    options:shuffle(opts),answer:correct};
};

GENERATORS["5-W.9"]=()=>{
  const num=dec(rnd(100,9999)/1000,3);
  const placeNames=["whole number","tenth","hundredth"];
  const places=[0,1,2];
  const pi=pick(places);
  const factor=10**pi;
  const rounded=dec(Math.round(num*factor)/factor,pi);
  return{type:"input",typeBadge:"Round Decimals",
    question:`Round <strong>${num}</strong> to the nearest <strong>${placeNames[pi]}</strong>.`,
    answer:String(rounded),hint:pi===0?"Look at the tenths digit.":`Look one place to the right of the ${placeNames[pi]}.`};
};

GENERATORS["5-X.2"]=()=>{
  const a=dec(rnd(1,9)*0.1+rnd(0,9)*0.01,2);
  const b=dec(rnd(1,9)*0.1+rnd(0,9)*0.01,2);
  const correct=a>b?`${a} is greater`:`${b} is greater`;
  return{type:"mc",typeBadge:"Compare Decimals",
    question:`Two decimal grids show <strong>${a}</strong> and <strong>${b}</strong>. Which is greater?`,
    options:shuffle([`${a} is greater`,`${b} is greater`,"They are equal",`Cannot tell from grids`]),answer:correct};
};

GENERATORS["5-X.3"]=()=>{
  const a=dec(rnd(10,90)*0.01,2);
  const b=dec(a+rnd(1,15)*0.01,2);
  const c=dec(a+rnd(1,5)*0.1,1);
  const opts=[a,b,c,dec(a-0.01,2)].filter(x=>x>=0);
  const correct=pick(opts);
  return{type:"mc",typeBadge:"Number Line Decimals",
    question:`A point is located between <strong>${a}</strong> and <strong>${c}</strong> on a number line, closer to ${c}. Which decimal could it be?`,
    options:shuffle([String(b),String(a),String(c),String(dec(a+0.01,2))]),answer:String(b)};
};

GENERATORS["5-X.4"]=()=>{
  const a=dec(rnd(10,990)/100,2),b=dec(rnd(10,990)/100,2);
  const sym=a>b?">":a<b?"<":"=";
  return{type:"mc",typeBadge:"Compare Decimals",
    question:`Compare: <strong>${a} ___ ${b}</strong>`,options:[">","<","=","≈"],answer:sym};
};

GENERATORS["5-AA.13"]=()=>{
  const a=dec(rnd(15,200)/10,1),b=dec(rnd(15,200)/10,1);
  const ra=Math.round(a),rb=Math.round(b);
  const isAdd=Math.random()<.5;
  const correct=isAdd?ra+rb:Math.max(ra-rb,1);
  // ensure 3 distinct wrong options far enough from correct
  const wrongs=[correct+1,correct+2,correct-1].filter(x=>x>0&&x!==correct).slice(0,3);
  return{type:"mc",typeBadge:"Estimate Decimals",
    question:`Estimate <strong>${a} ${isAdd?"+":"−"} ${b}</strong> by rounding to the nearest whole number.`,
    options:shuffle([String(correct),...wrongs.map(String)]),
    answer:String(correct)};
};

GENERATORS["5-BB.1"]=()=>{
  const base=dec(rnd(1,99)/10,1),e=pick([1,2,3]);
  return{type:"input",typeBadge:"Decimal × Power of Ten",
    question:`<strong>${base} × 10<sup>${e}</sup></strong> = ?`,answer:String(dec(base*10**e,2))};
};

GENERATORS["5-BB.3"]=()=>{
  const n=rnd(2,99),m=pick([0.1,0.01]);
  return{type:"input",typeBadge:"Multiply by 0.1 or 0.01",
    question:`<strong>${n} × ${m}</strong> = ?`,answer:String(dec(n*m,2)),
    hint:`Multiplying by ${m} moves the decimal ${m===0.1?1:2} place${m===0.01?"s":""} left.`};
};

GENERATORS["5-BB.4"]=()=>{
  const base=dec(rnd(1,99)/10,1),e=pick([1,2,3]);
  const result=dec(base*10**e,2);
  return{type:"input",typeBadge:"Missing Power of Ten",
    question:`<strong>${base} × ___ = ${result}</strong>. What is the missing number?`,
    answer:String(10**e),hint:"How many times do you multiply by 10?"};
};

GENERATORS["5-EE.1"]=()=>{
  const base=rnd(1,9)*10**rnd(2,4),e=pick([1,2,3]);
  return{type:"input",typeBadge:"Divide by Power of Ten",
    question:`<strong>${base} ÷ 10<sup>${e}</sup></strong> = ?`,answer:String(dec(base/10**e,3))};
};

GENERATORS["5-EE.2"]=()=>{
  const qs=[
    {q:"As the power of ten divisor gets larger, the quotient gets…",a:"smaller",opts:["smaller","larger","stays the same","doubles"]},
    {q:"36 ÷ 10 = 3.6. What is 36 ÷ 100?",a:"0.36",opts:["0.36","3.6","0.036","36"]},
    {q:"4.5 ÷ 10 = 0.45. What is 4.5 ÷ 1,000?",a:"0.0045",opts:["0.0045","0.045","0.45","4.5"]},
  ];
  const item=pick(qs);
  return{type:"mc",typeBadge:"Division Patterns",question:item.q,options:shuffle(item.opts),answer:item.a};
};

GENERATORS["5-EE.5"]=()=>{
  const base=dec(rnd(1,99)/10,1),e=pick([1,2,3]);
  const result=dec(base/10**e,e+1);
  return{type:"input",typeBadge:"Missing Divisor",
    question:`<strong>${base} ÷ ___ = ${result}</strong>. What is the missing number?`,
    answer:String(10**e)};
};

GENERATORS["5-EE.6"]=()=>{
  const n=dec(rnd(2,99)/10,1),m=pick([0.1,0.01]);
  const ans=dec(n/m,0);
  return{type:"input",typeBadge:"Divide by 0.1 or 0.01",
    question:`<strong>${n} ÷ ${m}</strong> = ?`,answer:String(ans),
    hint:`Dividing by ${m} moves the decimal ${m===0.1?1:2} place${m===0.01?"s":""} right.`};
};

// ═══ Grade 5: Whole-Number Multiplication & Division ═══

GENERATORS["5-D.9"]=()=>{
  const a=rnd(12,49),b=rnd(12,29);
  const t=Math.floor(b/10)*10,o=b%10;
  return{type:"input",typeBadge:"Partial Products",
    question:`Use partial products to multiply <strong>${a} × ${b}</strong>.<br>${a} × ${t} = ___, ${a} × ${o} = ___, total = ?`,
    answer:String(a*b),hint:`${a}×${t}=${a*t}, ${a}×${o}=${a*o}, sum=${a*b}`};
};

GENERATORS["5-D.10"]=()=>{
  const a=rnd(11,99),b=rnd(11,99);
  return{type:"input",typeBadge:"2-Digit × 2-Digit",question:`<strong>${a} × ${b}</strong> = ?`,answer:String(a*b)};
};

GENERATORS["5-D.11"]=()=>{
  const a=rnd(11,99),b=rnd(100,999);
  return{type:"input",typeBadge:"2-Digit × 3-Digit",question:`<strong>${a} × ${b}</strong> = ?`,answer:String(a*b)};
};

GENERATORS["5-D.12"]=()=>{
  const a=rnd(11,49),b=rnd(1000,9999);
  return{type:"input",typeBadge:"2-Digit × Large Number",question:`<strong>${a} × ${b}</strong> = ?`,answer:String(a*b)};
};

GENERATORS["5-D.13"]=()=>{
  const containers=["boxes","crates","bags","trays","cartons"];
  const things=["books","apples","pencils","stickers","bottles"];
  const c=pick(containers),t=pick(things);
  const a=rnd(12,45),b=rnd(15,99);
  return{type:"word",typeBadge:"Multiplication Word Problem",
    question:`A warehouse has <strong>${a} ${c}</strong> of ${t}s. Each ${c.slice(0,-1)} holds <strong>${b} ${t}s</strong>. How many ${t}s are there in all?`,
    answer:String(a*b)};
};

GENERATORS["5-D.14"]=()=>{
  const a=rnd(100,999),b=rnd(100,999);
  return{type:"input",typeBadge:"3-Digit × 3-Digit",question:`<strong>${a} × ${b}</strong> = ?`,answer:String(a*b),hint:"Multiply in parts using place value."};
};

GENERATORS["5-E.9"]=()=>{
  const divisor=rnd(11,45),quotient=rnd(10,90);
  const dividend=divisor*quotient+rnd(0,divisor-1);
  const est=Math.round(dividend/divisor/10)*10||10;
  return{type:"mc",typeBadge:"Estimate Division",
    question:`Estimate <strong>${dividend} ÷ ${divisor}</strong> by rounding.`,
    options:mcOpts(quotient,...wrongNear(quotient,3,15)),answer:String(quotient)};
};

GENERATORS["5-E.10"]=()=>{
  const b=pick([12,14,16,18,21,24]);
  const q=rnd(3,8);
  const a=b*q;
  return{type:"mc",typeBadge:"Division Models",
    question:`Which expression matches a model that shows <strong>${a}</strong> objects split into equal groups of <strong>${b}</strong>?`,
    options:shuffle([`${a} ÷ ${b} = ${q}`,`${b} ÷ ${a} = ${dec(b/a,2)}`,`${a} × ${b} = ${a*b}`,`${q} ÷ ${b} = ${dec(q/b,2)}`]),
    answer:`${a} ÷ ${b} = ${q}`};
};

GENERATORS["5-E.11"]=()=>{
  const b=rnd(11,25),q=rnd(10,40);
  const a=b*q;
  return{type:"input",typeBadge:"Partial Quotients",
    question:`Use partial quotients to divide: <strong>${a} ÷ ${b}</strong> = ?`,
    answer:String(q),hint:`Try: How many ${b}s fit in ${a}? Start with a round number like ${Math.floor(q/10)*10}.`};
};

GENERATORS["5-E.12"]=()=>{
  const b=rnd(11,45),q=rnd(10,99);
  return{type:"input",typeBadge:"3-Digit ÷ 2-Digit",question:`<strong>${b*q} ÷ ${b}</strong> = ?`,answer:String(q)};
};

GENERATORS["5-E.13"]=()=>{
  const pPerBox=rnd(12,48),boxes=rnd(10,50);
  const total=pPerBox*boxes;
  return{type:"word",typeBadge:"Division Word Problem",
    question:`A factory packed <strong>${total} items</strong> equally into <strong>${boxes} boxes</strong>. How many items are in each box?`,
    answer:String(pPerBox)};
};

GENERATORS["5-E.14"]=()=>{
  const b=rnd(12,50),q=rnd(10,200);
  return{type:"input",typeBadge:"4-Digit ÷ 2-Digit",question:`<strong>${b*q} ÷ ${b}</strong> = ?`,answer:String(q)};
};

GENERATORS["5-E.15"]=()=>{
  const price=rnd(12,80),qty=rnd(15,50);
  return{type:"word",typeBadge:"Division Word Problem",
    question:`A school spent <strong>$${price*qty}</strong> on ${qty} chairs. How much did each chair cost?`,
    answer:`$${price}`};
};

// ═══ Grade 5: Decimal Operations ═══

GENERATORS["5-AA.1"]=()=>{
  const a=dec(rnd(1,9)*0.1+rnd(0,9)*0.01,2);
  const b=dec(rnd(1,9)*0.1+rnd(0,9)*0.01,2);
  return{type:"mc",typeBadge:"Add Decimals (Blocks)",
    question:`Decimal blocks show <strong>${a}</strong> and <strong>${b}</strong>. What is their sum?`,
    options:mcOpts(dec(a+b,2),...wrongNear(dec(a+b,2)*100,3,15).map(x=>dec(x/100,2))),
    answer:String(dec(a+b,2))};
};

GENERATORS["5-AA.2"]=()=>{
  const a=dec(rnd(10,999)/10,1),b=dec(rnd(10,999)/10,1);
  return{type:"input",typeBadge:"Add Decimals",question:`<strong>${a} + ${b}</strong> = ?`,answer:String(dec(a+b,2))};
};

GENERATORS["5-AA.3"]=()=>{
  const a=dec(rnd(10,50)/10,1),b=dec(rnd(10,50)/10,1),c=dec(rnd(10,50)/10,1);
  return{type:"input",typeBadge:"Add Three Decimals",
    question:`Add using properties: <strong>${a} + ${b} + ${c}</strong> = ?`,
    answer:String(dec(a+b+c,2)),hint:"Group numbers that make a whole number first!"};
};

GENERATORS["5-AA.5"]=()=>{
  const b=dec(rnd(10,499)/10,1),a=dec(b+rnd(10,500)/10,1);
  return{type:"input",typeBadge:"Subtract Decimals",question:`<strong>${a} − ${b}</strong> = ?`,answer:String(dec(a-b,2))};
};

GENERATORS["5-AA.6"]=()=>{
  const op=Math.random()<.5?"+":"−";
  const b=dec(rnd(10,400)/10,1),a=op==="+"?dec(rnd(10,400)/10,1):dec(b+rnd(10,400)/10,1);
  const ans=op==="+"?dec(a+b,2):dec(a-b,2);
  return{type:"input",typeBadge:"Add & Subtract Decimals",question:`<strong>${a} ${op} ${b}</strong> = ?`,answer:String(ans)};
};

GENERATORS["5-AA.7"]=()=>{
  const qs=[
    {q:"To add 3.99, you can add 4 then subtract ___.",a:"0.01",opts:["0.01","0.1","1","4"]},
    {q:"To subtract 2.98, subtract 3 then add ___.",a:"0.02",opts:["0.02","0.2","2","3"]},
    {q:"5.2 + 1.8 can be regrouped as ___ + ___ = 7.",a:"5 + 2",opts:["5 + 2","5.2 + 1.8","4 + 3","6 + 1"]},
  ];
  const item=pick(qs);
  return{type:"mc",typeBadge:"Compensation Strategy",question:item.q,options:shuffle(item.opts),answer:item.a};
};

GENERATORS["5-AA.8"]=()=>{
  const scenarios=[
    (a,b)=>({q:`Maya ran <strong>${a} km</strong> on Monday and <strong>${b} km</strong> on Tuesday. How far did she run in total?`,a:String(dec(a+b,2))}),
    (a,b)=>({q:`A rope is <strong>${dec(a+b,2)} m</strong> long. Sam cuts off <strong>${b} m</strong>. How long is the remaining piece?`,a:String(a)}),
    (a,b)=>({q:`A bottle holds <strong>${dec(a+b,2)} L</strong>. After drinking <strong>${a} L</strong>, how much is left?`,a:String(b)}),
  ];
  const a=dec(rnd(10,150)/10,1),b=dec(rnd(10,100)/10,1);
  const s=pick(scenarios)(a,b);
  return{type:"word",typeBadge:"Decimal Word Problem",question:s.q,answer:s.a};
};

GENERATORS["5-AA.9"]=()=>{
  const target=dec(rnd(20,100)/10,1);
  const a=dec(rnd(10,Math.floor(target*10)-5)/10,1);
  const b=dec(target-a,1);
  return{type:"mc",typeBadge:"Choose Decimals",
    question:`Which pair of decimals has a sum of <strong>${target}</strong>?`,
    options:shuffle([`${a} and ${b}`,`${dec(a+0.1,1)} and ${dec(b+0.1,1)}`,`${dec(a-0.2,1)} and ${b}`,`${a} and ${dec(b+0.2,1)}`]),
    answer:`${a} and ${b}`};
};

GENERATORS["5-AA.10"]=()=>{
  const a=dec(rnd(10,200)/10,1),b=dec(rnd(10,100)/10,1);
  const op=Math.random()<.5;
  const res=op?dec(a+b,2):dec(a+b,2);
  const missing=op?b:a;
  return{type:"input",typeBadge:"Missing Decimal",
    question:op?`<strong>${a} + ___ = ${dec(a+b,2)}</strong>`:`<strong>___ + ${b} = ${dec(a+b,2)}</strong>`,
    answer:String(missing)};
};

GENERATORS["5-AA.11"]=()=>{
  const a=dec(rnd(10,200)/10,1),b=dec(rnd(10,100)/10,1);
  const c=dec(rnd(10,200)/10,1),d=dec(rnd(10,100)/10,1);
  const s1=dec(a+b,2),s2=dec(c+d,2);
  const sym=s1>s2?">":`s1<s2?"<":"="`; // will compute below
  const correct=s1>s2?"First is greater":s1<s2?"Second is greater":"They are equal";
  return{type:"mc",typeBadge:"Compare Sums",
    question:`Which is greater: <strong>${a}+${b}</strong> or <strong>${c}+${d}</strong>?`,
    options:shuffle(["First is greater","Second is greater","They are equal","Cannot tell"]),
    answer:correct};
};

GENERATORS["5-BB.1"]=()=>{
  const base=dec(rnd(1,99)/10,1),e=pick([1,2,3]);
  return{type:"input",typeBadge:"Decimal × Power of Ten",
    question:`<strong>${base} × 10<sup>${e}</sup></strong> = ?`,answer:String(dec(base*10**e,2))};
};

GENERATORS["5-CC.2"]=()=>{
  const d=pick([0.1,0.01]),n=rnd(2,9),whole=rnd(1,9);
  const a=dec(whole*d,2);
  return{type:"input",typeBadge:"Decimal × Whole Number",
    question:`<strong>${a} × ${n}</strong> = ?`,answer:String(dec(a*n,2))};
};

GENERATORS["5-CC.3"]=()=>{
  const a=dec(rnd(11,49)/10,1),b=rnd(2,9);
  return{type:"mc",typeBadge:"Decimal × 1-Digit (Blocks)",
    question:`Blocks show <strong>${a} × ${b}</strong>. What is the product?`,
    options:mcOpts(dec(a*b,2),...wrongNear(Math.round(a*b*10),3,8).map(x=>dec(x/10,1))),
    answer:String(dec(a*b,2))};
};

GENERATORS["5-CC.4"]=()=>{
  const n=rnd(2,9),a=rnd(2,7),b=dec(rnd(1,9)/10,1);
  const total=dec(a+b,1);
  return{type:"input",typeBadge:"Distributive Property",
    question:`Use the distributive property: <strong>${n} × ${total}</strong><br>= ${n} × ${a} + ${n} × ${b} = ?`,
    answer:String(dec(n*total,2)),hint:`${n}×${a}=${n*a}, ${n}×${b}=${dec(n*b,2)}`};
};

GENERATORS["5-CC.5"]=()=>{
  const a=dec(rnd(11,99)/10,1),b=rnd(2,9);
  return{type:"input",typeBadge:"Decimal × 1-Digit",question:`<strong>${a} × ${b}</strong> = ?`,answer:String(dec(a*b,2))};
};

GENERATORS["5-CC.6"]=()=>{
  const a=dec(rnd(11,49)/10,1),b=rnd(11,25);
  return{type:"mc",typeBadge:"Decimal × 2-Digit (Area Model)",
    question:`An area model shows <strong>${a} × ${b}</strong>. What is the product?`,
    options:mcOpts(dec(a*b,2),...wrongNear(Math.round(a*b),3,10).map(x=>dec(x,1))),
    answer:String(dec(a*b,2))};
};

GENERATORS["5-CC.7"]=()=>{
  const a=dec(rnd(11,99)/10,1),b=rnd(12,50);
  return{type:"input",typeBadge:"Decimal × Multi-Digit",question:`<strong>${a} × ${b}</strong> = ?`,answer:String(dec(a*b,2))};
};

GENERATORS["5-CC.8"]=()=>{
  const price=dec(rnd(15,99)/10,1),qty=rnd(3,12);
  return{type:"word",typeBadge:"Decimal × Whole Word Problem",
    question:`One notebook costs <strong>$${price}</strong>. How much do <strong>${qty} notebooks</strong> cost?`,
    answer:`$${dec(price*qty,2).toFixed(2)}`};
};

GENERATORS["5-CC.9"]=()=>{
  const a=rnd(2,5),b=dec(rnd(11,49)/10,1),c=rnd(2,4);
  return{type:"input",typeBadge:"Three Factors with Decimal",
    question:`<strong>${a} × ${b} × ${c}</strong> = ?`,answer:String(dec(a*b*c,2))};
};

GENERATORS["5-DD.1"]=()=>{
  const a=dec(rnd(11,99)/10,1),b=dec(rnd(11,99)/10,1);
  const ra=Math.round(a),rb=Math.round(b);
  return{type:"mc",typeBadge:"Estimate Decimal Products",
    question:`Estimate <strong>${a} × ${b}</strong> by rounding to the nearest whole number.`,
    options:mcOpts(ra*rb,...wrongNear(ra*rb,3,10)),answer:String(ra*rb)};
};

GENERATORS["5-DD.4"]=()=>{
  const a=rnd(1,9),b=rnd(1,9),da=rnd(0,1),db=rnd(0,1);
  const fa=da?a/10:a,fb=db?b/10:b;
  const product=dec(fa*fb,da+db);
  const places=da+db;
  return{type:"mc",typeBadge:"Decimal Point Placement",
    question:`<strong>${a} × ${b} = ${a*b}</strong>. Where does the decimal point go in <strong>${a*(da?0.1:1)} × ${b*(db?0.1:1)}</strong>?`,
    options:mcOpts(String(product),...[dec(product*10,da+db),dec(product*100,da+db),dec(product/10,da+db+1)].map(String)),
    answer:String(product)};
};

GENERATORS["5-DD.6"]=()=>{
  const a=dec(rnd(11,99)/10,1),b=dec(rnd(11,99)/10,1);
  return{type:"input",typeBadge:"Decimal × Decimal",question:`<strong>${a} × ${b}</strong> = ?`,answer:String(dec(a*b,2))};
};

GENERATORS["5-FF.4"]=()=>{
  const b=rnd(2,9),q=dec(rnd(11,99)/10,1);
  return{type:"input",typeBadge:"Decimal ÷ Whole (Place Value)",
    question:`<strong>${dec(b*q,2)} ÷ ${b}</strong> = ?`,answer:String(q),hint:"Use place value — think of it as tenths ÷ whole number."};
};

GENERATORS["5-FF.5"]=()=>{
  const b=rnd(2,8),q=dec(rnd(11,99)/10,1);
  return{type:"input",typeBadge:"Decimal ÷ Whole Number",question:`<strong>${dec(b*q,2)} ÷ ${b}</strong> = ?`,answer:String(q)};
};

GENERATORS["5-FF.6"]=()=>{
  const b=pick([2,4,5,8,10]),whole=rnd(1,9);
  const q=dec(whole*b+rnd(1,b-1||1),0);
  const dividend=q;
  const quotient=dec(dividend/b,2);
  return{type:"input",typeBadge:"Decimal Quotient",
    question:`<strong>${dividend} ÷ ${b}</strong> = ? (Your answer will be a decimal.)`,answer:String(quotient)};
};

GENERATORS["5-FF.7"]=()=>{
  const b=pick([3,6,7,9]),a=rnd(10,99);
  const exact=dec(a/b,4);
  const rounded=dec(Math.round(exact*10)/10,1);
  return{type:"input",typeBadge:"Decimal Quotient & Rounding",
    question:`Divide <strong>${a} ÷ ${b}</strong> and round to the nearest tenth.`,
    answer:String(rounded)};
};

GENERATORS["5-FF.8"]=()=>{
  const litres=dec(rnd(30,120)/10,1),people=pick([2,4,5,8,10]);
  const each=dec(litres/people,2);
  return{type:"word",typeBadge:"Decimal Division Word Problem",
    question:`<strong>${litres} litres</strong> of juice is shared equally among <strong>${people} friends</strong>. How many litres does each person get?`,
    answer:String(each)};
};

GENERATORS["5-FF.9"]=()=>{
  const divisor=pick([0.2,0.4,0.5,0.25]);
  const quotient=rnd(2,20);
  const dividend=dec(divisor*quotient,2);
  return{type:"input",typeBadge:"Divide by Decimal",
    question:`<strong>${dividend} ÷ ${divisor}</strong> = ?`,answer:String(quotient),
    hint:`Multiply both by ${1/divisor} to make it a whole-number division.`};
};

GENERATORS["5-GG.1"]=()=>{
  const ops=[
    ()=>{const a=dec(rnd(20,200)/10,1),b=dec(rnd(10,100)/10,1);return{q:`<strong>${a} + ${b}</strong>`,a:String(dec(a+b,2))};},
    ()=>{const b=dec(rnd(10,100)/10,1),a=dec(b+rnd(10,150)/10,1);return{q:`<strong>${a} − ${b}</strong>`,a:String(dec(a-b,2))};},
    ()=>{const a=dec(rnd(11,49)/10,1),b=rnd(2,9);return{q:`<strong>${a} × ${b}</strong>`,a:String(dec(a*b,2))};},
    ()=>{const b=rnd(2,8),q=dec(rnd(11,49)/10,1);return{q:`<strong>${dec(b*q,2)} ÷ ${b}</strong>`,a:String(q)};},
  ];
  const o=pick(ops)();
  return{type:"input",typeBadge:"Mixed Decimal Operations",question:`Calculate: ${o.q}`,answer:o.a};
};

GENERATORS["5-GG.2"]=()=>{
  const price=dec(rnd(15,99)/10,1),qty=rnd(2,8);
  const total=dec(price*qty,2);
  const paid=dec(Math.ceil(total/5)*5,0);
  return{type:"word",typeBadge:"Decimal Word Problem",
    question:`${qty} sandwiches cost <strong>$${price} each</strong>. You pay with $${paid}. How much change do you get?`,
    answer:`$${dec(paid-total,2).toFixed(2)}`};
};

GENERATORS["5-GG.3"]=()=>{
  const a=dec(rnd(20,80)/10,1),b=dec(rnd(10,40)/10,1),rate=dec(rnd(12,49)/10,1);
  const dist=dec((a+b)*rate,2);
  return{type:"word",typeBadge:"Multi-Step Decimal Problem",
    question:`A car travels at <strong>${rate} km per minute</strong>. It travels for <strong>${a} minutes</strong>, stops, then travels <strong>${b} more minutes</strong>. What is the total distance?`,
    answer:String(dist)};
};

GENERATORS["5-HH.1"]=()=>{
  const a=dec(rnd(100,5000)/100,2),b=dec(rnd(50,Math.floor(a*100-1))/100,2);
  const op=Math.random()<.5;
  return{type:"input",typeBadge:"Money",
    question:`<strong>$${a.toFixed(2)} ${op?"+":"−"} $${b.toFixed(2)}</strong> = ?`,
    answer:`$${dec(op?a+b:a-b,2).toFixed(2)}`};
};

GENERATORS["5-HH.2"]=()=>{
  const price=dec(rnd(50,500)/100,2),qty=rnd(2,8);
  return{type:"word",typeBadge:"Money Word Problem",
    question:`Ava bought ${qty} items at <strong>$${price.toFixed(2)} each</strong>. How much did she spend?`,
    answer:`$${dec(price*qty,2).toFixed(2)}`};
};

GENERATORS["5-HH.5"]=()=>{
  const hourly=dec(rnd(800,2000)/100,2),hours=rnd(3,8);
  return{type:"word",typeBadge:"Money Word Problem",
    question:`A babysitter earns <strong>$${hourly.toFixed(2)} per hour</strong> and works <strong>${hours} hours</strong>. How much do they earn?`,
    answer:`$${dec(hourly*hours,2).toFixed(2)}`};
};

GENERATORS["5-HH.8"]=()=>{
  const total=dec(rnd(400,2000)/100,2),ways=pick([2,4,5,8,10]);
  return{type:"word",typeBadge:"Money Word Problem",
    question:`A prize of <strong>$${total.toFixed(2)}</strong> is split equally among <strong>${ways} winners</strong>. How much does each winner get?`,
    answer:`$${dec(total/ways,2).toFixed(2)}`};
};

// ════════════════════════════════════════════════════
// GRADE 5 — FRACTIONS
// ════════════════════════════════════════════════════

GENERATORS["5-L.2"]=()=>{
  const d1=pick([2,3,4,6]),d2=pick([2,3,4,6].filter(x=>x!==d1));
  const n1=rnd(1,d1-1),n2=rnd(1,d2-1);
  const common=lcm(d1,d2);
  const numSum=n1*(common/d1)+n2*(common/d2);
  const {n,d}=simplify(numSum,common);
  const w=Math.floor(n/d),r=n%d;
  const ans=d===1?String(n):w>0?`${w} ${r}/${d}`:`${n}/${d}`;
  return{type:"mc",typeBadge:"Add Fractions (Models)",
    question:`A fraction bar shows ${fracStr(n1,d1)} and ${fracStr(n2,d2)} combined. What is the total?`,
    options:mcOpts(ans,`${n1+n2}/${d1+d2}`,`${n1}/${d2}`,`${n2}/${d1}`),answer:ans};
};

GENERATORS["5-L.3"]=()=>{
  const d1=pick([2,3,4,5,6,8]),d2=pick([2,3,4,5,6,8].filter(x=>x!==d1));
  const n1=rnd(1,d1-1),n2=rnd(1,d2-1);
  const common=lcm(d1,d2);
  const numSum=n1*(common/d1)+n2*(common/d2);
  const {n,d}=simplify(numSum,common);
  const w=Math.floor(n/d),r=n%d;
  const ans=d===1?String(n):w>0?`${w} ${r}/${d}`:`${n}/${d}`;
  return{type:"input",typeBadge:"Add Fractions",
    question:`Add: <strong>${fracStr(n1,d1)} + ${fracStr(n2,d2)}</strong>`,
    answer:ans,hint:`LCM of ${d1} and ${d2} is ${common}`};
};

GENERATORS["5-L.4"]=()=>{
  const d1=pick([3,4,6,8]),d2=pick([2,3,4,6].filter(x=>x!==d1));
  const common=lcm(d1,d2);
  const n2=rnd(1,d2-1);
  const n1=n2*(common/d2)+rnd(1,d1);
  const numDiff=n1*(common/d1)-n2*(common/d2);
  const {n,d}=simplify(numDiff,common);
  const ans=d===1?String(n):`${n}/${d}`;
  return{type:"mc",typeBadge:"Subtract Fractions (Models)",
    question:`A model shows ${fracStr(n1,d1)} with ${fracStr(n2,d2)} removed. What remains?`,
    options:mcOpts(ans,`${n1-n2}/${d1}`,`${n1+n2}/${d2}`,`${Math.abs(n1-n2)}/${d1+d2}`),answer:ans};
};

GENERATORS["5-L.5"]=()=>{
  const d1=pick([3,4,5,6,8,10]),d2=pick([2,3,4,5,6].filter(x=>x!==d1));
  const common=lcm(d1,d2);
  const n2=rnd(1,d2-1);
  const minN1=Math.ceil(n2*common/d2)+1;
  const n1=rnd(minN1,minN1+d1);
  const numDiff=n1*(common/d1)-n2*(common/d2);
  const {n,d}=simplify(numDiff,common);
  const ans=d===1?String(n):`${n}/${d}`;
  return{type:"input",typeBadge:"Subtract Fractions",
    question:`Subtract: <strong>${fracStr(n1,d1)} − ${fracStr(n2,d2)}</strong>`,answer:ans};
};

GENERATORS["5-L.7"]=()=>{
  const d1=pick([2,3,4]),d2=pick([3,4,5,6].filter(x=>x!==d1));
  const n1=rnd(1,d1-1),n2=rnd(1,d2-1);
  const common=lcm(d1,d2);
  const numSum=n1*(common/d1)+n2*(common/d2);
  const {n,d}=simplify(numSum,common);
  const w=Math.floor(n/d),r=n%d;
  const ans=d===1?String(n):w>0?`${w} ${r}/${d}`:`${n}/${d}`;
  const foods=[["pizza","pieces"],["ribbon","metres"],["juice","litres"]];
  const [food,unit]=pick(foods);
  return{type:"word",typeBadge:"Fraction Word Problem",
    question:`Emma used ${fracStr(n1,d1)} ${unit} of ${food} and Jake used ${fracStr(n2,d2)} ${unit}. How much ${food} did they use altogether?`,
    answer:ans};
};

GENERATORS["5-L.8"]=()=>{
  const denoms=[2,3,4,6];
  const [d1,d2,d3]=shuffle(denoms).slice(0,3);
  const n1=rnd(1,d1-1),n2=rnd(1,d2-1),n3=rnd(1,d3-1);
  const common=lcm(lcm(d1,d2),d3);
  const numSum=n1*(common/d1)+n2*(common/d2)+n3*(common/d3);
  const {n,d}=simplify(numSum,common);
  const w=Math.floor(n/d),r=n%d;
  const ans=d===1?String(n):w>0?`${w} ${r}/${d}`:`${n}/${d}`;
  return{type:"input",typeBadge:"Add 3 Fractions",
    question:`Add: <strong>${fracStr(n1,d1)} + ${fracStr(n2,d2)} + ${fracStr(n3,d3)}</strong>`,
    answer:ans,hint:`Common denominator: ${common}`};
};

GENERATORS["5-M.7"]=()=>{
  const d=pick([2,3,4]);
  const have=rnd(2,5)+rnd(1,d-1)/d;
  const need=rnd(1,3)+rnd(1,d-1)/d;
  const haveN=Math.round(have*d),needN=Math.round(need*d);
  const haveStr=`${Math.floor(haveN/d)} ${fracStr(haveN%d,d)}`.trim();
  const needStr=`${Math.floor(needN/d)} ${fracStr(needN%d,d)}`.trim();
  const diffN=haveN-needN;
  const ans=diffN>0?`${Math.floor(diffN/d)} ${diffN%d>0?fracStr(diffN%d,d):""}`.trim():"0";
  return{type:"word",typeBadge:"Fractions in Recipes",
    question:`A recipe needs ${needStr} cups of flour. You have ${haveStr} cups. How much extra flour do you have?`,
    answer:ans};
};

GENERATORS["5-M.8"]=()=>{
  const d=pick([3,4,6]);
  const a=rnd(1,d-1),b=rnd(1,d-1);
  const sum=a+b;
  const whole=Math.floor(sum/d),rem=sum%d;
  const ans=rem>0?`${whole} ${rem}/${d}`:String(whole);
  return{type:"word",typeBadge:"Multi-Step Fractions",
    question:`In the morning a plant grew ${fracStr(a,d)} cm. In the afternoon it grew ${fracStr(b,d)} cm more. How much did it grow in total?`,
    answer:ans};
};

GENERATORS["5-N.7"]=()=>{
  const d1=pick([2,3,4,5]),d2=pick([2,3,4,5]);
  const prod=simplify(1,d1*d2);
  const ans=prod.d===1?String(prod.n):`${prod.n}/${prod.d}`;
  return{type:"mc",typeBadge:"Multiply Unit Fractions",
    question:`A model shows ${fracStr(1,d1)} of a shape divided into ${d2} equal parts. What fraction of the whole is one part?`,
    options:mcOpts(ans,`1/${d1+d2}`,`${d1+d2}/${d1*d2}`,`2/${d1*d2}`),answer:ans};
};

GENERATORS["5-N.8"]=()=>{
  const d1=pick([2,3,4,5]),d2=pick([2,3,4,5]),n1=rnd(1,d1),n2=rnd(1,d2);
  const {n,d}=simplify(n1*n2,d1*d2);
  const ans=d===1?String(n):`${n}/${d}`;
  return{type:"mc",typeBadge:"Multiply Fractions (Models)",
    question:`A fraction model shows ${fracStr(n1,d1)} × ${fracStr(n2,d2)}. What is the product?`,
    options:mcOpts(ans,`${n1+n2}/${d1*d2}`,`${n1*n2}/${d1+d2}`,`${n1}/${d2}`),answer:ans};
};

GENERATORS["5-N.9"]=()=>{
  const d1=pick([2,3,4]),d2=pick([2,3,4]);
  const n1=rnd(d1+1,d1*2),n2=rnd(d2+1,d2*2);
  const {n,d}=simplify(n1*n2,d1*d2);
  const w=Math.floor(n/d),r=n%d;
  const ans=d===1?String(n):w>0?`${w} ${r}/${d}`:`${n}/${d}`;
  return{type:"mc",typeBadge:"Multiply Fractions > 1",
    question:`Which is the product of ${fracStr(n1,d1)} × ${fracStr(n2,d2)}?`,
    options:mcOpts(ans,`${n1+n2}/${d1*d2}`,`${n1*d2}/${d1*n2}`,`${(n1+n2)}/${d1+d2}`),answer:ans};
};

GENERATORS["5-O.5"]=()=>{
  const d=pick([2,3,4,5,8,10]),n=rnd(1,d-1);
  const total=rnd(d,d*10);
  const ans=(n*total)/d;
  return{type:"input",typeBadge:"Fraction of a Number",
    question:`What is ${fracStr(n,d)} of <strong>${total}</strong>?`,answer:String(ans)};
};

GENERATORS["5-O.6"]=()=>{
  const d=pick([2,3,4,5,8,10]),n=rnd(1,d-1);
  const total=rnd(2,10)*d;
  const ans=(n*total)/d;
  const items=["students","books","apples","marbles","stickers"];
  const item=pick(items);
  return{type:"word",typeBadge:"Fraction Word Problem",
    question:`There are <strong>${total} ${item}</strong>. ${fracStr(n,d)} of them are red. How many ${item} are red?`,
    answer:String(ans)};
};

GENERATORS["5-O.7"]=()=>{
  const d=pick([3,4,5,6,8]),n=rnd(2,d-1);
  const total=rnd(2,8)*d;
  const ans=(n*total)/d;
  return{type:"input",typeBadge:"Fraction of a Number",
    question:`Find ${fracStr(n,d)} of <strong>${total}</strong>.`,answer:String(ans)};
};

GENERATORS["5-P.1"]=()=>{
  const d1=pick([2,3,4,5,6]),d2=pick([2,3,4,5,6]),n1=rnd(1,d1),n2=rnd(1,d2);
  const {n,d}=simplify(n1*n2,d1*d2);
  const ans=d===1?String(n):`${n}/${d}`;
  return{type:"input",typeBadge:"Multiply Fractions",
    question:`Multiply: <strong>${fracStr(n1,d1)} × ${fracStr(n2,d2)}</strong>`,
    answer:ans,hint:"Multiply numerators × numerators, denominators × denominators, then simplify."};
};

GENERATORS["5-P.2"]=()=>{
  const d1=pick([2,3,4]),d2=pick([2,3,4]),n1=rnd(1,d1),n2=rnd(1,d2);
  const {n,d}=simplify(n1*n2,d1*d2);
  const ans=d===1?String(n):`${n}/${d}`;
  return{type:"word",typeBadge:"Fraction Multiplication Word Problem",
    question:`A garden is ${fracStr(n1,d1)} of an acre. You plant flowers in ${fracStr(n2,d2)} of the garden. What fraction of an acre has flowers?`,
    answer:ans};
};

GENERATORS["5-P.3"]=()=>{
  const whole=rnd(2,8),d1=pick([2,3,4]),d2=pick([2,3,4]),n1=rnd(1,d1),n2=rnd(1,d2);
  const {n,d}=simplify(whole*n1*n2,d1*d2);
  const w=Math.floor(n/d),r=n%d;
  const ans=d===1?String(n):w>0?`${w} ${r}/${d}`:`${n}/${d}`;
  return{type:"input",typeBadge:"Multiply Three Numbers",
    question:`Multiply: <strong>${whole} × ${fracStr(n1,d1)} × ${fracStr(n2,d2)}</strong>`,answer:ans};
};

GENERATORS["5-P.4"]=()=>{
  const d1=pick([2,3,4,5]),d2=pick([2,3,4,5]),n1=rnd(1,d1);
  const {n:rn,d:rd}=simplify(n1,d1*d2);
  const ans=`${n1}/${d2}`;
  return{type:"input",typeBadge:"Complete the Equation",
    question:`Complete: <strong>${fracStr(n1,d1)} × ___ = ${fracStr(rn,rd)}</strong>`,
    answer:ans,hint:"What fraction times the first gives the product?"};
};

GENERATORS["5-Q.3"]=()=>{
  const w=rnd(1,4),nf=rnd(1,3),df=pick([2,3,4]);
  const whole2=rnd(2,5);
  const total=simplify((w*df+nf)*whole2,df);
  const wt=Math.floor(total.n/total.d),rt=total.n%total.d;
  const ans=total.d===1?String(total.n):wt>0?`${wt} ${rt}/${total.d}`:`${total.n}/${total.d}`;
  return{type:"mc",typeBadge:"Mixed Numbers (Area Model)",
    question:`An area model shows ${w} ${fracStr(nf,df)} × ${whole2}. What is the product?`,
    options:mcOpts(ans,`${w*whole2}`,`${w*whole2+1}`,`${w+whole2} ${fracStr(nf,df)}`),answer:ans};
};

GENERATORS["5-R.2"]=()=>{
  const w=rnd(1,5),n=rnd(1,3),d=pick([2,3,4,5]),b=rnd(2,6);
  const totalN=(w*d+n)*b;
  const {n:an,d:ad}=simplify(totalN,d);
  const wt=Math.floor(an/ad),rt=an%ad;
  const ans=ad===1?String(an):wt>0?`${wt} ${rt}/${ad}`:`${an}/${ad}`;
  return{type:"input",typeBadge:"Mixed Number × Whole",
    question:`Multiply: <strong>${w} ${fracStr(n,d)} × ${b}</strong>`,answer:ans.trim(),
    hint:`Convert to improper fraction first: ${w*d+n}/${d}`};
};

GENERATORS["5-R.3"]=()=>{
  const w=rnd(1,4),n=rnd(1,3),d=pick([2,3,4]),n2=rnd(1,4),d2=pick([2,3,4,5]);
  const topN=(w*d+n)*n2,topD=d*d2;
  const {n:an,d:ad}=simplify(topN,topD);
  const wt=Math.floor(an/ad),rt=an%ad;
  const ans=ad===1?String(an):wt>0?`${wt} ${rt}/${ad}`:`${an}/${ad}`;
  return{type:"input",typeBadge:"Mixed Number × Fraction",
    question:`Multiply: <strong>${w} ${fracStr(n,d)} × ${fracStr(n2,d2)}</strong>`,answer:ans.trim()};
};

GENERATORS["5-R.4"]=()=>{
  const w1=rnd(1,3),n1=rnd(1,2),d1=pick([2,3,4]);
  const w2=rnd(1,3),n2=rnd(1,2),d2=pick([2,3,4]);
  const topN=(w1*d1+n1)*(w2*d2+n2),topD=d1*d2;
  const {n,d}=simplify(topN,topD);
  const wt=Math.floor(n/d),r=n%d;
  const ans=d===1?String(n):wt>0?`${wt} ${r}/${d}`:`${n}/${d}`;
  return{type:"input",typeBadge:"Mixed Number × Mixed Number",
    question:`Multiply: <strong>${w1} ${fracStr(n1,d1)} × ${w2} ${fracStr(n2,d2)}</strong>`,answer:ans.trim()};
};

GENERATORS["5-R.7"]=()=>{
  const w=rnd(1,4),n=rnd(1,3),d=pick([2,3,4]),times=rnd(2,5);
  const topN=(w*d+n)*times;
  const {n:an,d:ad}=simplify(topN,d);
  const wt=Math.floor(an/ad),rt=an%ad;
  const ans=ad===1?String(an):wt>0?`${wt} ${rt}/${ad}`:`${an}/${ad}`;
  return{type:"word",typeBadge:"Mixed Number Word Problem",
    question:`One batch of cookies needs ${w} ${fracStr(n,d)} cups of sugar. How many cups are needed for ${times} batches?`,
    answer:ans.trim()};
};

GENERATORS["5-R.8"]=()=>{
  const d=pick([2,3,4]),n=rnd(1,d-1),scale=rnd(2,4);
  const scaled=simplify(n*scale,d);
  const ws=Math.floor(scaled.n/scaled.d),rs=scaled.n%scaled.d;
  const ans=scaled.d===1?String(scaled.n):ws>0?`${ws} ${rs}/${scaled.d}`:`${scaled.n}/${scaled.d}`;
  return{type:"word",typeBadge:"Recipe Fractions",
    question:`A recipe calls for ${fracStr(n,d)} cup of butter. How much butter do you need to make ${scale} batches?`,
    answer:ans.trim()};
};

GENERATORS["5-R.9"]=()=>{
  const d=pick([3,4]),n=rnd(1,d-1);
  const boxes=rnd(3,8),each=rnd(2,6);
  const total=simplify(n*boxes*each,d);
  const wt=Math.floor(total.n/total.d),rt=total.n%total.d;
  const ans=total.d===1?String(total.n):wt>0?`${wt} ${rt}/${total.d}`:`${total.n}/${total.d}`;
  return{type:"word",typeBadge:"Multi-Step Fractions",
    question:`Each box holds ${fracStr(n,d)} kg. There are ${boxes} boxes in a crate and ${each} crates. What is the total weight in kg?`,
    answer:ans.trim()};
};

GENERATORS["5-S.1"]=()=>{
  const whole=rnd(6,20),d=pick([2,3,4,5]);
  const n=rnd(1,d-1);
  const result=dec(whole*n/d,2);
  const isLess=n<d;
  return{type:"mc",typeBadge:"Scaling",
    question:`Is <strong>${whole} × ${fracStr(n,d)}</strong> greater than, less than, or equal to <strong>${whole}</strong>?`,
    options:["Less than "+whole,"Greater than "+whole,"Equal to "+whole,"Cannot tell"],
    answer:isLess?"Less than "+whole:n===d?"Equal to "+whole:"Greater than "+whole};
};

GENERATORS["5-S.2"]=()=>{
  const whole=rnd(8,24),d=pick([2,3,4]),n=rnd(1,d+1);
  return{type:"mc",typeBadge:"Scaling Whole Numbers",
    question:`<strong>${whole} × ${fracStr(n,d)}</strong> will be ___ ${whole}.`,
    options:shuffle(["less than","greater than","equal to","double"]),
    answer:n<d?"less than":n===d?"equal to":"greater than"};
};

GENERATORS["5-S.3"]=()=>{
  const d1=pick([2,3,4]),n1=rnd(1,d1-1),d2=pick([2,3,4]),n2=rnd(1,d2);
  const result=n1*n2/(d1*d2);
  return{type:"mc",typeBadge:"Scaling Fractions",
    question:`${fracStr(n1,d1)} × ${fracStr(n2,d2)} will be ___ ${fracStr(n1,d1)}.`,
    options:shuffle(["less than","greater than","equal to","double"]),
    answer:n2<d2?"less than":n2===d2?"equal to":"greater than"};
};

GENERATORS["5-S.4"]=()=>{
  const w=rnd(2,5),n=rnd(1,3),d=pick([2,3,4]),d2=pick([2,3]),n2=rnd(1,d2-1);
  return{type:"mc",typeBadge:"Scaling Mixed Numbers",
    question:`${w} ${fracStr(n,d)} × ${fracStr(n2,d2)} will be ___ ${w} ${fracStr(n,d)}.`,
    options:shuffle(["less than","greater than","equal to","double"]),
    answer:"less than"};
};

GENERATORS["5-T.2"]=()=>{
  const items=rnd(2,8),people=pick([2,3,4,5,6]);
  const {n,d}=simplify(items,people);
  const ans=d===1?String(n):`${n}/${d}`;
  return{type:"word",typeBadge:"Fractions as Division",
    question:`<strong>${items} sandwiches</strong> are shared equally among <strong>${people} people</strong>. What fraction of a sandwich does each person get?`,
    answer:ans};
};

GENERATORS["5-T.5"]=()=>{
  const whole=rnd(2,8),denom=pick([2,3,4,5]);
  return{type:"mc",typeBadge:"Divide by Unit Fraction",
    question:`A model shows ${whole} divided into groups of ${fracStr(1,denom)}. How many groups are there?`,
    options:mcOpts(whole*denom,...wrongNear(whole*denom,3,8)),answer:String(whole*denom)};
};

GENERATORS["5-T.7"]=()=>{
  const denom=pick([2,3,4,5]),whole=rnd(2,6);
  const qs=[
    {q:`An area model shows ${fracStr(1,denom)} divided into ${whole} equal parts. What is each part?`,a:`1/${denom*whole}`},
    {q:`An area model shows ${whole} wholes divided into groups of ${fracStr(1,denom)}. How many groups?`,a:String(whole*denom)},
  ];
  const item=pick(qs);
  const opts=item.a.includes("/")?[item.a,`1/${denom}`,`${whole}/${denom}`,`1/${whole}`]:[item.a,...wrongNear(parseInt(item.a),3,5).map(String)];
  return{type:"mc",typeBadge:"Divide Fractions (Area Model)",question:item.q,options:shuffle(opts),answer:item.a};
};

GENERATORS["5-T.8"]=()=>{
  const denom=pick([2,3,4,5]),whole=rnd(2,6);
  return{type:"mc",typeBadge:"Divide Fractions (Number Line)",
    question:`A number line from 0 to ${whole} is divided into segments of ${fracStr(1,denom)}. How many segments are there?`,
    options:mcOpts(whole*denom,...wrongNear(whole*denom,3,6)),answer:String(whole*denom)};
};

GENERATORS["5-U.1"]=()=>{
  const d=pick([2,3,4,5,6,8]),whole=rnd(2,8);
  const {n,dn}=simplify(1,d*whole);
  return{type:"input",typeBadge:"Unit Fraction ÷ Whole",
    question:`Divide: <strong>${fracStr(1,d)} ÷ ${whole}</strong>`,
    answer:`1/${d*whole}`,hint:"Multiply the denominator by the whole number."};
};

GENERATORS["5-U.2"]=()=>{
  const d=pick([2,3,4,5,6]),whole=rnd(2,12);
  return{type:"input",typeBadge:"Whole ÷ Unit Fraction",
    question:`Divide: <strong>${whole} ÷ ${fracStr(1,d)}</strong>`,
    answer:String(whole*d),hint:`How many ${fracStr(1,d)}s fit into ${whole}?`};
};

GENERATORS["5-U.4"]=()=>{
  const d=pick([2,3,4,5]),whole=rnd(2,8);
  const ops=[
    {q:`You have ${whole} metres of rope. Each piece must be ${fracStr(1,d)} m long. How many pieces can you cut?`,a:String(whole*d)},
    {q:`${fracStr(1,d)} of a pizza is split equally among ${whole} friends. What fraction does each person get?`,a:`1/${d*whole}`},
  ];
  const o=pick(ops);
  return{type:"word",typeBadge:"Fraction Division Word Problem",question:o.q,answer:o.a};
};

GENERATORS["5-V.3"]=()=>{
  const d=pick([2,3,4]),n=rnd(1,d-1),boxes=rnd(2,6),extra=rnd(1,5);
  const total=n*boxes/d+extra;
  return{type:"word",typeBadge:"Multi-Step Fractions",
    question:`A box holds ${fracStr(n,d)} kg of apples. There are ${boxes} full boxes plus ${extra} kg loose. What is the total weight?`,
    answer:String(dec(total,2))};
};

GENERATORS["5-TT.2"]=()=>{
  const d1=pick([2,3,4,5]),n1=rnd(1,d1+2);
  const d2=pick([2,3,4,5]),n2=rnd(1,d2+2);
  const {n,d}=simplify(n1*n2,d1*d2);
  const w=Math.floor(n/d),r=n%d;
  const ans=d===1?String(n):w>0?`${w} ${r}/${d}`:`${n}/${d}`;
  return{type:"input",typeBadge:"Area with Fractions",
    question:`A rectangle is ${fracStr(n1,d1)} m wide and ${fracStr(n2,d2)} m long. What is its area in m²?`,answer:ans.trim()};
};

// ════════════════════════════════════════════════════
// GRADE 5 — ALGEBRAIC THINKING
// ════════════════════════════════════════════════════

GENERATORS["5-H.1"]=()=>{
  const ops=[
    {desc:"the product of 7 and 9",expr:"7 × 9",ans:63},
    {desc:"the sum of 14 and 28",expr:"14 + 28",ans:42},
    {desc:"15 less than 40",expr:"40 − 15",ans:25},
    {desc:"48 divided by 6",expr:"48 ÷ 6",ans:8},
  ];
  const o=pick(ops);
  return{type:"input",typeBadge:"Write Expression",
    question:`Write a numerical expression for: "<strong>${o.desc}</strong>", then evaluate it.`,
    answer:String(o.ans),hint:`Expression: ${o.expr}`};
};

GENERATORS["5-H.2"]=()=>{
  const ops=[
    {desc:"multiply 5 and 6, then add 3",expr:"5 × 6 + 3",ans:33},
    {desc:"subtract 4 from 20, then divide by 4",expr:"(20 − 4) ÷ 4",ans:4},
    {desc:"add 7 and 3, then multiply by 5",expr:"(7 + 3) × 5",ans:50},
  ];
  const o=pick(ops);
  return{type:"input",typeBadge:"Write Two-Operation Expression",
    question:`Write and evaluate: "<strong>${o.desc}</strong>"`,
    answer:String(o.ans),hint:`Expression: ${o.expr}`};
};

GENERATORS["5-H.3"]=()=>{
  const templates=[
    ()=>{const a=rnd(2,9),b=rnd(2,9),c=rnd(1,6);return{q:`<strong>${a} × ${b} + ${c}</strong>`,a:a*b+c};},
    ()=>{const a=rnd(2,9),b=rnd(2,9),c=rnd(1,20);return{q:`<strong>${c} + ${a} × ${b}</strong>`,a:c+a*b};},
    ()=>{const a=rnd(20,60),b=rnd(2,8),c=rnd(1,5);return{q:`<strong>${a} ÷ ${b} − ${c}</strong>`,a:Math.floor(a/b)-c};},
  ];
  const o=pick(templates)();
  return{type:"input",typeBadge:"Evaluate Expression",question:`Evaluate: ${o.q}`,answer:String(o.a),hint:"Remember: multiply/divide before add/subtract."};
};

GENERATORS["5-H.4"]=()=>{
  const a=rnd(2,8),b=rnd(2,8),c=rnd(2,6);
  const expr=`(${a} + ${b}) × ${c}`;
  return{type:"input",typeBadge:"Parentheses",question:`Evaluate: <strong>${expr}</strong>`,answer:String((a+b)*c),hint:"Solve inside parentheses first."};
};

GENERATORS["5-H.5"]=()=>{
  const a=rnd(2,5),b=rnd(2,5),c=rnd(2,5),d=rnd(1,4);
  const expr=`[(${a} + ${b}) × ${c}] − ${d}`;
  return{type:"input",typeBadge:"Brackets & Parentheses",
    question:`Evaluate: <strong>${expr}</strong>`,
    answer:String((a+b)*c-d),hint:"Innermost grouping first: parentheses, then brackets."};
};

GENERATORS["5-H.6"]=()=>{
  const a=rnd(2,9),b=rnd(2,9),c=rnd(2,6);
  const correct=(a+b)*c;const wrong=a+b*c;
  return{type:"mc",typeBadge:"Order of Operations Error",
    question:`A student evaluated <strong>(${a} + ${b}) × ${c}</strong> and got <strong>${wrong}</strong>. What was their mistake?`,
    options:shuffle(["Did not compute parentheses first","Added instead of multiplied","Used wrong numbers","No mistake — answer is correct"]),
    answer:"Did not compute parentheses first"};
};

GENERATORS["5-H.7"]=()=>{
  const a=rnd(2,7),b=rnd(2,7),c=rnd(2,6);
  const v1=(a+b)*c;const v2=a+(b*c);
  const greater=v1>v2?`(${a}+${b})×${c}`:`${a}+(${b}×${c})`;
  return{type:"mc",typeBadge:"Parentheses Placement",
    question:`Which expression has a <strong>greater</strong> value: <strong>(${a}+${b})×${c}</strong> or <strong>${a}+(${b}×${c})</strong>?`,
    options:shuffle([`(${a}+${b})×${c}`,`${a}+(${b}×${c})`,"They are equal","Cannot tell"]),
    answer:greater};
};

// THE KEY FIX: 5-H.9 must show find-the-missing-sign, NOT arithmetic
GENERATORS["5-H.9"]=()=>{
  const variants=[
    ()=>{const a=rnd(2,9),b=rnd(2,9);return{q:`<strong>${a} ___ ${b} = ${a*b}</strong>`,a:"×"};},
    ()=>{const a=rnd(2,9),b=rnd(1,a-1);return{q:`<strong>${a} ___ ${b} = ${a-b}</strong>`,a:"−"};},
    ()=>{const b=rnd(2,9),q=rnd(2,9);return{q:`<strong>${b*q} ___ ${b} = ${q}</strong>`,a:"÷"};},
    ()=>{const a=rnd(2,20),b=rnd(1,15);return{q:`<strong>${a} ___ ${b} = ${a+b}</strong>`,a:"+"};},
    ()=>{const a=rnd(2,9),b=rnd(2,9),c=rnd(1,10);return{q:`<strong>${a} × ${b} ___ ${c} = ${a*b+c}</strong>`,a:"+"};},
    ()=>{const a=rnd(2,9),b=rnd(2,9),c=rnd(1,a*b-1);return{q:`<strong>${a} × ${b} ___ ${c} = ${a*b-c}</strong>`,a:"−"};},
  ];
  const v=pick(variants)();
  return{type:"mc",typeBadge:"Missing Sign",
    question:`What sign goes in the blank? ${v.q}`,
    options:shuffle(["+","−","×","÷"]),answer:v.a};
};

GENERATORS["5-H.10"]=()=>{
  const a=rnd(2,9),b=rnd(2,6),c=rnd(1,5);
  const lhs=(a+b)*c;const rhs=a+b*c;
  const sym=lhs>rhs?">":lhs<rhs?"<":"=";
  return{type:"mc",typeBadge:"Compare Expressions",
    question:`Use &gt;, &lt;, or = to compare:<br><strong>(${a}+${b})×${c}</strong> ___ <strong>${a}+${b}×${c}</strong>`,
    options:[">","<","=","≈"],answer:sym};
};

GENERATORS["5-GG.4"]=()=>{
  const templates=[
    ()=>{const a=rnd(2,9),b=rnd(2,9),c=rnd(1,10);const lhs=a*b+c;const claim=rnd(0,1)?lhs:lhs+rnd(1,5);return{q:`Is <strong>${a} × ${b} + ${c} = ${claim}</strong> true or false?`,a:claim===lhs?"True":"False"};},
    ()=>{const a=rnd(2,8),b=rnd(2,6);const correct=(a+b)*2;const claim=rnd(0,1)?correct:a+b*2;return{q:`Is <strong>(${a}+${b})×2 = ${claim}</strong> true or false?`,a:claim===correct?"True":"False"};},
  ];
  const o=pick(templates)();
  return{type:"mc",typeBadge:"True or False Equation",question:o.q,options:["True","False"],answer:o.a};
};

GENERATORS["5-KK.1"]=()=>{
  const rules=[
    {fn:(x,r)=>x+r,r:rnd(3,15),label:"add"},
    {fn:(x,r)=>x-r,r:rnd(2,10),label:"subtract"},
  ];
  const rule=pick(rules);
  const start=rnd(5,50);
  const seq=[start];
  for(let i=0;i<5;i++)seq.push(rule.fn(seq[seq.length-1],rule.r));
  const hi=rnd(2,5);
  const display=seq.slice(0,6).map((v,i)=>i===hi?"?":v);
  return{type:"input",typeBadge:"Number Pattern",
    question:`Find the missing number: <strong>${display.join(", ")}</strong>`,
    answer:String(seq[hi]),hint:`Rule: ${rule.label} ${rule.r}`};
};

GENERATORS["5-KK.2"]=()=>{
  const r1=rnd(2,8),r2=r1+rnd(1,5);
  const start=rnd(2,10);
  const s1=[start],s2=[start];
  for(let i=0;i<4;i++){s1.push(s1[s1.length-1]+r1);s2.push(s2[s2.length-1]+r2);}
  return{type:"mc",typeBadge:"Compare Patterns",
    question:`Pattern A: <strong>${s1.join(", ")}</strong><br>Pattern B: <strong>${s2.join(", ")}</strong><br>How do these patterns relate?`,
    options:shuffle(["Pattern B grows faster","Pattern A grows faster","They grow at the same rate","Pattern B decreases"]),
    answer:"Pattern B grows faster"};
};

GENERATORS["5-KK.3"]=()=>{
  const r=rnd(4,20);const start=rnd(2,30);
  const seq=[start];
  for(let i=0;i<5;i++)seq.push(seq[seq.length-1]+r);
  const hi=rnd(1,5);
  const display=seq.map((v,i)=>i===hi?"?":v);
  return{type:"input",typeBadge:"Increasing Pattern",
    question:`Complete the pattern: <strong>${display.join(", ")}</strong>`,
    answer:String(seq[hi])};
};

GENERATORS["5-KK.4"]=()=>{
  const r=pick([2,3,4,5,10]);const start=rnd(1,5);
  const seq=[start];
  for(let i=0;i<5;i++)seq.push(seq[seq.length-1]*r);
  const hi=rnd(2,5);
  const display=seq.map((v,i)=>i===hi?"?":v);
  return{type:"input",typeBadge:"Multiplication Pattern",
    question:`Multiplication pattern — find the missing number: <strong>${display.join(", ")}</strong>`,
    answer:String(seq[hi]),hint:`Rule: multiply by ${r}`};
};

GENERATORS["5-KK.5"]=()=>{
  const r=rnd(3,12),start=rnd(5,20);
  const seq=[start];for(let i=0;i<4;i++)seq.push(seq[seq.length-1]+r);
  return{type:"word",typeBadge:"Pattern Word Problem",
    question:`A plant is <strong>${start} cm</strong> tall. It grows <strong>${r} cm</strong> each week. How tall will it be after <strong>4 weeks</strong>?`,
    answer:String(seq[4])};
};

GENERATORS["5-KK.6"]=()=>{
  const r=pick([2,3,5,10]);const start=rnd(1,6);
  const seq=[start];for(let i=0;i<4;i++)seq.push(seq[seq.length-1]*r);
  return{type:"mc",typeBadge:"Pattern Review",
    question:`What is the rule for: <strong>${seq.join(", ")}</strong>?`,
    options:mcOpts(`Multiply by ${r}`,`Add ${r}`,`Multiply by ${r+1}`,`Add ${r*start}`),
    answer:`Multiply by ${r}`};
};

// ════════════════════════════════════════════════════
// GRADE 5 — GEOMETRY
// ════════════════════════════════════════════════════

GENERATORS["5-LL.1"]=()=>{
  const qs=[
    {q:"What is the horizontal number line on a coordinate plane called?",a:"x-axis",opts:["x-axis","y-axis","origin","quadrant"]},
    {q:"What is the vertical number line on a coordinate plane called?",a:"y-axis",opts:["x-axis","y-axis","origin","quadrant"]},
    {q:"What is the point (0, 0) on a coordinate plane called?",a:"origin",opts:["origin","vertex","midpoint","center"]},
    {q:"In the ordered pair (3, 7), which number is the x-coordinate?",a:"3",opts:["3","7","0","10"]},
    {q:"In the ordered pair (5, 2), which number is the y-coordinate?",a:"2",opts:["2","5","0","7"]},
    {q:"On a coordinate plane, you always go ___ first, then ___ second.",a:"right, up",opts:["right, up","up, right","left, down","down, left"]},
  ];
  const item=pick(qs);
  return{type:"mc",typeBadge:"Coordinate Plane",question:item.q,options:shuffle(item.opts),answer:item.a};
};

GENERATORS["5-LL.2"]=()=>{
  const x=rnd(1,8),y=rnd(1,8);
  const wrong1=[rnd(1,8),rnd(1,8)];const wrong2=[y,x];
  return{type:"mc",typeBadge:"Points on Coordinate Plane",
    question:`Point A is located at <strong>(${x}, ${y})</strong> on a coordinate plane. Which description is correct?`,
    options:shuffle([`${x} units right, ${y} units up`,`${y} units right, ${x} units up`,`${x} units up, ${y} units right`,`(${y},${x})`]),
    answer:`${x} units right, ${y} units up`};
};

GENERATORS["5-LL.3"]=()=>{
  const x=rnd(1,9),y=rnd(1,9);
  return{type:"mc",typeBadge:"Graph Points",
    question:`Which ordered pair describes a point that is <strong>${x} units right</strong> and <strong>${y} units up</strong> from the origin?`,
    options:shuffle([`(${x},${y})`,`(${y},${x})`,`(${x},0)`,`(0,${y})`]),
    answer:`(${x},${y})`};
};

GENERATORS["5-LL.5"]=()=>{
  const x1=rnd(1,5),x2=rnd(6,10);
  const y1=rnd(1,5),y2=rnd(6,10);
  return{type:"mc",typeBadge:"Graph from Table",
    question:`A table shows two points: x=<strong>${x1}</strong>, y=<strong>${y1}</strong> and x=<strong>${x2}</strong>, y=<strong>${y2}</strong>. Which ordered pairs are correct?`,
    options:shuffle([`(${x1},${y1}) and (${x2},${y2})`,`(${y1},${x1}) and (${y2},${x2})`,`(${x1},${x2}) and (${y1},${y2})`,`(${x2},${y1}) and (${x1},${y2})`]),
    answer:`(${x1},${y1}) and (${x2},${y2})`};
};

GENERATORS["5-LL.8"]=()=>{
  const x1=rnd(1,5),x2=x1,y1=rnd(1,4),y2=rnd(y1+1,8);
  return{type:"mc",typeBadge:"Coordinate Map",
    question:`On a map, the library is at <strong>(${x1},${y1})</strong> and the school is at <strong>(${x2},${y2})</strong>. How many units apart are they?`,
    options:mcOpts(y2-y1,...wrongNear(y2-y1,3,4)),answer:String(y2-y1)};
};

GENERATORS["5-LL.9"]=()=>{
  const x=rnd(1,7),y=rnd(1,7);
  const dirs=[
    {d:"right 3",np:[x+3,y]},{d:"up 4",np:[x,y+4]},{d:"right 2, then up 3",np:[x+2,y+3]},
  ];
  const d=pick(dirs);
  return{type:"mc",typeBadge:"Follow Directions",
    question:`Start at <strong>(${x},${y})</strong>. Move <strong>${d.d}</strong>. Where do you end up?`,
    options:shuffle([`(${d.np[0]},${d.np[1]})`,`(${d.np[0]+1},${d.np[1]})`,`(${d.np[0]},${d.np[1]-1})`,`(${x},${y})`]),
    answer:`(${d.np[0]},${d.np[1]})`};
};

GENERATORS["5-PP.3"]=()=>{
  const tris=[
    {name:"Equilateral",clue:"all 3 sides are equal length"},
    {name:"Isosceles",clue:"exactly 2 sides are equal"},
    {name:"Scalene",clue:"all 3 sides have different lengths"},
    {name:"Right",clue:"one angle is exactly 90°"},
    {name:"Obtuse",clue:"one angle is greater than 90°"},
    {name:"Acute",clue:"all angles are less than 90°"},
  ];
  const t=pick(tris);
  const names=shuffle(tris.map(x=>x.name)).slice(0,4);
  if(!names.includes(t.name))names[3]=t.name;
  return{type:"mc",typeBadge:"Classify Triangles",
    question:`A triangle has <strong>${t.clue}</strong>. What type of triangle is it?`,
    options:shuffle(names),answer:t.name};
};

GENERATORS["5-QQ.1"]=()=>{
  const qs=[
    {q:"How many pairs of parallel sides does a rectangle have?",a:"2",opts:["2","0","1","4"]},
    {q:"How many pairs of parallel sides does a trapezoid have?",a:"1",opts:["1","0","2","3"]},
    {q:"Which shape has NO parallel sides?",a:"General triangle",opts:["General triangle","Parallelogram","Rectangle","Rhombus"]},
  ];
  const item=pick(qs);
  return{type:"mc",typeBadge:"Parallel Sides",question:item.q,options:shuffle(item.opts),answer:item.a};
};

GENERATORS["5-QQ.2"]=()=>{
  return{type:"mc",typeBadge:"Parallelograms",
    question:"Which shape is always a parallelogram?",
    options:shuffle(["Rectangle","Trapezoid","General quadrilateral","Right triangle"]),
    answer:"Rectangle"};
};

GENERATORS["5-QQ.3"]=()=>{
  const qs=[
    {q:"A quadrilateral has exactly ONE pair of parallel sides. What is it?",a:"Trapezoid"},
    {q:"Which shape has exactly one pair of parallel sides?",a:"Trapezoid"},
    {q:"A trapezoid has ___ pair(s) of parallel sides.",a:"1"},
  ];
  const item=pick(qs);
  const opts=["Trapezoid","Parallelogram","Rhombus","Rectangle"].includes(item.a)?["Trapezoid","Parallelogram","Rhombus","Rectangle"]:["1","2","0","4"];
  return{type:"mc",typeBadge:"Trapezoids",question:item.q,options:shuffle(opts),answer:item.a};
};

GENERATORS["5-QQ.4"]=()=>{
  return{type:"mc",typeBadge:"Rectangles",
    question:"Which statement about rectangles is ALWAYS true?",
    options:shuffle(["All angles are 90°","All sides are equal","It has only one pair of parallel sides","It is always a square"]),
    answer:"All angles are 90°"};
};

GENERATORS["5-QQ.5"]=()=>{
  return{type:"mc",typeBadge:"Rhombuses",
    question:"Which statement is true about a rhombus?",
    options:shuffle(["All 4 sides are equal length","All 4 angles are right angles","It is always a rectangle","It has no parallel sides"]),
    answer:"All 4 sides are equal length"};
};

GENERATORS["5-QQ.6"]=()=>{
  const quads=[
    {name:"Square",clue:"4 equal sides AND 4 right angles"},
    {name:"Rectangle",clue:"4 right angles but sides not all equal"},
    {name:"Rhombus",clue:"4 equal sides but angles are not 90°"},
    {name:"Parallelogram",clue:"2 pairs of parallel sides, no right angles"},
    {name:"Trapezoid",clue:"exactly 1 pair of parallel sides"},
  ];
  const q=pick(quads);
  // Always build 4 options that include the answer
  const others=shuffle(quads.filter(x=>x.name!==q.name)).slice(0,3).map(x=>x.name);
  return{type:"mc",typeBadge:"Classify Quadrilaterals",
    question:`Which quadrilateral has <strong>${q.clue}</strong>?`,
    options:shuffle([q.name,...others]),
    answer:q.name};
};

GENERATORS["5-QQ.9"]=()=>{
  const qs=[
    {q:"Is every square also a rectangle?",a:"Yes",opts:["Yes","No","Sometimes","Only if sides are equal"]},
    {q:"Is every rectangle also a parallelogram?",a:"Yes",opts:["Yes","No","Sometimes","Never"]},
    {q:"Is every rhombus also a square?",a:"No",opts:["No","Yes","Always","Sometimes"]},
    {q:"Is every parallelogram also a rectangle?",a:"No",opts:["No","Yes","Always","Sometimes"]},
  ];
  const item=pick(qs);
  return{type:"mc",typeBadge:"Quadrilateral Relationships",question:item.q,options:shuffle(item.opts),answer:item.a};
};

GENERATORS["5-RR.1"]=()=>{
  const qs=[
    {q:"Is a circle a polygon?",a:"No — a polygon must have straight sides"},
    {q:"Is a triangle a polygon?",a:"Yes — it has 3 straight sides"},
    {q:"Is a shape with curved sides a polygon?",a:"No — polygons have only straight sides"},
    {q:"Is a pentagon a polygon?",a:"Yes — it has 5 straight sides"},
  ];
  const item=pick(qs);
  return{type:"mc",typeBadge:"Polygons",question:item.q,
    options:shuffle([item.a,...["Yes — it has straight sides","No — it has curved sides","Only if it has 4 sides"].filter(x=>x!==item.a).slice(0,3)]),
    answer:item.a};
};

GENERATORS["5-RR.2"]=()=>{
  const shapes=[{n:"triangle",s:3},{n:"quadrilateral",s:4},{n:"pentagon",s:5},{n:"hexagon",s:6},{n:"octagon",s:8}];
  const shape=pick(shapes);
  return{type:"input",typeBadge:"Polygon Sides",
    question:`How many sides does a <strong>${shape.n}</strong> have?`,
    answer:String(shape.s)};
};

GENERATORS["5-RR.3"]=()=>{
  return{type:"mc",typeBadge:"Regular vs Irregular",
    question:"A polygon where ALL sides are equal AND all angles are equal is called a ___.",
    options:shuffle(["regular polygon","irregular polygon","quadrilateral","parallelogram"]),
    answer:"regular polygon"};
};

// ════════════════════════════════════════════════════
// GRADE 5 — MEASUREMENT & DATA
// ════════════════════════════════════════════════════

GENERATORS["5-II.1"]=()=>{
  const convs=[{f:"feet",t:"inches",r:12},{f:"yards",t:"feet",r:3},{f:"miles",t:"feet",r:5280}];
  const c=pick(convs);const n=rnd(1,c.r===5280?3:15);const fwd=Math.random()<.5;
  const [val,ans,u1,u2]=fwd?[n,n*c.r,c.f,c.t]:[n*c.r,n,c.t,c.f];
  return{type:"input",typeBadge:"Customary Length",question:`Convert: <strong>${val} ${u1}</strong> = ___ ${u2}`,answer:String(ans),hint:`1 ${c.f} = ${c.r} ${c.t}`};
};

GENERATORS["5-II.2"]=()=>{
  const convs=[{f:"pounds",t:"ounces",r:16},{f:"tons",t:"pounds",r:2000}];
  const c=pick(convs);const n=rnd(1,10);const fwd=Math.random()<.5;
  const [val,ans,u1,u2]=fwd?[n,n*c.r,c.f,c.t]:[n*c.r,n,c.t,c.f];
  return{type:"input",typeBadge:"Customary Weight",question:`Convert: <strong>${val} ${u1}</strong> = ___ ${u2}`,answer:String(ans)};
};

GENERATORS["5-II.3"]=()=>{
  const convs=[{f:"gallons",t:"quarts",r:4},{f:"quarts",t:"pints",r:2},{f:"pints",t:"cups",r:2}];
  const c=pick(convs);const n=rnd(1,12);const fwd=Math.random()<.5;
  const [val,ans,u1,u2]=fwd?[n,n*c.r,c.f,c.t]:[n*c.r,n,c.t,c.f];
  return{type:"input",typeBadge:"Customary Volume",question:`Convert: <strong>${val} ${u1}</strong> = ___ ${u2}`,answer:String(ans)};
};

GENERATORS["5-II.4"]=()=>{
  const all=[{f:"feet",t:"inches",r:12},{f:"yards",t:"feet",r:3},{f:"pounds",t:"ounces",r:16},{f:"gallons",t:"quarts",r:4}];
  const c=pick(all);const n=rnd(2,10);
  return{type:"input",typeBadge:"Customary Units",question:`<strong>${n} ${c.f}</strong> = ___ ${c.t}`,answer:String(n*c.r)};
};

GENERATORS["5-II.5"]=()=>{
  const c=pick([{f:"feet",t:"inches",r:12},{f:"yards",t:"feet",r:3}]);
  const n=rnd(3,8);
  return{type:"mc",typeBadge:"Conversion Table",
    question:`Complete the conversion table: <strong>${n} ${c.f}</strong> = ___ ${c.t}`,
    options:mcOpts(n*c.r,...wrongNear(n*c.r,3,c.r)),answer:String(n*c.r)};
};

GENERATORS["5-II.6"]=()=>{
  const c=pick([{f:"feet",t:"inches",r:12},{f:"yards",t:"feet",r:3}]);
  const a=rnd(2,8),b=rnd(2,8);
  return{type:"input",typeBadge:"Compare Customary Units",
    question:`Which is greater: <strong>${a} ${c.f}</strong> or <strong>${b*c.r} ${c.t}</strong>?`,
    answer:a*c.r>b*c.r?`${a} ${c.f}`:`${b*c.r} ${c.t}`};
};

GENERATORS["5-II.7"]=()=>{
  const d=pick([2,3,4]);const whole=rnd(1,5);const n=rnd(1,d-1);
  const inches=whole*12+Math.floor(12*n/d);
  return{type:"input",typeBadge:"Fractions in Conversions",
    question:`Convert ${whole} ${fracStr(n,d)} feet to inches.`,answer:String(inches)};
};

GENERATORS["5-II.8"]=()=>{
  const ft=rnd(3,9),extra=rnd(1,11);
  return{type:"input",typeBadge:"Mixed Customary Units",
    question:`Convert <strong>${ft} feet ${extra} inches</strong> to total inches.`,answer:String(ft*12+extra)};
};

GENERATORS["5-II.9"]=()=>{
  const a1=rnd(1,5),a2=rnd(1,11),b1=rnd(1,4),b2=rnd(1,11);
  const ti=(a1*12+a2)+(b1*12+b2);
  const rf=Math.floor(ti/12),ri=ti%12;
  return{type:"input",typeBadge:"Add Mixed Customary",
    question:`Add: <strong>${a1} ft ${a2} in + ${b1} ft ${b2} in</strong>`,answer:`${rf} ft ${ri} in`};
};

GENERATORS["5-II.10"]=()=>{
  const yds=rnd(2,10),feet=rnd(1,2);
  const totalFt=yds*3+feet;
  return{type:"word",typeBadge:"Multi-Step Measurement",
    question:`A fence is ${yds} yards and ${feet} foot${feet>1?"s":""} long. How long is it in feet?`,answer:String(totalFt)};
};

GENERATORS["5-JJ.1"]=()=>{
  const convs=[{f:"km",t:"m",r:1000},{f:"m",t:"cm",r:100},{f:"cm",t:"mm",r:10}];
  const c=pick(convs);const n=rnd(1,15);const fwd=Math.random()<.5;
  const [val,ans,u1,u2]=fwd?[n,n*c.r,c.f,c.t]:[n*c.r,n,c.t,c.f];
  return{type:"input",typeBadge:"Metric Length",question:`Convert: <strong>${val} ${u1}</strong> = ___ ${u2}`,answer:String(ans)};
};

GENERATORS["5-JJ.2"]=()=>{
  const convs=[{f:"kg",t:"g",r:1000},{f:"g",t:"mg",r:1000}];
  const c=pick(convs);const n=rnd(1,10);const fwd=Math.random()<.5;
  const [val,ans,u1,u2]=fwd?[n,n*c.r,c.f,c.t]:[n*c.r,n,c.t,c.f];
  return{type:"input",typeBadge:"Metric Mass",question:`Convert: <strong>${val} ${u1}</strong> = ___ ${u2}`,answer:String(ans)};
};

GENERATORS["5-JJ.3"]=()=>{
  const convs=[{f:"L",t:"mL",r:1000}];
  const c=pick(convs);const n=rnd(1,10);const fwd=Math.random()<.5;
  const [val,ans,u1,u2]=fwd?[n,n*c.r,c.f,c.t]:[n*c.r,n,c.t,c.f];
  return{type:"input",typeBadge:"Metric Volume",question:`Convert: <strong>${val} ${u1}</strong> = ___ ${u2}`,answer:String(ans)};
};

GENERATORS["5-JJ.4"]=()=>{
  const all=[{f:"km",t:"m",r:1000},{f:"kg",t:"g",r:1000},{f:"L",t:"mL",r:1000},{f:"m",t:"cm",r:100}];
  const c=pick(all);const n=rnd(2,15);
  return{type:"input",typeBadge:"Metric Units",question:`<strong>${n} ${c.f}</strong> = ___ ${c.t}`,answer:String(n*c.r)};
};

GENERATORS["5-JJ.5"]=()=>{
  const c=pick([{f:"km",t:"m",r:1000},{f:"kg",t:"g",r:1000}]);
  const n=rnd(3,8);
  return{type:"mc",typeBadge:"Metric Conversion Table",
    question:`<strong>${n} ${c.f}</strong> = ___ ${c.t}`,
    options:mcOpts(n*c.r,...wrongNear(n*c.r,3,200)),answer:String(n*c.r)};
};

GENERATORS["5-JJ.7"]=()=>{
  const a1=rnd(1,5),a2=rnd(100,900),b1=rnd(1,4),b2=rnd(100,900);
  const tms=(a1*1000+a2)+(b1*1000+b2);
  const rk=Math.floor(tms/1000),rg=tms%1000;
  return{type:"input",typeBadge:"Add Metric Units",
    question:`Add: <strong>${a1} kg ${a2} g + ${b1} kg ${b2} g</strong>`,answer:`${rk} kg ${rg} g`};
};

GENERATORS["5-JJ.8"]=()=>{
  const km=rnd(2,8),extra=rnd(100,900);
  const totalM=km*1000+extra;
  return{type:"word",typeBadge:"Multi-Step Metric",
    question:`A trail is ${km} km and ${extra} m long. How long is it in metres?`,answer:String(totalM)};
};

GENERATORS["5-JJ.9"]=()=>{
  const isMetric=Math.random()<.5;
  if(isMetric){
    const n=rnd(2,8),c=pick([{f:"km",t:"m",r:1000},{f:"kg",t:"g",r:1000}]);
    return{type:"input",typeBadge:"Metric Conversions",question:`<strong>${n} ${c.f}</strong> = ___ ${c.t}`,answer:String(n*c.r)};
  }else{
    const n=rnd(2,8),c=pick([{f:"feet",t:"inches",r:12},{f:"yards",t:"feet",r:3}]);
    return{type:"input",typeBadge:"Customary Conversions",question:`<strong>${n} ${c.f}</strong> = ___ ${c.t}`,answer:String(n*c.r)};
  }
};

GENERATORS["5-NN.1"]=()=>{
  const data=[3,3,4,5,5,5,6,7];
  const freq={};data.forEach(v=>{freq[v]=(freq[v]||0)+1;});
  const qs=[
    {q:`In a line plot, the value <strong>5</strong> appears how many times?`,a:String(freq[5]||0)},
    {q:`What is the most common value in: ${data.join(", ")}?`,a:"5"},
    {q:`What is the range of this data: ${data.join(", ")}?`,a:String(Math.max(...data)-Math.min(...data))},
  ];
  const item=pick(qs);
  return{type:"input",typeBadge:"Line Plot",question:item.q,answer:item.a};
};

GENERATORS["5-NN.2"]=()=>{
  const data=[1.2,1.5,1.5,1.8,2.0,2.0,2.1];
  return{type:"mc",typeBadge:"Line Plot Decimals",
    question:`A line plot shows data: <strong>${data.join(", ")}</strong>. How many values are ≥ 1.5?`,
    options:mcOpts(5,...wrongNear(5,3,2)),answer:"5"};
};

GENERATORS["5-NN.3"]=()=>{
  const d=[{n:1,d:4},{n:1,d:2},{n:3,d:4},{n:1,d:4},{n:1,d:2}];
  return{type:"mc",typeBadge:"Line Plot Fractions",
    question:`Five measurements are: ${fracStr(1,4)}, ${fracStr(1,2)}, ${fracStr(3,4)}, ${fracStr(1,4)}, ${fracStr(1,2)}. How many are less than ${fracStr(1,2)}?`,
    options:["2","1","3","0"],answer:"2"};
};

GENERATORS["5-NN.4"]=()=>{
  return{type:"input",typeBadge:"Interpret Line Plot",
    question:`A line plot shows jumps of ${fracStr(1,4)} m: two students jumped ${fracStr(1,4)} m, three jumped ${fracStr(2,4)} m. What is the total distance of all jumps?`,
    answer:`${fracStr(7,4)} m`,hint:"Add all values: 1/4+1/4+2/4+2/4+2/4"};
};

GENERATORS["5-NN.5"]=()=>{
  return{type:"word",typeBadge:"Line Plot Multi-Step",
    question:`A line plot shows ribbons: 3 ribbons of ${fracStr(1,2)} m and 2 ribbons of ${fracStr(3,4)} m. What is the total length of all ribbons?`,
    answer:`${fracStr(9,4)} m`,hint:"3×1/2 + 2×3/4"};
};

GENERATORS["5-NN.7"]=()=>{
  const months=["Jan","Feb","Mar","Apr","May"];
  const temps=[22,25,28,30,27];
  const qi=rnd(0,4);
  return{type:"mc",typeBadge:"Line Graph",
    question:`A line graph shows temperatures: ${months.map((m,i)=>`${m}:${temps[i]}°`).join(", ")}. What was the temperature in <strong>${months[qi]}</strong>?`,
    options:mcOpts(temps[qi],...wrongNear(temps[qi],3,5)),answer:String(temps[qi])};
};

GENERATORS["5-NN.9"]=()=>{
  const cats=["Math","Reading","Science","Art"];
  const vals=[45,30,20,25];
  const qi=rnd(0,3);
  return{type:"mc",typeBadge:"Bar Graph",
    question:`A bar graph shows students' favourite subjects: ${cats.map((c,i)=>`${c}:${vals[i]}`).join(", ")}. Which subject has the most students?`,
    options:shuffle(cats),answer:"Math"};
};

GENERATORS["5-NN.12"]=()=>{
  const data={"1-5":4,"6-10":7,"11-15":3};
  return{type:"mc",typeBadge:"Frequency Table",
    question:`A frequency table shows scores: 1-5: 4 students, 6-10: 7 students, 11-15: 3 students. How many students scored 6-10?`,
    options:["7","4","3","14"],answer:"7"};
};

GENERATORS["5-UU.1"]=()=>{
  const a=rnd(2,5),b=rnd(2,5),extra=rnd(2,8);
  const vol=a*b*2+extra;
  return{type:"input",typeBadge:"Volume Irregular",
    question:`An irregular figure is made of two rectangular prisms. One has volume <strong>${a*b*2}</strong> cubic units and the other has volume <strong>${extra}</strong> cubic units. What is the total volume?`,
    answer:String(vol)};
};

GENERATORS["5-UU.2"]=()=>{
  const l=rnd(2,8),w=rnd(2,6),h=rnd(2,5);
  return{type:"input",typeBadge:"Volume Expression",
    question:`Write and evaluate an expression for the volume of a rectangular prism: l=<strong>${l}</strong>, w=<strong>${w}</strong>, h=<strong>${h}</strong>.`,
    answer:String(l*w*h),hint:`V = l × w × h = ${l} × ${w} × ${h}`};
};

GENERATORS["5-UU.3"]=()=>{
  const l=rnd(2,6),w=rnd(2,5),h=rnd(2,4);
  return{type:"mc",typeBadge:"Volume from Unit Cubes",
    question:`A prism is built from unit cubes: <strong>${l}</strong> long × <strong>${w}</strong> wide × <strong>${h}</strong> tall. How many unit cubes are there?`,
    options:mcOpts(l*w*h,...wrongNear(l*w*h,3,10)),answer:String(l*w*h)};
};

GENERATORS["5-UU.5"]=()=>{
  const l=rnd(2,12),w=rnd(2,8),h=rnd(2,6);
  return{type:"input",typeBadge:"Volume",
    question:`Volume of a rectangular prism: l=<strong>${l} cm</strong>, w=<strong>${w} cm</strong>, h=<strong>${h} cm</strong>`,
    answer:String(l*w*h),hint:"V = l × w × h"};
};

GENERATORS["5-UU.6"]=()=>{
  const l=rnd(3,12),w=rnd(2,8),h=rnd(2,6);
  return{type:"word",typeBadge:"Volume Word Problem",
    question:`A box is <strong>${l} cm</strong> long, <strong>${w} cm</strong> wide, and <strong>${h} cm</strong> tall. What is its volume in cm³?`,
    answer:String(l*w*h)};
};

GENERATORS["5-UU.8"]=()=>{
  const l=rnd(3,8),w=rnd(2,5),h=rnd(2,4),n=rnd(2,4);
  const oneVol=l*w*h;
  return{type:"word",typeBadge:"Multi-Step Volume",
    question:`${n} identical boxes each have dimensions ${l}×${w}×${h} cm. What is the total volume of all boxes?`,
    answer:String(oneVol*n)};
};

GENERATORS["5-UU.9"]=()=>{
  const l1=rnd(3,6),w1=rnd(2,4),h1=rnd(2,4);
  const l2=rnd(2,4),w2=rnd(1,3),h2=rnd(1,3);
  return{type:"input",typeBadge:"Compound Volume",
    question:`A compound figure has two parts: Part A (${l1}×${w1}×${h1}) and Part B (${l2}×${w2}×${h2}). What is the total volume?`,
    answer:String(l1*w1*h1+l2*w2*h2)};
};

// ════════════════════════════════════════════════════
// GRADE 6 — ALL SKILLS
// ════════════════════════════════════════════════════

GENERATORS["6-A.1"]=()=>{
  const pairs=[["red marbles","blue marbles"],["cats","dogs"],["apples","oranges"],["boys","girls"],["pencils","pens"]];
  const [t1,t2]=pick(pairs);const a=rnd(2,10),b=rnd(2,10);
  return{type:"mc",typeBadge:"Ratios",
    question:`There are <strong>${a} ${t1}</strong> and <strong>${b} ${t2}</strong>. What is the ratio of ${t1} to ${t2}?`,
    options:shuffle([`${a}:${b}`,`${b}:${a}`,`${a}:${a+b}`,`${b}:${a+b}`]),answer:`${a}:${b}`};
};

GENERATORS["6-A.2"]=()=>{
  const a=rnd(2,8),b=rnd(2,8);
  return{type:"word",typeBadge:"Ratio Word Problem",
    question:`In a class of ${a+b} students, ${a} are girls. Write the ratio of girls to boys in simplest form.`,
    answer:function(){const {n,d}=simplify(a,b);return`${n}:${d}`;}()};
};

GENERATORS["6-A.3"]=()=>{
  const a=rnd(2,6),b=rnd(2,6);const k=rnd(2,4);
  return{type:"mc",typeBadge:"Equivalent Ratios",
    question:`Which ratio is equivalent to <strong>${a}:${b}</strong>?`,
    options:shuffle([`${a*k}:${b*k}`,`${a+1}:${b+1}`,`${a*k}:${b*k+1}`,`${a+k}:${b}`]),
    answer:`${a*k}:${b*k}`};
};

GENERATORS["6-A.4"]=()=>{
  const a=rnd(2,8),b=rnd(2,8),k=rnd(2,5);
  return{type:"input",typeBadge:"Equivalent Ratios",
    question:`Write a ratio equivalent to <strong>${a}:${b}</strong> by multiplying both parts by ${k}.`,
    answer:`${a*k}:${b*k}`};
};

GENERATORS["6-A.5"]=()=>{
  const r1=rnd(2,6),r2=rnd(2,6),total=rnd(4,10)*(r1+r2);
  const part1=(r1*total)/(r1+r2);
  return{type:"word",typeBadge:"Ratio Word Problem",
    question:`Juice and water are mixed in a ratio of <strong>${r1}:${r2}</strong>. If there are <strong>${total} ml total</strong>, how many ml of juice are there?`,
    answer:String(part1)};
};

GENERATORS["6-A.6"]=()=>{
  const pairs=[["miles","hours"],["words","minutes"],["pages","hours"]];
  const [unit,per]=pick(pairs);const rate=rnd(15,80),qty=rnd(2,5);
  return{type:"input",typeBadge:"Unit Rate",
    question:`${qty*rate} ${unit} in ${qty} ${per}. What is the unit rate (per ${per.slice(0,-1)})?`,
    answer:String(rate)};
};

GENERATORS["6-A.7"]=()=>{
  const price=rnd(2,8),qty=rnd(3,12);
  return{type:"word",typeBadge:"Unit Rate Word Problem",
    question:`${qty} apples cost $${price*qty}. What is the cost per apple?`,
    answer:`$${price}`};
};

GENERATORS["6-A.8"]=()=>{
  const r1=rnd(20,60),r2=rnd(20,60);
  return{type:"mc",typeBadge:"Compare Ratios",
    question:`Car A travels ${r1} km in 1 hour. Car B travels ${r2} km in 1 hour. Which is faster?`,
    options:shuffle([`Car ${r1>r2?"A":"B"}`,`Car ${r1>r2?"B":"A"}`,"They are equal","Cannot tell"]),
    answer:`Car ${r1>r2?"A":"B"}`};
};

GENERATORS["6-B.1"]=()=>{
  const a=rnd(2,8),b=rnd(2,8),k=rnd(2,4);
  const isProp=Math.random()<.5;
  const c=a*k,d=isProp?b*k:b*k+1;
  return{type:"mc",typeBadge:"Proportions",
    question:`Do <strong>${a}/${b}</strong> and <strong>${c}/${d}</strong> form a proportion?`,
    options:["Yes","No"],answer:isProp?"Yes":"No"};
};

GENERATORS["6-B.2"]=()=>{
  const a=rnd(2,9),b=rnd(2,9),c=rnd(2,9);
  const d=a*c/b;
  if(!Number.isInteger(d))return GENERATORS["6-B.2"]();
  return{type:"input",typeBadge:"Solve Proportion",
    question:`Solve: <strong>${a}/${b} = ${c}/x</strong>`,
    answer:String(d),hint:"Cross multiply: a×x = b×c, then divide."};
};

GENERATORS["6-B.3"]=()=>{
  const rate=rnd(40,80),hrs=rnd(3,8);
  const baseHrs=rnd(2,4),basePay=rate*baseHrs;
  return{type:"word",typeBadge:"Proportion Word Problem",
    question:`If ${baseHrs} hours of work earns $${basePay}, how much do ${hrs} hours earn?`,
    answer:`$${rate*hrs}`};
};

GENERATORS["6-C.1"]=()=>{
  const items=[{f:"1/2",d:"0.5",p:"50%"},{f:"1/4",d:"0.25",p:"25%"},{f:"3/4",d:"0.75",p:"75%"},{f:"1/5",d:"0.2",p:"20%"},{f:"2/5",d:"0.4",p:"40%"}];
  const item=pick(items);const forms=[item.f,item.d,item.p];const target=pick(forms);
  const others=forms.filter(x=>x!==target);
  return{type:"mc",typeBadge:"Percent/Fraction/Decimal",
    question:`Which is NOT equivalent to the others: <strong>${forms.join(", ")}</strong>?`,
    options:shuffle([item.f,item.d,item.p,`${parseInt(item.p)+5}%`]),answer:`${parseInt(item.p)+5}%`};
};

GENERATORS["6-C.2"]=()=>{
  const part=rnd(1,10)*5,whole=pick([20,25,40,50,80,100,200]);
  const pct=dec(part/whole*100,1);
  return{type:"input",typeBadge:"What Percent",
    question:`<strong>${part}</strong> is what percent of <strong>${whole}</strong>?`,
    answer:`${pct}%`,hint:`Divide ${part} by ${whole} then × 100.`};
};

GENERATORS["6-C.3"]=()=>{
  const pcts=[10,20,25,40,50,75];const p=pick(pcts),base=rnd(2,20)*10;
  return{type:"input",typeBadge:"Percentage of Number",
    question:`What is <strong>${p}%</strong> of <strong>${base}</strong>?`,
    answer:String(p*base/100),hint:`${p}% = ${p/100} as a decimal.`};
};

GENERATORS["6-C.4"]=()=>{
  const p=pick([10,15,20,25,50]),price=rnd(2,20)*10;
  return{type:"word",typeBadge:"Percent Word Problem",
    question:`A $${price} shirt is <strong>${p}% off</strong>. How much money do you save?`,
    answer:`$${p*price/100}`};
};

GENERATORS["6-C.5"]=()=>{
  const orig=rnd(4,20)*10,change=pick([-20,-10,-5,5,10,20]);
  const newVal=orig+change;const pct=dec(Math.abs(change)/orig*100,0);
  return{type:"input",typeBadge:"Percent of Change",
    question:`A price changes from $${orig} to $${newVal}. What is the percent of change?`,
    answer:`${pct}%`};
};

GENERATORS["6-C.6"]=()=>{
  const orig=rnd(50,200),pct=pick([10,20,25,50]);
  const newVal=orig+(orig*pct/100);
  return{type:"word",typeBadge:"Percent Word Problem",
    question:`A shop increases all prices by <strong>${pct}%</strong>. If an item was $${orig}, what is the new price?`,
    answer:`$${newVal}`};
};

GENERATORS["6-D.1"]=()=>{
  const d=pick([2,3,4,5,6]),whole=rnd(2,8);
  const {n,d:dn}=simplify(1,d*whole);
  return{type:"input",typeBadge:"Fraction ÷ Whole",
    question:`<strong>${fracStr(1,d)} ÷ ${whole}</strong> = ?`,answer:`1/${d*whole}`,hint:"Keep, Change, Flip!"};
};

GENERATORS["6-D.2"]=()=>{
  const d=pick([2,3,4,5,6]),whole=rnd(2,10);
  return{type:"input",typeBadge:"Whole ÷ Fraction",
    question:`<strong>${whole} ÷ ${fracStr(1,d)}</strong> = ?`,answer:String(whole*d)};
};

GENERATORS["6-D.3"]=()=>{
  const d1=pick([2,3,4,5]),d2=pick([2,3,4,5]),n1=rnd(1,d1),n2=rnd(1,d2);
  const {n,d}=simplify(n1*d2,d1*n2);
  const ans=d===1?String(n):`${n}/${d}`;
  return{type:"input",typeBadge:"Divide Fractions",
    question:`<strong>${fracStr(n1,d1)} ÷ ${fracStr(n2,d2)}</strong> = ?`,
    answer:ans,hint:"Keep the first, Change ÷ to ×, Flip the second."};
};

GENERATORS["6-D.4"]=()=>{
  const d=pick([2,3,4]),whole=rnd(2,6);
  return{type:"word",typeBadge:"Fraction Division Word Problem",
    question:`You have ${whole} metres of ribbon. Each piece must be ${fracStr(1,d)} m. How many pieces can you cut?`,
    answer:String(whole*d)};
};

GENERATORS["6-D.5"]=()=>{
  const w1=rnd(1,4),n1=rnd(1,2),d1=pick([2,3,4]);
  const w2=rnd(1,3),n2=rnd(1,2),d2=pick([2,3,4]);
  const top1=w1*d1+n1,top2=w2*d2+n2;
  const {n,d}=simplify(top1*d2,d1*top2);
  const wt=Math.floor(n/d),r=n%d;
  const ans=d===1?String(n):wt>0?`${wt} ${r}/${d}`:`${n}/${d}`;
  return{type:"input",typeBadge:"Divide Mixed Numbers",
    question:`<strong>${w1} ${fracStr(n1,d1)} ÷ ${w2} ${fracStr(n2,d2)}</strong> = ?`,answer:ans.trim()};
};

GENERATORS["6-D.6"]=()=>{
  const total=rnd(4,12),d=pick([2,3,4]);
  const pieces=rnd(2,6);const each=`${total}/${d*pieces}`;
  return{type:"word",typeBadge:"Mixed Number Division Word Problem",
    question:`${total} pizzas are divided into portions of ${fracStr(1,d)} each. How many portions are there?`,
    answer:String(total*d)};
};

GENERATORS["6-E.1"]=()=>{
  const op=pick(["+","-"]);const a=rnd(-15,15),b=rnd(-15,15);
  const ans=op==="+"?a+b:a-b;
  return{type:"input",typeBadge:"Integer Operations",
    question:`<strong>${a} ${op} (${b})</strong> = ?`,answer:String(ans),
    hint:op==="-"?"Subtracting a negative = adding a positive.":"Use a number line."};
};

GENERATORS["6-E.2"]=()=>{
  const temp=rnd(-20,5),rise=rnd(5,30);
  const newTemp=temp+rise;
  return{type:"word",typeBadge:"Integer Word Problem",
    question:`The temperature is <strong>${temp}°C</strong>. It rises by <strong>${rise}°</strong>. What is the new temperature?`,
    answer:`${newTemp}°C`};
};

GENERATORS["6-E.3"]=()=>{
  const nonZero=[-9,-8,-7,-6,-5,-4,-3,-2,2,3,4,5,6,7,8,9];
  const a=pick(nonZero),b=pick(nonZero);const op=pick(["×","÷"]);
  if(op==="×")return{type:"input",typeBadge:"Multiply Integers",question:`<strong>(${a}) × (${b})</strong> = ?`,answer:String(a*b),hint:"Same signs → positive. Different → negative."};
  const dividend=a*b,divisor=b;
  return{type:"input",typeBadge:"Divide Integers",question:`<strong>(${dividend}) ÷ (${divisor})</strong> = ?`,answer:String(a),hint:"Same signs → positive quotient."};
};

GENERATORS["6-E.4"]=()=>{
  const depth=rnd(5,50),floors=rnd(2,8);
  return{type:"word",typeBadge:"Integer Word Problem",
    question:`A submarine descends <strong>${depth} m</strong> per minute for <strong>${floors} minutes</strong>. What is its depth? (Use negative for below sea level.)`,
    answer:`−${depth*floors} m`};
};

GENERATORS["6-F.1"]=()=>{
  const n=rnd(-15,15);
  const v=pick(["absolute value","opposite"]);
  const ans=v==="absolute value"?Math.abs(n):-n;
  return{type:"input",typeBadge:"Absolute Value & Opposites",
    question:`What is the <strong>${v}</strong> of <strong>${n}</strong>?`,answer:String(ans)};
};

GENERATORS["6-F.2"]=()=>{
  const nums=shuffle([-rnd(1,10),-rnd(1,10),rnd(1,10),rnd(1,10)]).slice(0,4);
  const sorted=[...nums].sort((a,b)=>a-b);
  const asc=Math.random()<.5;
  return{type:"mc",typeBadge:"Order Integers",
    question:`Order from <strong>${asc?"least to greatest":"greatest to least"}</strong>: ${nums.join(", ")}`,
    options:shuffle([sorted.join(", "),[...sorted].reverse().join(", "),...[shuffle([...sorted]).join(", "),shuffle([...sorted]).join(", ")]]),
    answer:(asc?sorted:[...sorted].reverse()).join(", ")};
};

GENERATORS["6-F.3"]=()=>{
  const x=rnd(-8,8);
  return{type:"mc",typeBadge:"Integers on Number Line",
    question:`Which integer is located at <strong>${x} units</strong> from zero on a number line? (in the ${x>=0?"positive":"negative"} direction)`,
    options:mcOpts(x,...wrongNear(Math.abs(x),3,3).map(v=>x>=0?v:-v)),answer:String(x)};
};

GENERATORS["6-G.1"]=()=>{
  const qs=[
    {q:"How many quadrants does a coordinate plane have?",a:"4",opts:["4","2","6","8"]},
    {q:"In which quadrant is the point (−3, 4)?",a:"Quadrant II",opts:["Quadrant I","Quadrant II","Quadrant III","Quadrant IV"]},
    {q:"In which quadrant is the point (5, −2)?",a:"Quadrant IV",opts:["Quadrant I","Quadrant II","Quadrant III","Quadrant IV"]},
    {q:"In which quadrant is the point (−1, −6)?",a:"Quadrant III",opts:["Quadrant I","Quadrant II","Quadrant III","Quadrant IV"]},
    {q:"In which quadrant is the point (3, 7)?",a:"Quadrant I",opts:["Quadrant I","Quadrant II","Quadrant III","Quadrant IV"]},
  ];
  const item=pick(qs);
  return{type:"mc",typeBadge:"Coordinate Plane",question:item.q,options:shuffle(item.opts),answer:item.a};
};

GENERATORS["6-G.2"]=()=>{
  const x=rnd(-8,8),y=rnd(-8,8);
  const quad=x>=0&&y>=0?"I":x<0&&y>=0?"II":x<0&&y<0?"III":"IV";
  return{type:"mc",typeBadge:"Four Quadrants",
    question:`In which quadrant is the point <strong>(${x}, ${y})</strong>?`,
    options:shuffle(["Quadrant I","Quadrant II","Quadrant III","Quadrant IV"]),
    answer:`Quadrant ${quad}`};
};

GENERATORS["6-G.3"]=()=>{
  const x=rnd(-6,6),y1=rnd(-6,6),y2=rnd(-6,6);
  const dist=Math.abs(y2-y1);
  return{type:"input",typeBadge:"Distance Between Points",
    question:`What is the distance between <strong>(${x}, ${y1})</strong> and <strong>(${x}, ${y2})</strong>?`,
    answer:String(dist),hint:"For vertical line: |y₂ − y₁|"};
};

GENERATORS["6-H.1"]=()=>{
  const a=rnd(2,8)*rnd(2,5),b=rnd(2,8)*rnd(2,5);const g=gcd(a,b);
  return{type:"input",typeBadge:"GCF",
    question:`What is the <strong>GCF</strong> of <strong>${a}</strong> and <strong>${b}</strong>?`,
    answer:String(g),hint:"List all factors of each number, find the largest common one."};
};

GENERATORS["6-H.2"]=()=>{
  const a=rnd(2,12),b=rnd(2,12);const l=lcm(a,b);
  return{type:"input",typeBadge:"LCM",
    question:`What is the <strong>LCM</strong> of <strong>${a}</strong> and <strong>${b}</strong>?`,
    answer:String(l),hint:"List multiples until you find a match."};
};

GENERATORS["6-H.3"]=()=>{
  const a=rnd(3,12),b=rnd(3,12);const g=gcd(a,b),l=lcm(a,b);
  const qs=[
    {q:`${a} students can be split into equal groups, and so can ${b}. What is the largest equal group size?`,a:String(g)},
    {q:`Event A repeats every ${a} days and Event B every ${b} days. When do they first happen on the same day?`,a:`Day ${l}`},
  ];
  const item=pick(qs);
  return{type:"word",typeBadge:"GCF & LCM Word Problem",question:item.q,answer:item.a};
};

GENERATORS["6-I.1"]=()=>{
  const phrases=[
    {p:"5 more than x",e:"x + 5"},{p:"3 less than y",e:"y − 3"},
    {p:"double n",e:"2n"},{p:"half of p",e:"p/2"},
    {p:"7 times t",e:"7t"},{p:"x divided by 4",e:"x/4"},
  ];
  const item=pick(phrases);
  return{type:"mc",typeBadge:"Write Variable Expression",
    question:`Write a variable expression for: "<strong>${item.p}</strong>"`,
    options:shuffle([item.e,...phrases.filter(x=>x.e!==item.e).map(x=>x.e).slice(0,3)]),
    answer:item.e};
};

GENERATORS["6-I.2"]=()=>{
  const x=rnd(1,12);
  const exprs=[
    {e:`3x + 5`,v:3*x+5},{e:`x² − 4`,v:x*x-4},{e:`2x − 7`,v:2*x-7},
    {e:`4x + 1`,v:4*x+1},{e:`10 − x`,v:10-x},{e:`x/2 + 3`,v:x/2+3},
  ];
  const item=pick(exprs);
  return{type:"input",typeBadge:"Evaluate Expression",
    question:`Evaluate <strong>${item.e}</strong> when <strong>x = ${x}</strong>`,
    answer:String(dec(item.v,1)),hint:`Replace x with ${x}.`};
};

GENERATORS["6-I.3"]=()=>{
  const x=dec(rnd(2,8)/2,1);
  const exprs=[{e:`2x + 1`,v:2*x+1},{e:`3x − 0.5`,v:3*x-0.5},{e:`x + 4.5`,v:x+4.5}];
  const item=pick(exprs);
  return{type:"input",typeBadge:"Evaluate with Decimals",
    question:`Evaluate <strong>${item.e}</strong> when <strong>x = ${x}</strong>`,
    answer:String(dec(item.v,2))};
};

GENERATORS["6-I.4"]=()=>{
  const items=[
    {d:"the sum of n and 8",e:"n + 8"},{d:"4 times a number p",e:"4p"},
    {d:"a number y decreased by 6",e:"y − 6"},{d:"a number divided by 5",e:"n/5"},
  ];
  const item=pick(items);
  return{type:"input",typeBadge:"Expression from Words",
    question:`Write a variable expression: "<strong>${item.d}</strong>"`,answer:item.e};
};

GENERATORS["6-J.1"]=()=>{
  const a=rnd(1,6),b=rnd(1,6),c=rnd(1,8);const d=a+b;
  return{type:"mc",typeBadge:"Equivalent Expressions",
    question:`Which expression is equivalent to <strong>${a}x + ${c} + ${b}x</strong>?`,
    options:shuffle([`${d}x + ${c}`,`${a+b+c}x`,`${d}x`,`${a}x + ${b+c}`]),
    answer:`${d}x + ${c}`};
};

GENERATORS["6-J.2"]=()=>{
  const a=rnd(1,8),b=rnd(1,8),c=rnd(1,8);const d=a+c;
  return{type:"input",typeBadge:"Combine Like Terms",
    question:`Combine like terms: <strong>${a}x + ${b} + ${c}x</strong>`,
    answer:`${d}x + ${b}`,hint:"Add x-terms together. Keep the constant."};
};

GENERATORS["6-J.3"]=()=>{
  const a=rnd(2,6),b=rnd(2,8),c=rnd(2,8);
  return{type:"input",typeBadge:"Distributive Property",
    question:`Expand using the distributive property: <strong>${a}(${b} + ${c})</strong>`,
    answer:`${a*b} + ${a*c}`,hint:`Multiply ${a} by each term inside.`};
};

GENERATORS["6-K.1"]=()=>{
  const x=rnd(2,12),b=rnd(1,10),m=rnd(2,5);
  const eq=pick([`x + ${b} = ${x+b}`,`x − ${b} = ${x-b}`,`${m}x = ${m*x}`]);
  const ans=eq.includes("+")?x:eq.includes("−")?x:x;
  const wrong=[x+1,x-1,x+b].filter(v=>v!==ans);
  return{type:"mc",typeBadge:"Which x Satisfies?",
    question:`Which value of x satisfies <strong>${eq}</strong>?`,
    options:mcOpts(ans,...wrong.slice(0,3)),answer:String(ans)};
};

GENERATORS["6-K.2"]=()=>{
  const variants=[
    ()=>{const x=rnd(2,15),b=rnd(1,10);return{e:`x + ${b} = ${x+b}`,a:String(x)};},
    ()=>{const x=rnd(2,15),b=rnd(1,10);return{e:`x − ${b} = ${x-b}`,a:String(x)};},
    ()=>{const x=rnd(2,12),m=rnd(2,8);return{e:`${m}x = ${m*x}`,a:String(x)};},
    ()=>{const x=rnd(2,12),m=rnd(2,6);return{e:`x/${m} = ${x}`,a:String(x*m)};},
  ];
  const o=pick(variants)();
  return{type:"input",typeBadge:"Solve One-Step Equation",
    question:`Solve for x: <strong>${o.e}</strong>`,answer:o.a,hint:"Use inverse operations."};
};

GENERATORS["6-K.3"]=()=>{
  const x=dec(rnd(4,20)/4,2);const b=dec(rnd(10,40)/10,1);
  return{type:"input",typeBadge:"Solve Equation (Decimals)",
    question:`Solve for x: <strong>x + ${b} = ${dec(x+b,2)}</strong>`,
    answer:String(x)};
};

GENERATORS["6-K.4"]=()=>{
  const rate=rnd(8,25),hours=rnd(5,40);
  return{type:"word",typeBadge:"Equation Word Problem",
    question:`You earn $${rate} per hour. Write and solve an equation to find how many hours you need to earn $${rate*hours}.`,
    answer:`${hours} hours`,hint:`${rate}h = ${rate*hours}`};
};

GENERATORS["6-K.5"]=()=>{
  const x=rnd(2,12),m=rnd(2,5),b=rnd(1,10);
  return{type:"input",typeBadge:"Two-Step Equation",
    question:`Solve: <strong>${m}x + ${b} = ${m*x+b}</strong>`,
    answer:String(x),hint:`Step 1: subtract ${b}. Step 2: divide by ${m}.`};
};

GENERATORS["6-K.6"]=()=>{
  const x=rnd(2,10),m=rnd(2,5),b=rnd(2,10);
  return{type:"word",typeBadge:"Two-Step Equation Word Problem",
    question:`A plumber charges a $${b} call-out fee plus $${m} per hour. If the total bill is $${m*x+b}, how many hours did they work?`,
    answer:`${x} hours`};
};

GENERATORS["6-L.1"]=()=>{
  const x=rnd(2,12),op=pick([">","<","≥","≤"]);
  return{type:"input",typeBadge:"Write Inequality",
    question:`Write an inequality: "a number n is <strong>${op===">"?"greater than":op==="<"?"less than":op==="≥"?"at least":"at most"} ${x}</strong>"`,
    answer:`n ${op} ${x}`};
};

GENERATORS["6-L.2"]=()=>{
  const x=rnd(2,10),op=pick([">","<","≥","≤"]);
  return{type:"mc",typeBadge:"Graph Inequality",
    question:`Which describes the graph of <strong>x ${op} ${x}</strong> on a number line?`,
    options:shuffle([
      `${op.includes("=")?"Closed":"Open"} circle at ${x}, arrow to the ${op.includes(">")?"right":"left"}`,
      `${op.includes("=")?"Open":"Closed"} circle at ${x}, arrow to the ${op.includes(">")?"right":"left"}`,
      `${op.includes("=")?"Closed":"Open"} circle at ${x}, arrow to the ${op.includes(">")?"left":"right"}`,
      `Closed circles at both ends`,
    ]),
    answer:`${op.includes("=")?"Closed":"Open"} circle at ${x}, arrow to the ${op.includes(">")?"right":"left"}`};
};

GENERATORS["6-L.3"]=()=>{
  const b=rnd(2,10),op=pick([">","<","≥","≤"]);
  return{type:"input",typeBadge:"Solve Inequality",
    question:`Solve: <strong>x + ${b} ${op} ${b+rnd(1,10)}</strong>`,
    answer:`x ${op} ${rnd(1,10)}`,hint:"Subtract from both sides."};
};

GENERATORS["6-L.4"]=()=>{
  const limit=rnd(20,50),already=rnd(5,15);
  return{type:"word",typeBadge:"Inequality Word Problem",
    question:`A bag can hold at most <strong>${limit} kg</strong>. It already has <strong>${already} kg</strong>. Write an inequality for how much more (w) can be added.`,
    answer:`w ≤ ${limit-already}`};
};

GENERATORS["6-M.1"]=()=>{
  const pairs=[
    {i:"hours worked",d:"total pay",q:"Which is the independent variable?",a:"hours worked"},
    {i:"number of books",d:"total cost",q:"Which depends on the other?",a:"total cost"},
    {i:"time",d:"distance traveled",q:"Which is the dependent variable?",a:"distance traveled"},
  ];
  const item=pick(pairs);
  return{type:"mc",typeBadge:"Independent/Dependent",
    question:`In the relationship between <strong>${item.i}</strong> and <strong>${item.d}</strong>: <strong>${item.q}</strong>`,
    options:shuffle([item.i,item.d,"Both","Neither"]),answer:item.a};
};

GENERATORS["6-M.2"]=()=>{
  const rate=rnd(5,20),base=rnd(0,20);
  const x=rnd(1,10),y=rate*x+base;
  return{type:"input",typeBadge:"Write Equation",
    question:`A taxi charges $${base} plus $${rate} per mile. Write an equation for total cost (y) in terms of miles (x).`,
    answer:`y = ${rate}x + ${base}`};
};

GENERATORS["6-M.3"]=()=>{
  const qs=[
    {q:"A graph shows a straight line going up. What does this mean?",a:"As x increases, y increases",opts:["As x increases, y increases","As x increases, y decreases","x and y are equal","y stays constant"]},
    {q:"A graph shows a horizontal line. What does this mean?",a:"y stays constant",opts:["As x increases, y increases","As x increases, y decreases","x and y are equal","y stays constant"]},
  ];
  const item=pick(qs);
  return{type:"mc",typeBadge:"Interpret Graph",question:item.q,options:shuffle(item.opts),answer:item.a};
};

GENERATORS["6-N.1"]=()=>{
  const b=rnd(4,18),h=rnd(3,14);
  return{type:"input",typeBadge:"Area of Triangle",
    question:`A triangle has base <strong>${b} cm</strong> and height <strong>${h} cm</strong>. What is its area?`,
    answer:String(b*h/2),hint:"A = (base × height) ÷ 2"};
};

GENERATORS["6-N.2"]=()=>{
  const shapes=[
    ()=>{const l=rnd(3,14),w=rnd(3,10);return{s:"rectangle",dim:`l=${l} cm, w=${w} cm`,a:l*w,h:"A = l × w"};},
    ()=>{const b=rnd(4,14),h=rnd(3,10);return{s:"parallelogram",dim:`base=${b} cm, height=${h} cm`,a:b*h,h:"A = b × h"};},
    ()=>{const b1=rnd(4,10),b2=rnd(4,10),h=rnd(3,8);return{s:"trapezoid",dim:`bases=${b1} and ${b2} cm, height=${h} cm`,a:(b1+b2)*h/2,h:"A = (b₁+b₂)/2 × h"};},
  ];
  const s=pick(shapes)();
  return{type:"input",typeBadge:"Area",question:`Find the area of a <strong>${s.s}</strong>: ${s.dim}`,answer:String(s.a),hint:s.h};
};

GENERATORS["6-N.3"]=()=>{
  const l1=rnd(3,8),w1=rnd(3,6),l2=rnd(2,5),w2=rnd(2,4);
  return{type:"input",typeBadge:"Compound Area",
    question:`A compound figure has two rectangles: ${l1}×${w1} and ${l2}×${w2}. What is the total area?`,
    answer:String(l1*w1+l2*w2)};
};

GENERATORS["6-N.4"]=()=>{
  const l=rnd(4,14),w=rnd(3,10);
  return{type:"word",typeBadge:"Area & Perimeter Word Problem",
    question:`A rectangular garden is <strong>${l} m × ${w} m</strong>. Fencing costs $5 per metre. How much does it cost to fence the entire garden?`,
    answer:`$${2*(l+w)*5}`};
};

GENERATORS["6-O.1"]=()=>{
  const l=rnd(3,10),w=rnd(2,8),h=rnd(2,6);
  const sa=2*(l*w+l*h+w*h);
  return{type:"input",typeBadge:"Surface Area",
    question:`Find the surface area of a rectangular prism: l=${l}, w=${w}, h=${h}`,
    answer:String(sa),hint:"SA = 2(lw + lh + wh)"};
};

GENERATORS["6-O.2"]=()=>{
  const b=rnd(3,8),s=rnd(3,8);
  const sa=b*b+2*b*s;
  return{type:"input",typeBadge:"Surface Area Pyramid",
    question:`A square pyramid has base side <strong>${b} cm</strong> and slant height <strong>${s} cm</strong>. Find the surface area (base + 4 triangular faces).`,
    answer:String(sa),hint:`Base: ${b}², Triangles: 4×(${b}×${s}/2)`};
};

GENERATORS["6-O.3"]=()=>{
  const l=rnd(2,10),w=rnd(2,8),h=rnd(2,6);
  return{type:"input",typeBadge:"Volume",
    question:`Volume of a rectangular prism: l=<strong>${l}</strong>, w=<strong>${w}</strong>, h=<strong>${h}</strong>`,
    answer:String(l*w*h),hint:"V = l × w × h"};
};

GENERATORS["6-O.4"]=()=>{
  const l=rnd(3,8),w=rnd(2,6),h=rnd(2,5);
  const vol=l*w*h;const sa=2*(l*w+l*h+w*h);
  const q=Math.random()<.5;
  return{type:"word",typeBadge:"Volume & SA Word Problem",
    question:q?`A box (${l}×${w}×${h} cm) is filled with sand. How many cm³ of sand does it hold?`:`How much wrapping paper is needed to cover a box ${l}×${w}×${h} cm (surface area)?`,
    answer:String(q?vol:sa)};
};

GENERATORS["6-P.1"]=()=>{
  const x1=rnd(-6,6),x2=rnd(-6,6),y=rnd(-5,5);
  return{type:"input",typeBadge:"Polygon in Coordinate Plane",
    question:`Find the length of the horizontal segment from <strong>(${x1}, ${y})</strong> to <strong>(${x2}, ${y})</strong>.`,
    answer:String(Math.abs(x2-x1)),hint:"|x₂ − x₁|"};
};

GENERATORS["6-P.2"]=()=>{
  const w=rnd(3,8),h=rnd(3,8);
  return{type:"input",typeBadge:"Polygon Area",
    question:`A rectangle in the coordinate plane has vertices at (0,0), (${w},0), (${w},${h}), and (0,${h}). What is its area?`,
    answer:String(w*h)};
};

GENERATORS["6-Q.1"]=()=>{
  const data=Array.from({length:rnd(5,7)},()=>rnd(2,20));
  const sorted=[...data].sort((a,b)=>a-b);
  const mean=dec(data.reduce((s,x)=>s+x,0)/data.length,1);
  const mid=Math.floor(sorted.length/2);
  const median=sorted.length%2===0?(sorted[mid-1]+sorted[mid])/2:sorted[mid];
  const range=sorted[sorted.length-1]-sorted[0];
  const v=pick([{q:"mean",a:String(mean)},{q:"median",a:String(median)},{q:"range",a:String(range)}]);
  return{type:"input",typeBadge:"Statistics",
    question:`Data: <strong>${data.join(", ")}</strong>. Find the <strong>${v.q}</strong>.`,
    answer:v.a,hint:v.q==="mean"?`Sum ÷ ${data.length}`:v.q==="median"?"Sort, find middle.":"Largest − Smallest."};
};

GENERATORS["6-Q.2"]=()=>{
  const scores=[72,85,90,88,72];
  const sorted=[...scores].sort((a,b)=>a-b);
  const mean=dec(scores.reduce((s,x)=>s+x,0)/scores.length,1);
  const median=sorted[Math.floor(sorted.length/2)];
  const v=pick([{q:"What is the mean score?",a:String(mean)},{q:"What is the median score?",a:String(median)},{q:"What is the range?",a:String(sorted[sorted.length-1]-sorted[0])}]);
  return{type:"word",typeBadge:"Statistics Word Problem",
    question:`Test scores: <strong>72, 85, 90, 88, 72</strong>. ${v.q}`,answer:v.a};
};

GENERATORS["6-Q.3"]=()=>{
  const qs=[
    {q:"If you add a very large value to a data set, which measure is most affected?",a:"Mean",opts:["Mean","Median","Mode","Range stays same"]},
    {q:"Which measure is most resistant to extreme values (outliers)?",a:"Median",opts:["Mean","Median","Mode","Range"]},
    {q:"Removing the lowest value from a data set will ___ the mean.",a:"increase",opts:["increase","decrease","not change","double"]},
  ];
  const item=pick(qs);
  return{type:"mc",typeBadge:"Changes in Statistics",question:item.q,options:shuffle(item.opts),answer:item.a};
};

GENERATORS["6-R.1"]=()=>{
  const data={"0-9":3,"10-19":7,"20-29":5,"30-39":2};
  const keys=Object.keys(data);const vals=Object.values(data);
  const qi=rnd(0,3);
  return{type:"mc",typeBadge:"Histogram",
    question:`A histogram shows: ${keys.map((k,i)=>`${k}: ${vals[i]}`).join(", ")}. How many values are in the <strong>${keys[qi]}</strong> interval?`,
    options:mcOpts(vals[qi],...wrongNear(vals[qi],3,3)),answer:String(vals[qi])};
};

GENERATORS["6-R.3"]=()=>{
  const min=rnd(10,30),q1=rnd(35,45),median=rnd(50,60),q3=rnd(65,75),max=rnd(80,95);
  const qs=[{q:`What is the median?`,a:String(median)},{q:`What is the interquartile range (Q3 − Q1)?`,a:String(q3-q1)}];
  const item=pick(qs);
  return{type:"input",typeBadge:"Box Plot",
    question:`Box plot shows: Min=${min}, Q1=${q1}, Median=${median}, Q3=${q3}, Max=${max}. ${item.q}`,
    answer:item.a};
};

GENERATORS["6-R.4"]=()=>{
  const stem=[1,2,3],leaves=[[2,5,8],[0,3,7],[1,4,9]];
  const qi=rnd(0,2);const leaf=pick(leaves[qi]);
  return{type:"mc",typeBadge:"Stem-and-Leaf Plot",
    question:`A stem-and-leaf plot shows stems 1,2,3. Stem ${stem[qi]} has leaves ${leaves[qi].join(", ")}. What is one value?`,
    options:mcOpts(stem[qi]*10+leaf,...[stem[qi]*10+pick(leaves[qi]),stem[qi]*10+10,...wrongNear(stem[qi]*10+leaf,2,5)].map(String).slice(0,3)),
    answer:String(stem[qi]*10+leaf)};
};

GENERATORS["6-R.5"]=()=>{
  const data=[3,3,4,5,5,5,6,6,7];const val=pick(data);const freq=data.filter(x=>x===val).length;
  return{type:"mc",typeBadge:"Dot Plot",
    question:`A dot plot shows: ${data.join(", ")}. How many dots are above <strong>${val}</strong>?`,
    options:mcOpts(freq,...wrongNear(freq,3,2)),answer:String(freq)};
};

GENERATORS["6-S.1"]=()=>{
  const data=[2,4,4,6,8];const mean=dec(data.reduce((s,x)=>s+x,0)/data.length,1);
  const mad=dec(data.map(x=>Math.abs(x-mean)).reduce((s,x)=>s+x,0)/data.length,1);
  return{type:"input",typeBadge:"MAD",
    question:`Data: <strong>${data.join(", ")}</strong>. The mean is ${mean}. What is the Mean Absolute Deviation (MAD)?`,
    answer:String(mad),hint:"MAD = average of |each value − mean|"};
};

GENERATORS["6-S.2"]=()=>{
  const qs=[
    {q:"A data set is spread far from the mean. Its MAD is ___ .",a:"large",opts:["large","small","zero","negative"]},
    {q:"If all values in a data set are the same, the MAD is ___ .",a:"0",opts:["0","1","equal to the mean","very large"]},
    {q:"Which word describes a data set that is tightly clustered around the mean?",a:"low variability",opts:["low variability","high variability","skewed","bimodal"]},
  ];
  const item=pick(qs);
  return{type:"mc",typeBadge:"Describe Distributions",question:item.q,options:shuffle(item.opts),answer:item.a};
};

GENERATORS["5-NN.6"]=()=>{
  const months=["Jan","Feb","Mar","Apr","May","Jun"];
  const data=months.map(()=>rnd(15,40));
  const maxIdx=data.indexOf(Math.max(...data));
  const minIdx=data.indexOf(Math.min(...data));
  const isMax=Math.random()<.5;
  const answer=months[isMax?maxIdx:minIdx];
  // always include the correct answer + 3 other months as distractors
  const others=shuffle(months.filter(m=>m!==answer)).slice(0,3);
  return{type:"mc",typeBadge:"Line Graphs",
    question:`A line graph shows temperatures: ${months.map((m,i)=>`${m}:${data[i]}°`).join(", ")}.<br>Which month had the <strong>${isMax?"highest":"lowest"}</strong> temperature?`,
    options:shuffle([answer,...others]),
    answer};
};

GENERATORS["5-NN.8"]=()=>{
  const subjects=["Math","Reading","Science","Art","PE"];
  const vals=subjects.map(()=>rnd(10,40));
  const qi=rnd(0,4);
  return{type:"mc",typeBadge:"Create Bar Graphs",
    question:`A bar graph shows students' votes: ${subjects.map((s,i)=>`${s}:${vals[i]}`).join(", ")}.<br>How many students voted for <strong>${subjects[qi]}</strong>?`,
    options:shuffle([vals[qi],...[vals[qi]+5,vals[qi]-5,vals[qi]+10].filter(x=>x>0&&x!==vals[qi])].slice(0,4).map(String)),
    answer:String(vals[qi])};
};

GENERATORS["6-R.2"]=()=>{
  const intervals=["0–9","10–19","20–29","30–39"];
  const counts=intervals.map(()=>rnd(2,12));
  const qi=rnd(0,3);
  return{type:"mc",typeBadge:"Create Histograms",
    question:`Data values are grouped into intervals: ${intervals.map((iv,i)=>`${iv}: ${counts[i]} values`).join(", ")}.<br>Which interval has the <strong>most</strong> values?`,
    options:shuffle(intervals),
    answer:intervals[counts.indexOf(Math.max(...counts))]};
};

// ════════════════════════════════════════════════════
// PUBLIC API
// ════════════════════════════════════════════════════

function generateQuestion(skillId){
  const gen=GENERATORS[skillId];
  if(gen){try{return gen();}catch(e){console.warn("Generator error",skillId,e);}}
  // Smart fallback: never returns plain arithmetic for non-arithmetic skills
  return{type:"input",typeBadge:"Practice",question:`What is <strong>${rnd(2,12)} × ${rnd(2,12)}</strong>?`,answer:String(rnd(2,12)*rnd(2,12))};
}

function generateSessionQuestions(skillId,count=10){
  const qs=[];
  for(let i=0;i<count;i++)qs.push(generateQuestion(skillId));
  return qs;
}
