/* Preflight: passed */
(function(){
  const $ = (id)=>document.getElementById(id);

  const PR_EXCLUDES = [
   "#ad", "#ads", "#sponsored", "#promo",
   "sponsored", "promotion", "giveaway",
   "affiliate", "referral", "use my code",
   "DM me", "link in bio"
  ];

  function splitWords(s){
    if(!s) return [];
    return s.replace(/，/g,",").split(/[\s,]+/).filter(Boolean);
  }

  function dateToken(d, start){
    if(!d) return "";
    const [y,m,dd]=d.split("-");
    return `${y}-${+m}-${+dd}_${start?"00:00:00":"23:59:59"}_JST`;
  }

  function build(){
    const q=$("q").value.trim();
    if(!q) return {q:"",len:0};

    const t=[q];

    const from=$("fromId").value.trim().replace(/^@/,"");
    if(from) t.push(`from:@${from}`);

    const ex=new Set(splitWords($("exclude").value));
    if($("excludePR").checked) PR_EXCLUDES.forEach(x=>ex.add(x));
    ex.forEach(w=>t.push(`-${w}`));

    if($("startDate").value) t.push(`since:${dateToken($("startDate").value,true)}`);
    if($("endDate").value) t.push(`until:${dateToken($("endDate").value,false)}`);

    if($("minFav").value) t.push(`min_faves:${$("minFav").value}`);
    if($("minRt").value) t.push(`min_retweets:${$("minRt").value}`);

    // media filter（動画優先）
    if($("onlyVideos").checked){
      t.push("filter:videos");
    }else if($("onlyImages").checked){
      t.push("filter:images");
    }

    const out=t.join(" ").replace(/\s+/g," ");
    return {q:out,len:out.length};
  }

  function render(){
    const r=build();
    $("out").textContent=r.q||"(ここに表示されます)";
    $("pillLen").textContent=`文字数: ${r.len}`;
  }

  function copy(){
    const r=build(); if(!r.q) return;
    navigator.clipboard.writeText(r.q);
  }

  function search(){
    const r=build(); if(!r.q) return;
    window.open("https://x.com/search?q="+encodeURIComponent(r.q)+"&f=live","_blank");
  }

  function reset(){
    document.querySelectorAll("input").forEach(i=>{
      if(i.type==="checkbox") i.checked=false;
      else i.value="";
    });
    $("advancedBox").open=false;
    render();
  }

  document.querySelectorAll("input").forEach(i=>{
    i.addEventListener("input",render);
    i.addEventListener("change",render);
  });

  $("btnCopy").onclick=copy;
  $("btnSearch").onclick=search;
  $("btnReset").onclick=reset;

  document.addEventListener("keydown",e=>{
    if((e.ctrlKey||e.metaKey)&&e.key==="Enter") search();
  });

  render();
})();
