/* Lista com rolagem e esmaecimento nas bordas: o topo some quando há conteúdo acima, a base quando há conteúdo abaixo.
   Barra fina no estilo Scroll-area da lib (alça #d6d3d1). Uso: scrollFade(el) depois de desenhar; a classe .sfade dá o estilo. */
(function(){
  const CSS=`
  .sfade{overflow:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#d6d3d1 transparent;--ft:0px;--fb:0px;
    -webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 var(--ft),#000 calc(100% - var(--fb)),transparent 100%);
            mask-image:linear-gradient(to bottom,transparent 0,#000 var(--ft),#000 calc(100% - var(--fb)),transparent 100%)}
  .sfade.ft{--ft:28px} .sfade.fb{--fb:28px}
  .sfade::-webkit-scrollbar{width:8px} .sfade::-webkit-scrollbar-thumb{background:#d6d3d1;border-radius:999px;border:2px solid transparent;background-clip:padding-box} .sfade::-webkit-scrollbar-track{background:transparent}`;
  const st=document.createElement('style'); st.textContent=CSS; document.head.appendChild(st);
  window.scrollFade=function(el, keepTop){
    if(!el) return; el.classList.add('sfade'); if(keepTop) el.scrollTop=keepTop;
    const u=()=>{ el.classList.toggle('ft', el.scrollTop>2); el.classList.toggle('fb', el.scrollTop+el.clientHeight < el.scrollHeight-2); };
    if(!el._sf){ el.addEventListener('scroll',u,{passive:true}); new ResizeObserver(u).observe(el); el._sf=1; }
    u();
  };
})();
