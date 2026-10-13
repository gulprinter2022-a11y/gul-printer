(()=> {
  const API='https://wuimmoxrcichlwwpnzbf.supabase.co/rest/v1';
  const KEY='sb_publishable_a93iXNGXcc3tdky9guWfIQ_VvEoQz3X';
  const headers={apikey:KEY};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const lang=()=>document.documentElement.lang==='ur'||localStorage.getItem('gp-lang')==='ur'?'ur':'en';
  const pick=(row,en,ur)=>lang()==='ur'?(row?.[ur]||row?.[en]||''):(row?.[en]||row?.[ur]||'');
  async function get(table,params=''){
    try{
      const r=await fetch(API+'/'+table+(params?'?'+params:''),{headers});
      if(!r.ok) return [];
      return await r.json();
    }catch(_){ return []; }
  }
  function injectStyles(){
    if(document.getElementById('gp-cms-style')) return;
    const s=document.createElement('style'); s.id='gp-cms-style';
    s.textContent='.gp-work{position:relative;overflow:hidden;border-radius:20px;background:#eef5f8;border:1px solid #dce8ee;aspect-ratio:1/1}.gp-work img{width:100%;height:100%;object-fit:cover;display:block;transition:.25s}.gp-work:hover img{transform:scale(1.025)}.gp-work-info{position:absolute;left:0;right:0;bottom:0;padding:28px 15px 13px;background:linear-gradient(transparent,rgba(7,34,49,.82));color:#fff}.gp-work-info strong{display:block;font-size:14px;line-height:1.4}.gp-work-info small{opacity:.85}.gp-client-logo{max-width:110px;max-height:68px;object-fit:contain;margin:0 auto 10px}.gp-founder-photo{width:100%;height:100%;object-fit:cover;border-radius:26px}.gp-empty{grid-column:1/-1;text-align:center;padding:28px;border:1px dashed #c8d7df;border-radius:18px;color:#78909c}';
    document.head.appendChild(s);
  }

  let homeData=null, founderData=null, businessData=null;

  async function loadBusiness(){
    const rows=await get('business_info','select=*&id=eq.1&limit=1');
    businessData=rows[0]||null;
    window.GP_BUSINESS=businessData;
    applyBusiness();
  }
  function normPhone(v){return String(v||'').replace(/\D/g,'').replace(/^0/,'92')}
  function applyBusiness(){
    const b=businessData;if(!b)return;
    const L=lang();
    const addr=L==='ur'?(b.address_ur||b.address_en):(b.address_en||b.address_ur);
    const holiday=L==='ur'?(b.weekly_holiday_ur||b.weekly_holiday_en):(b.weekly_holiday_en||b.weekly_holiday_ur);
    const set=(id,val)=>{const e=document.getElementById(id);if(e&&val)e.textContent=val};
    set('cmsPhone',b.phone);set('cmsWhatsapp',b.whatsapp);set('cmsEmail',b.email);set('cmsAddress',addr);set('cmsHoliday',holiday);set('cmsHeroAddress',addr);document.querySelectorAll('[data-cms-phone-text]').forEach(e=>{if(b.phone)e.textContent=b.phone});document.querySelectorAll('[data-cms-whatsapp-text]').forEach(e=>{if(b.whatsapp)e.textContent=b.whatsapp});document.querySelectorAll('[data-cms-email-text]').forEach(e=>{if(b.email)e.textContent=b.email});document.querySelectorAll('[data-cms-address-text]').forEach(e=>{if(addr)e.textContent=addr});document.querySelectorAll('[data-cms-holiday-text]').forEach(e=>{if(holiday)e.textContent=holiday});
    const wa=normPhone(b.whatsapp||b.phone);
    document.querySelectorAll('a[data-cms-wa],a[href*="wa.me/923169827450"]').forEach(a=>{const msg=L==='ur'?(b.whatsapp_default_message_ur||b.whatsapp_default_message_en):(b.whatsapp_default_message_en||b.whatsapp_default_message_ur);a.href='https://wa.me/'+wa+'?text='+encodeURIComponent(msg||'Assalam-o-Alaikum');});
    document.querySelectorAll('a[data-cms-call]').forEach(a=>a.href='tel:+'+normPhone(b.phone));
    const map=document.getElementById('cmsMapLink');if(map&&b.google_maps_url)map.href=b.google_maps_url;document.querySelectorAll('a[data-cms-map]').forEach(a=>{if(b.google_maps_url)a.href=b.google_maps_url});
    const fb=document.getElementById('cmsFacebook');if(fb&&b.facebook_url)fb.href=b.facebook_url;document.querySelectorAll('a[data-cms-facebook]').forEach(a=>{if(b.facebook_url)a.href=b.facebook_url});
    const ig=document.getElementById('cmsInstagram');if(ig&&b.instagram_url)ig.href=b.instagram_url;document.querySelectorAll('a[data-cms-instagram]').forEach(a=>{if(b.instagram_url)a.href=b.instagram_url});
    const tt=document.getElementById('cmsTikTok');if(tt&&b.tiktok_url)tt.href=b.tiktok_url;document.querySelectorAll('a[data-cms-tiktok]').forEach(a=>{if(b.tiktok_url)a.href=b.tiktok_url});
  }

  async function loadHome(){
    const results=await Promise.all([
      get('homepage_content','select=*&id=eq.1&limit=1'),
      get('portfolio','select=*&is_visible=eq.true&order=display_order.asc,created_at.desc'),
      get('clients','select=*&is_visible=eq.true&order=display_order.asc,created_at.desc'),
      get('testimonials','select=*&is_visible=eq.true&verified=eq.true&order=display_order.asc,created_at.desc')
    ]);
    homeData={home:results[0][0]||null,portfolio:results[1],clients:results[2],testimonials:results[3]};
    applyHome();
  }
  function applyHome(){
    if(!homeData)return; const L=lang(), h=homeData.home;
    const tagline=document.getElementById('cmsHomeTagline');
    const intro=document.getElementById('cmsHomeIntro');
    if(tagline&&h){const v=L==='ur'?(h.tagline_ur||h.tagline_en):(h.tagline_en||h.tagline_ur);if(v)tagline.textContent=v}
    if(intro&&h){const v=L==='ur'?(h.intro_ur||h.intro_en):(h.intro_en||h.intro_ur);if(v)intro.textContent=v}
    const pbox=document.getElementById('cmsHomePortfolio');
    if(pbox){
      let list=homeData.portfolio.filter(x=>x.featured); if(!list.length)list=homeData.portfolio; list=list.slice(0,6);
      if(list.length)pbox.innerHTML=list.map(x=>'<a class="gp-work" href="/portfolio.html"><img loading="lazy" src="'+esc(x.image_url)+'" alt="'+esc(pick(x,'title_en','title_ur'))+'"><div class="gp-work-info"><strong>'+esc(pick(x,'title_en','title_ur'))+'</strong><small>'+esc(x.category||'')+'</small></div></a>').join('');
    }
    const cbox=document.getElementById('cmsHomeClients');
    if(cbox){
      let list=homeData.clients.filter(x=>x.featured); if(!list.length)list=homeData.clients; list=list.slice(0,8);
      if(list.length)cbox.innerHTML=list.map(x=>'<div class="client-slot">'+(x.logo_url?'<img class="gp-client-logo" loading="lazy" src="'+esc(x.logo_url)+'" alt="'+esc(x.name)+'">':'')+'<strong>'+esc(x.name)+'</strong></div>').join('');
    }
    const tbox=document.getElementById('cmsHomeTestimonials');
    if(tbox){
      let list=homeData.testimonials.filter(x=>x.featured); if(!list.length)list=homeData.testimonials; list=list.slice(0,3);
      if(list.length)tbox.innerHTML=list.map(x=>'<article class="testimonial-card"><div class="quote-mark">“</div><p>'+esc(L==='ur'?(x.review_ur||x.review_en):(x.review_en||x.review_ur))+'</p><strong>'+esc(x.customer_name)+'</strong>'+(x.organization?'<small>'+esc(x.organization)+'</small>':'')+'</article>').join('');
    }
  }

  async function loadPortfolio(){
    const grid=document.getElementById('grid');if(!grid)return;
    const list=await get('portfolio','select=*&is_visible=eq.true&order=display_order.asc,created_at.desc');
    if(!list.length)return;
    const filters=document.getElementById('filters'), loadMore=document.getElementById('loadMore');
    const cats=[...new Set(list.map(x=>x.category).filter(Boolean))];
    filters.innerHTML='<button class="filter active" data-cat="all">All</button>'+cats.map((c,i)=>'<button class="filter" data-cat="c'+i+'">'+esc(c)+'</button>').join('');
    const map=new Map(cats.map((c,i)=>[c,'c'+i]));
    grid.innerHTML=list.map(x=>'<div class="work gp-work" data-cat="'+esc(map.get(x.category)||'')+'"><img loading="lazy" src="'+esc(x.image_url)+'" alt="'+esc(pick(x,'title_en','title_ur'))+'"><div class="gp-work-info"><strong>'+esc(pick(x,'title_en','title_ur'))+'</strong><small>'+esc(x.category||'')+'</small></div></div>').join('');
    if(loadMore)loadMore.style.display='none';
    filters.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{
      filters.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
      const cat=btn.dataset.cat;grid.querySelectorAll('.work').forEach(w=>w.style.display=(cat==='all'||w.dataset.cat===cat)?'block':'none');
      const label=btn.textContent.trim(),ct=document.getElementById('ctaTitle'),cx=document.getElementById('ctaText'),cl=document.getElementById('ctaLink');
      if(ct)ct.textContent=cat==='all'?'Need a specific sample?':'Ask about '+label;
      if(cx)cx.textContent=cat==='all'?'Tell us the item name on WhatsApp and we’ll guide you to relevant work.':'Need more '+label+' samples or printing information? Send us a message.';
      if(cl&&businessData){const wa=normPhone(businessData.whatsapp||businessData.phone);cl.href='https://wa.me/'+wa+'?text='+encodeURIComponent(cat==='all'?'Assalam-o-Alaikum, I want to see samples for a specific printing item.':'Assalam-o-Alaikum, I want information and samples for '+label+'.')}
    }));
  }

  async function loadFounder(){
    if(!document.getElementById('cmsFounderName'))return;
    const rows=await get('founder','select=*&id=eq.1&limit=1'); founderData=rows[0]||null; applyFounder();
  }
  function applyFounder(){
    const f=founderData;if(!f)return;const L=lang();
    const set=(id,val)=>{const e=document.getElementById(id);if(e&&val)e.textContent=val};
    set('cmsFounderName',f.name);
    set('cmsFounderDesignation',L==='ur'?(f.designation_ur||f.designation_en):(f.designation_en||f.designation_ur));
    set('cmsFounderBio',L==='ur'?(f.bio_ur||f.bio_en):(f.bio_en||f.bio_ur));
    const ph=document.getElementById('cmsFounderPhoto');if(ph&&f.photo_url)ph.innerHTML='<img class="gp-founder-photo" src="'+esc(f.photo_url)+'" alt="'+esc(f.name||'Founder')+'">';
    const q=document.getElementById('cmsFounderQualifications');const raw=L==='ur'?(f.qualifications_ur||f.qualifications_en):(f.qualifications_en||f.qualifications_ur);
    if(q&&raw){const parts=raw.split(/\n|•/).map(x=>x.trim()).filter(Boolean);q.innerHTML=parts.map(x=>'<div class="q">'+esc(x)+'</div>').join('')}
  }

  window.gpApplyCmsLanguage=()=>{applyHome();applyFounder();applyBusiness()};
  injectStyles();
  const path=location.pathname;
  loadBusiness();
  if(path==='/'||path.endsWith('/index.html'))loadHome();
  if(path.endsWith('/portfolio.html'))loadPortfolio();
  if(path.endsWith('/about.html'))loadFounder();
  document.querySelectorAll('#lang-toggle,#langBtn').forEach(b=>b.addEventListener('click',()=>setTimeout(()=>window.gpApplyCmsLanguage(),0)));
})();