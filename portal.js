let PORTAL=null;
let WITB_ROWS=[];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const dateFmt=s=>s?new Date(s+'T00:00:00').toLocaleDateString('en-AU',{day:'numeric',month:'long',year:'numeric'}):'';

async function pApi(path,opts={}){
  const r=await fetch('/.netlify/functions/'+path,opts);
  if(r.status===401)throw new Error('AUTH');
  if(!r.ok)throw new Error(await r.text());
  const ct=r.headers.get('content-type')||'';
  return ct.includes('json')?r.json():r.text();
}

function message(t,isError=false){
  portalMessage.textContent=t;
  portalMessage.hidden=false;
  portalMessage.style.color=isError?'#a21c1c':'';
  setTimeout(()=>portalMessage.hidden=true,4500);
}

function setupNav(){
  menuButton.onclick=()=>nav.classList.toggle('open');
  document.querySelectorAll('.nav-dropbtn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      if(window.innerWidth<=900)btn.parentElement.classList.toggle('open');
    });
  });
}

function normaliseWitb(p){
  if(Array.isArray(p?.witbItems)){
    return p.witbItems.map(x=>({
      club:x.club||'',
      brand:x.brand||'',
      model:x.model||'',
      shaft:x.shaft||'',
      grip:x.grip||'',
      photo:x.photo||'',
      modification:x.modification||'',
      bagStatus:x.bagStatus||'current'
    }));
  }
  if(typeof p?.witb==='string'&&p.witb.trim()){
    return [{
      club:'Other',brand:'',model:'',shaft:'',grip:'',photo:'',
      modification:p.witb.trim(),bagStatus:'current'
    }];
  }
  return [];
}

function blankClub(){
  return {club:'',brand:'',model:'',shaft:'',grip:'',photo:'',modification:'',bagStatus:'current'};
}

function clubOptions(value){
  const opts=['Driver','2 Wood','3 Wood','4 Wood','5 Wood','7 Wood','9 Wood','Hybrid','1 Iron','2 Iron','3 Iron','4 Iron','5 Iron','6 Iron','7 Iron','8 Iron','9 Iron','Pitching Wedge','Gap Wedge','Sand Wedge','Lob Wedge','Putter','Ball','Other'];
  return `<option value="">Choose club…</option>`+opts.map(o=>`<option ${o===value?'selected':''}>${o}</option>`).join('');
}

function statusOptions(value){
  const opts=[
    ['current','Currently in the Bag'],
    ['used-on-tour','Used on Tour — Not Currently in Bag']
  ];
  return opts.map(([v,l])=>`<option value="${v}" ${v===value?'selected':''}>${l}</option>`).join('');
}

function syncTextFields(){
  document.querySelectorAll('.w-club,.w-brand,.w-model,.w-shaft,.w-grip,.w-mod,.w-status').forEach(x=>{
    const i=+x.dataset.i;
    if(!WITB_ROWS[i])return;
    if(x.classList.contains('w-club'))WITB_ROWS[i].club=x.value;
    if(x.classList.contains('w-brand'))WITB_ROWS[i].brand=x.value;
    if(x.classList.contains('w-model'))WITB_ROWS[i].model=x.value;
    if(x.classList.contains('w-shaft'))WITB_ROWS[i].shaft=x.value;
    if(x.classList.contains('w-grip'))WITB_ROWS[i].grip=x.value;
    if(x.classList.contains('w-mod'))WITB_ROWS[i].modification=x.value;
    if(x.classList.contains('w-status'))WITB_ROWS[i].bagStatus=x.value;
  });
}

function renderWitbEditor(){
  const el=document.getElementById('witbEditor');
  if(!el)return;
  if(!WITB_ROWS.length)WITB_ROWS=[blankClub()];

  el.innerHTML=WITB_ROWS.map((r,i)=>`<div class="witb-edit-row">
    <div class="witb-edit-head">
      <div>
        <strong>Equipment ${i+1}</strong>
        <span class="status ${r.bagStatus==='used-on-tour'?'witb-used-status':''}">
          ${r.bagStatus==='used-on-tour'?'Used on Tour':'Currently in Bag'}
        </span>
      </div>
      <div class="witb-row-actions">
        <button type="button" class="secondary-button witb-switch" data-i="${i}">
          ${r.bagStatus==='used-on-tour'?'Move to Current Bag':'Move to Used on Tour'}
        </button>
        <button type="button" class="witb-remove danger-button" data-i="${i}">Remove</button>
      </div>
    </div>

    <div class="witb-fields">
      <label>Club
        <select class="w-club" data-i="${i}">${clubOptions(r.club)}</select>
      </label>
      <label>Brand
        <input class="w-brand" data-i="${i}" value="${esc(r.brand)}" placeholder="e.g. Titleist">
      </label>
      <label>Model
        <input class="w-model" data-i="${i}" value="${esc(r.model)}" placeholder="e.g. GT3 / 620 MB / SM10">
      </label>
      <label>Shaft
        <input class="w-shaft" data-i="${i}" value="${esc(r.shaft)}" placeholder="e.g. Project X 6.0">
      </label>
      <label>Grip
        <input class="w-grip" data-i="${i}" value="${esc(r.grip)}" placeholder="e.g. Golf Pride MCC">
      </label>
      <label>Bag Status
        <select class="w-status" data-i="${i}">${statusOptions(r.bagStatus||'current')}</select>
      </label>
      <label>Photo
        <input class="w-photo" data-i="${i}" type="file" accept="image/*">
      </label>
      <label>Modification
        <input class="w-mod" data-i="${i}" value="${esc(r.modification)}" placeholder="e.g. 1° flat, lead tape, cut 0.5 inch">
      </label>
    </div>

    ${r.photo?`<div class="witb-photo-preview"><img src="${esc(r.photo)}" alt="${esc(r.club||'Club')} photo"></div>`:''}
  </div>`).join('');

  document.querySelectorAll('.witb-remove').forEach(b=>{
    b.onclick=()=>{
      WITB_ROWS.splice(+b.dataset.i,1);
      renderWitbEditor();
    };
  });

  document.querySelectorAll('.witb-switch').forEach(b=>{
    b.onclick=()=>{
      const i=+b.dataset.i;
      WITB_ROWS[i].bagStatus=WITB_ROWS[i].bagStatus==='used-on-tour'?'current':'used-on-tour';
      renderWitbEditor();
    };
  });

  document.querySelectorAll('.w-club,.w-brand,.w-model,.w-shaft,.w-grip,.w-mod,.w-status').forEach(x=>{
    x.addEventListener('input',syncTextFields);
    x.addEventListener('change',syncTextFields);
  });
}

async function loadPortal(){
  PORTAL=await pApi('portal',{cache:'no-store'});
  portalLogin.hidden=true;
  portalContent.hidden=false;
  renderPortal();
}

function renderPortal(){
  const m=PORTAL.member,p=PORTAL.player;
  portalWelcome.textContent=p?`Welcome, ${p.name}`:`Welcome, ${m.username}`;

  const img=p&&p.image?p.image:'images/logo.png';
  membershipCard.innerHTML=`<div class="membership-card">
    <img class="membership-photo" src="${esc(img)}" alt="Member photo">
    <div class="membership-info">
      <p class="eyebrow">The Travellers Tour</p>
      <h2>${esc(p?p.name:m.username)}</h2>
      <div class="member-fields">
        <div><small>Member ID</small><strong>${esc(m.memberId||'—')}</strong></div>
        <div><small>Member Since</small><strong>${esc(m.memberSince||'—')}</strong></div>
        <div><small>Status</small><strong>${esc(m.status||'Tour Member')}</strong></div>
        <div><small>Card Level</small><strong>${esc(m.cardLevel||'Member')}</strong></div>
        <div><small>Valid Through</small><strong>${esc(m.validThrough||'—')}</strong></div>
      </div>
    </div>
  </div>`;

  if(p){
    portalStats.innerHTML=[
      ['Season Points',p.points||0],
      ['Wins',p.wins||0],
      ['2nd Places',p.seconds||0],
      ['Majors',p.majors||0],
      ['MVP Points',p.mvp||0]
    ].map(x=>`<div class="portal-stat"><span class="meta">${x[0]}</span><strong>${x[1]}</strong></div>`).join('');

    profileBio.value=p.bio||'';
    WITB_ROWS=normaliseWitb(p);
    renderWitbEditor();

    if(p.image){
      profilePreview.src=p.image;
      profilePreview.hidden=false;
    }else{
      profilePreview.hidden=true;
    }

    const saveBtn=profileForm.querySelector('button[type="submit"],button.button');
    if(saveBtn)saveBtn.disabled=false;
  }else{
    portalStats.innerHTML='<p class="meta">This login is not linked to a player profile yet. Ask the Tour Admin to link it.</p>';
    profileBio.value='';
    WITB_ROWS=[];
    renderWitbEditor();
    const saveBtn=profileForm.querySelector('button[type="submit"],button.button');
    if(saveBtn)saveBtn.disabled=true;
  }

  portalAttendance.innerHTML=PORTAL.tournaments.length?PORTAL.tournaments.map(t=>{
    const own=t.ownAttendance||'';
    return `<div class="attendance-event">
      <strong>${esc(t.name)}</strong>
      <div class="meta">${dateFmt(t.date)} · ${esc(t.course)}</div>
      <div class="rsvp-buttons">
        <button type="button" class="rsvp-button ${own==='going'?'active':''}" data-id="${esc(t.id)}" data-status="going">Going</button>
        <button type="button" class="rsvp-button ${own==='maybe'?'active':''}" data-id="${esc(t.id)}" data-status="maybe">Maybe</button>
        <button type="button" class="rsvp-button ${own==='not-going'?'active':''}" data-id="${esc(t.id)}" data-status="not-going">Not Going</button>
      </div>
    </div>`;
  }).join(''):'<p class="meta">No upcoming events.</p>';

  document.querySelectorAll('.rsvp-button').forEach(b=>{
    b.onclick=async()=>{
      await pApi('portal',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({action:'attendance',tournamentId:b.dataset.id,status:b.dataset.status})
      });
      await loadPortal();
      message('Attendance updated.');
    };
  });

  portalPolls.innerHTML=PORTAL.polls.length?PORTAL.polls.map(poll=>`<div class="poll-card">
    <strong>${esc(poll.question)}</strong>
    <div class="poll-options">
      ${poll.options.map((o,i)=>`<button type="button" class="poll-option ${poll.ownVote===i?'selected':''}" data-poll="${esc(poll.id)}" data-option="${i}">
        <span>${esc(o.text)}</span><span class="poll-count">${o.count} vote${o.count===1?'':'s'}</span>
      </button>`).join('')}
    </div>
  </div>`).join(''):'<p class="meta">There are no open polls right now.</p>';

  document.querySelectorAll('.poll-option').forEach(b=>{
    b.onclick=async()=>{
      await pApi('portal',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({action:'vote',pollId:b.dataset.poll,optionIndex:+b.dataset.option})
      });
      await loadPortal();
      message('Vote saved.');
    };
  });
}

portalLoginForm.onsubmit=async e=>{
  e.preventDefault();
  portalLoginError.hidden=true;
  try{
    await pApi('player-login',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({username:portalUsername.value.trim(),password:portalPassword.value})
    });
    portalPassword.value='';
    await loadPortal();
  }catch{
    portalLoginError.hidden=false;
  }
};

document.getElementById('addWitbRow').onclick=()=>{
  syncTextFields();
  WITB_ROWS.push(blankClub());
  renderWitbEditor();
};

profileForm.onsubmit=async e=>{
  e.preventDefault();
  syncTextFields();

  const saveBtn=profileForm.querySelector('button[type="submit"],button.button');
  if(saveBtn){
    saveBtn.disabled=true;
    saveBtn.textContent='Saving...';
  }

  try{
    let image='';
    if(profileImage.files[0]){
      const fd=new FormData();
      fd.append('file',profileImage.files[0]);
      const r=await pApi('portal-upload',{method:'POST',body:fd});
      image=r.url;
    }

    const photoInputs=[...document.querySelectorAll('.w-photo')];
    for(const input of photoInputs){
      if(input.files[0]){
        const i=+input.dataset.i;
        const fd=new FormData();
        fd.append('file',input.files[0]);
        const r=await pApi('portal-upload',{method:'POST',body:fd});
        if(WITB_ROWS[i])WITB_ROWS[i].photo=r.url;
      }
    }

    const cleaned=WITB_ROWS.filter(r=>
      [r.club,r.brand,r.model,r.shaft,r.grip,r.photo,r.modification].some(v=>String(v||'').trim())
    );

    await pApi('portal',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        action:'profile',
        bio:profileBio.value.trim(),
        witbItems:cleaned,
        image
      })
    });

    profileImage.value='';
    await loadPortal();
    message('Profile and equipment saved.');
  }catch(err){
    console.error(err);
    message('Could not save changes. Please try again.',true);
  }finally{
    if(saveBtn){
      saveBtn.disabled=false;
      saveBtn.textContent='Save Profile';
    }
  }
};

portalLogout.onclick=async()=>{
  await pApi('player-logout',{method:'POST'});
  location.reload();
};

setupNav();
loadPortal().catch(()=>{});