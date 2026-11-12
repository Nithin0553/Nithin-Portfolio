import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

/* Original WebGL geometry: the student, airliner, and grown-up runner are
   real shaded 3D objects, not static image sprites. SVG art remains as fallback
   when the module or WebGL is unavailable. */
const journey=document.querySelector(".career-journey");
if(journey && !matchMedia("(prefers-reduced-motion: reduce)").matches) initJourney3D(journey);

function initJourney3D(container){
  let renderer;
  try { renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:"low-power"}); }
  catch(_) { return; }
  renderer.setClearColor(0x000000,0);
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
  renderer.setSize(190,210,false);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.35;
  const host=document.createElement("div");
  host.className="journey-3d-cursor";
  host.setAttribute("aria-hidden","true");
  host.appendChild(renderer.domElement);
  container.appendChild(host);
  const scene=new THREE.Scene();
  const camera=new THREE.OrthographicCamera(-2.1,2.1,2.35,-2.35,.01,60);
  camera.position.set(5.2,3.1,8.5);
  camera.lookAt(0,1.48,0);
  scene.add(new THREE.HemisphereLight(0xf2f6ff,0x27364a,3));
  const light=new THREE.DirectionalLight(0xffffff,3);
  light.position.set(-3,8,7);scene.add(light);
  const rim=new THREE.DirectionalLight(0x52a8ff,2.2);
  rim.position.set(5,4,-5);scene.add(rim);
  const mat=(c,metalness=0)=>new THREE.MeshStandardMaterial({color:c,roughness:metalness?.38:.76,metalness});
  const m={
    skin:mat(0xe3ae91), hair:mat(0x211d24),eye:mat(0x11161f),
    shirt:mat(0xf3f5f7), navy:mat(0x26334a),coat:mat(0x424653),
    pants:mat(0x536987), blue:mat(0x52a8ff,.16),
    pack:mat(0x2367a4), sole:mat(0x141821),
    glass:mat(0x091521,.28),white:mat(0xf5f7fb,.38),
    silver:mat(0xaab6c5,.65),planeBlue:mat(0x227dcc,.3)
  };
  const add=(parent,geo,material,x=0,y=0,z=0,rx=0,ry=0,rz=0)=>{
    const ob=new THREE.Mesh(geo,material);
    ob.position.set(x,y,z);ob.rotation.set(rx,ry,rz);parent.add(ob);return ob;
  };
  const ball=(p,material,r,x,y,z,sx=1,sy=1,sz=1)=>{
    const ob=add(p,new THREE.SphereGeometry(r,20,16),material,x,y,z);
    ob.scale.set(sx,sy,sz);return ob;
  };
  const box=(p,w,h,d,material,x,y,z)=>add(p,new THREE.BoxGeometry(w,h,d),material,x,y,z);
  const line=(p,pts,material,r=.018)=>{
    const curve=new THREE.CatmullRomCurve3(pts.map(x=>new THREE.Vector3(...x)));
    return add(p,new THREE.TubeGeometry(curve,12,r,6,false),material);
  };
  function person(adult){
    const root=new THREE.Group(),figure=new THREE.Group();
    root.add(figure);if(adult)figure.scale.setScalar(1.07);
    const legs=[],arms=[];
    ball(figure,adult?m.coat:m.navy,.59,0,1.83,0,.8,1,.49);
    if(adult){
      box(figure,.44,.79,.08,m.shirt,0,1.85,.29);
      add(figure,new THREE.ConeGeometry(.105,.47,3),m.blue,0,1.94,.36,0,0,Math.PI);
      for(const side of [-1,1]){
        const lapel=new THREE.Shape();
        lapel.moveTo(-.2,.32);lapel.lineTo(.05,.32);lapel.lineTo(.04,-.37);lapel.closePath();
        const geo=new THREE.ExtrudeGeometry(lapel,{depth:.045,bevelEnabled:true,bevelThickness:.02,bevelSize:.01,bevelSegments:2});
        const v=add(figure,geo,m.coat,side*.21,1.93,.29);v.scale.x=side;
      }
    } else {
      ball(figure,m.pack,.48,.12,1.86,-.41,.9,1.18,.65);
      for(const x of [-.3,.3])box(figure,.085,.71,.1,m.blue,x,1.89,.33);
      box(figure,.56,.14,.52,m.blue,0,2.24,0);
    }
    add(figure,new THREE.CylinderGeometry(.12,.13,.16,12),m.skin,0,2.39,0);
    ball(figure,m.skin,.35,0,2.68,.06,1,1.14,.89);
    ball(figure,m.hair,.36,0,2.89,-.07,1.08,.65,1.05);
    ball(figure,m.hair,.18,-.19,2.9,.13);
    for(const x of [-.12,.12]){
      ball(figure,m.eye,.03,x,2.72,.352);
      if(adult)add(figure,new THREE.TorusGeometry(.13,.025,7,20),m.glass,x*1.18,2.71,.365);
    }
    if(adult)box(figure,.16,.035,.035,m.glass,0,2.72,.39);
    ball(figure,m.skin,.065,0,2.62,.366,.82,.88,.72);
    line(figure,[[-.1,2.53,.33],[0,2.5,.374],[.1,2.53,.33]],m.eye,.014);
    for(const side of [-1,1]){
      const leg=new THREE.Group();leg.position.set(side*.23,1.27,0);
      add(leg,new THREE.CapsuleGeometry(.127,.61,5,12),adult?m.navy:m.pants,0,-.48);
      box(leg,.28,.17,.48,m.sole,0,-1.08,.19);
      figure.add(leg);legs.push(leg);
      const arm=new THREE.Group();arm.position.set(side*.51,2.17,0);
      add(arm,new THREE.CapsuleGeometry(.123,.58,5,12),adult?m.coat:m.navy,0,-.43);
      ball(arm,m.skin,.12,0,-.84,0);
      figure.add(arm);arms.push(arm);
    }
    return {root,figure,legs,arms};
  }
  function plane(){
    const root=new THREE.Group(),body=new THREE.Group();
    body.position.y=1.5;root.add(body);
    add(body,new THREE.CapsuleGeometry(.3,2.74,8,20),m.white,0,0,0,0,0,-Math.PI/2);
    add(body,new THREE.ConeGeometry(.29,.56,20),m.white,1.68,0,0,0,0,-Math.PI/2);
    add(body,new THREE.BoxGeometry(1.08,.09,3.23),m.white,-.23,-.035,0,0,-.23);
    add(body,new THREE.BoxGeometry(.68,.075,1.29),m.planeBlue,-1.42,.16,0,0,-.11);
    const tail=new THREE.Shape();tail.moveTo(-1.67,.14);tail.lineTo(-1.48,.88);tail.lineTo(-1.0,.2);tail.closePath();
    add(body,new THREE.ExtrudeGeometry(tail,{depth:.09,bevelEnabled:true,bevelThickness:.03,bevelSize:.02,bevelSegments:2}),m.planeBlue,0,0,-.04);
    for(const side of [-1,1]){
      add(body,new THREE.CapsuleGeometry(.14,.53,6,12),m.silver,-.18,-.29,side*.92,0,0,-Math.PI/2);
      add(body,new THREE.CylinderGeometry(.115,.115,.07,14),m.glass,.20,-.3,side*.92,0,0,-Math.PI/2);
    }
    for(let i=0;i<7;i++)ball(body,m.glass,.053,-1.06+i*.34,.13,.28,.9,.8,.65);
    box(body,2.7,.075,.05,m.blue,-.04,-.17,.30);
    ball(body,m.glass,.18,1.46,.11,.15);
    root.scale.setScalar(.88);
    return root;
  }
  const student=person(false),grown=person(true),airliner=plane();
  const figures={walk:student.root,plane:airliner,run:grown.root};
  Object.values(figures).forEach(f=>{f.visible=false;scene.add(f);});
  figures.walk.visible=true;
  let mode="walk",from=null,transitionAt=0,visible=false,playing=false;
  function position(p){
    if(!p?.width||!p?.height)return;
    host.style.left=(100*p.x/p.width)+"%";
    host.style.top=(100*p.y/p.height)+"%";
    host.classList.toggle("is-plane",p.mode==="plane");
    // Align the actual projected feet (or airplane center) with the route
    // point. This avoids the visual offset of a hard-coded CSS anchor.
    camera.updateMatrixWorld();
    const attachment = new THREE.Vector3(0,p.mode==="plane"?1.5:0,0).project(camera);
    const anchor=(1-attachment.y)*50;
    host.style.transform="translate(-50%, -"+anchor+"%)";
    if(figures[p.mode]&&p.mode!==mode){
      from=mode;mode=p.mode;transitionAt=performance.now();
      figures[mode].visible=true;
    }
    airliner.rotation.z=-Math.max(-1,Math.min(1,(p.angle||0)*Math.PI/180));
    const face=(p.dx||1)<0?-.32:.32;
    student.figure.rotation.y=face;
    grown.figure.rotation.y=face;
    renderer.render(scene,camera);
  }
  function animate(t){
    if(!playing)return;
    if(visible&&!document.hidden){
      const time=t*.001;
      for(const [model,name,speed,amount] of [[student,"walk",7,.4],[grown,"run",14,.63]]){
        const amp=mode===name?amount:0;
        model.legs.forEach((l,i)=>{l.rotation.x=Math.sin(time*speed+i*Math.PI)*amp;});
        model.arms.forEach((a,i)=>{a.rotation.x=-Math.sin(time*speed+i*Math.PI)*amp*.72;});
      }
      airliner.rotation.x=Math.sin(time*1.7)*.06;
      if(from){
        const step=Math.min(1,(t-transitionAt)/230);
        figures[from].scale.setScalar(Math.max(.001,1-step));
        figures[mode].scale.setScalar(Math.max(.001,step));
        if(step>=1){
          figures[from].visible=false;figures[from].scale.setScalar(1);
          figures[mode].scale.setScalar(1);from=null;
        }
      }
      renderer.render(scene,camera);
    }
    requestAnimationFrame(animate);
  }
  const observer=new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting;
    if(visible&&!playing){playing=true;requestAnimationFrame(animate);}
  },{rootMargin:"200px"});
  observer.observe(container);
  window.__journey3DUpdate=position;
  container.classList.add("journey-3d-ready");
  window.dispatchEvent(new Event("scroll"));
}
