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
  // Original Boeing-737-style twin-engine narrow-body airliner: a long tapered
  // fuselage, swept wings, blue winglets, tall tail, two underwing turbofans,
  // cockpit glazing and two rows of passenger windows. No Boeing branding.
  function plane(){
    const root=new THREE.Group();
    const body=new THREE.Group();
    body.position.y=1.55;
    root.add(body);

    // Lathe is rotated so its longitudinal axis is +X (nose forward).
    const profile=[
      [0,-1.93],[.12,-1.91],[.25,-1.7],[.31,-1.44],
      [.34,-1.18],[.355,-.55],[.36,.65],[.34,1.18],
      [.29,1.48],[.19,1.77],[0,1.93]
    ].map(([radius,x])=>new THREE.Vector2(radius,x));
    add(body,new THREE.LatheGeometry(profile,32),m.white,0,0,0,0,0,-Math.PI/2);

    function wing(side,stabilizer=false){
      const shape=new THREE.Shape();
      if(!stabilizer){
        shape.moveTo(.50,side*.25);
        shape.lineTo(-.68,side*.25);
        shape.lineTo(-1.21,side*1.98);
        shape.lineTo(-.94,side*2.10);
        shape.lineTo(-.48,side*1.82);
      }else{
        shape.moveTo(-1.34,side*.19);
        shape.lineTo(-1.87,side*.19);
        shape.lineTo(-2.02,side*.93);
        shape.lineTo(-1.83,side*1.0);
        shape.lineTo(-1.56,side*.83);
      }
      shape.closePath();
      const geo=new THREE.ExtrudeGeometry(shape,{
        depth:stabilizer?.065:.095,bevelEnabled:true,
        bevelSize:.022,bevelThickness:.018,bevelSegments:2
      });
      add(body,geo,m.white,0,stabilizer?.15:-.055,0,-Math.PI/2);
    }

    for(const side of [-1,1]){
      wing(side);
      wing(side,true);
      // Distinct commercial-airliner winglets.
      const winglet=box(body,.19,.34,.075,m.planeBlue,-1.04,.12,side*2.03);
      winglet.rotation.x=side*.20;
      // Turbofans sit below and slightly ahead of the swept wings.
      add(body,new THREE.CylinderGeometry(.20,.17,.68,20),m.white,
        .19,-.37,side*.98,0,0,-Math.PI/2);
      add(body,new THREE.CylinderGeometry(.145,.145,.023,20),m.glass,
        .54,-.37,side*.98,0,0,-Math.PI/2);
      add(body,new THREE.TorusGeometry(.153,.029,8,22),m.silver,
        .55,-.37,side*.98,0,Math.PI/2,0);
      ball(body,m.silver,.053,.56,-.37,side*.98);
      // Blue cabin stripe and regularly spaced passenger windows.
      box(body,2.80,.046,.038,m.blue,-.025,-.12,side*.345);
      for(let i=0;i<10;i++){
        ball(body,m.glass,.045,-1.30+i*.262,.105,side*.337,.82,.74,.36);
      }
      // Slanted cockpit side windows near the curved nose.
      const cockpit=ball(body,m.glass,.15,1.54,.16,side*.18,1.20,.56,.54);
      cockpit.rotation.z=-.28;
    }

    // Upright rear stabilizer with a recognizable blue airline tail.
    const fin=new THREE.Shape();
    fin.moveTo(-1.90,.19);
    fin.lineTo(-1.50,.95);
    fin.lineTo(-1.24,.95);
    fin.lineTo(-1.34,.19);
    fin.closePath();
    add(body,new THREE.ExtrudeGeometry(fin,{
      depth:.10,bevelEnabled:true,bevelSize:.018,
      bevelThickness:.025,bevelSegments:2
    }),m.planeBlue,0,0,-.05);

    // Thin luminous lines follow the rearward (-X) axis. They are never
    // visible when the page is stationary.
    const speedLines=new THREE.Group();
    const blueTrail=new THREE.MeshBasicMaterial({
      color:0x52a8ff,transparent:true,opacity:.78,depthWrite:false
    });
    const whiteTrail=new THREE.MeshBasicMaterial({
      color:0xd5eaff,transparent:true,opacity:.68,depthWrite:false
    });
    for(const [x,y,z,w,material] of [
      [-2.40,.20,-.19,1.12,blueTrail],
      [-2.26,-.20,.17,.87,whiteTrail],
      [-2.45,-.07,.36,1.00,blueTrail],
      [-2.27,.28,.27,.72,whiteTrail]
    ]){
      const streak=box(speedLines,w,.018,.022,material,x,y,z);
      streak.rotation.z=.045;
    }
    body.add(speedLines);
    speedLines.visible=false;
    root.userData.speedLines=speedLines;
    root.rotation.y=.28;
    root.scale.setScalar(.77);
    return root;
  }
  const student=person(false),grown=person(true),airliner=plane();
  const figures={walk:student.root,plane:airliner,run:grown.root};
  Object.values(figures).forEach(f=>{f.visible=false;scene.add(f);});
  figures.walk.visible=true;
  let mode="walk",from=null,transitionAt=0,visible=false,playing=false;
  let lastFrame=null,gaitClock=0,gaitBlend=0,planeBank=0,planeYaw=.28;
  const baseScales={
    walk:figures.walk.scale.x,plane:figures.plane.scale.x,
    run:figures.run.scale.x
  };
  const speedLines=airliner.userData.speedLines;

  function position(p){
    if(!p?.width||!p?.height)return;
    host.style.left=(100*p.x/p.width)+"%";
    host.style.top=(100*p.y/p.height)+"%";
    host.classList.toggle("is-plane",p.mode==="plane");

    // Anchor the projected feet (or airplane's fuselage center) exactly
    // at the same SVG path point that controls the blue stroke.
    camera.updateMatrixWorld();
    const attachment=new THREE.Vector3(0,p.mode==="plane"?1.55:0,0).project(camera);
    host.style.transform="translate(-50%, -"+((1-attachment.y)*50)+"%)";

    if(figures[p.mode]&&p.mode!==mode){
      from=mode;
      mode=p.mode;
      transitionAt=performance.now();
      figures[mode].visible=true;
    }

    // Passenger aircraft remains predominantly level, with a small bank
    // into the path rather than spinning like a spacecraft around bends.
    const tangent=(p.angle||0)*Math.PI/180;
    planeBank=Math.max(-.19,Math.min(.19,-tangent*.12));
    planeYaw=.28+((p.dx||1)<0?-.16:.16);
    const face=(p.dx||1)<0?-.32:.32;
    student.figure.rotation.y=face;
    grown.figure.rotation.y=face;
    renderer.render(scene,camera);
  }

  function animate(t){
    if(!playing)return;
    if(!visible||document.hidden){
      playing=false;
      lastFrame=null;
      return;
    }
    const dt=lastFrame===null?0:Math.max(0,Math.min(.05,(t-lastFrame)/1000));
    lastFrame=t;
    const time=t*.001;
    const moving=container.classList.contains("journey-is-moving");

    // Pause walking/running as soon as scrolling has settled. Keeping the
    // gait phase still (rather than looping on wall time) avoids foot sliding.
    // The 100-ms blend returns the arms/legs to a natural standing position.
    gaitBlend+=(Number(moving)-gaitBlend)*Math.min(1,dt*15);
    if(moving)gaitClock+=dt*(mode==="run"?15.5:7.5);
    for(const [rig,name,amp] of [[student,"walk",.43],[grown,"run",.67]]){
      const stride=mode===name?amp*gaitBlend:0;
      rig.legs.forEach((leg,i)=>{
        leg.rotation.x=Math.sin(gaitClock+i*Math.PI)*stride;
      });
      rig.arms.forEach((arm,i)=>{
        arm.rotation.x=-Math.sin(gaitClock+i*Math.PI)*stride*.76;
      });
    }

    // No flight speed streaks while idle. Only the airplane gently
    // floats / rocks in place; its animated trail appears while scrolling.
    airliner.position.y=mode==="plane"?
      Math.sin(time*1.85)*(moving?.015:.052):0;
    airliner.rotation.x=mode==="plane"?
      Math.sin(time*1.62)*(moving?.012:.028):0;
    airliner.rotation.y=planeYaw+
      (mode==="plane"&&!moving?Math.sin(time*1.15)*.025:0);
    airliner.rotation.z=planeBank+
      (mode==="plane"?Math.sin(time*1.43)*(moving?.009:.028):0);
    if(speedLines){
      speedLines.visible=mode==="plane"&&moving;
      if(speedLines.visible){
        speedLines.scale.x=.94+Math.sin(time*13)*.10;
        speedLines.position.x=-.025+Math.sin(time*10)*.04;
      }
    }

    if(from){
      const fraction=Math.min(1,(t-transitionAt)/230);
      figures[from].scale.setScalar(baseScales[from]*Math.max(.001,1-fraction));
      figures[mode].scale.setScalar(baseScales[mode]*Math.max(.001,fraction));
      figures[from].visible=fraction<1;
      figures[mode].visible=true;
      if(fraction>=1){
        figures[from].scale.setScalar(baseScales[from]);
        figures[mode].scale.setScalar(baseScales[mode]);
        from=null;
      }
    }
    for(const [name,obj] of Object.entries(figures)){
      if(name!==mode&&name!==from){
        obj.visible=false;
        obj.scale.setScalar(baseScales[name]);
      }
    }
    renderer.render(scene,camera);
    requestAnimationFrame(animate);
  }

  function resumeAnimation(){
    if(visible&&!document.hidden&&!playing){
      playing=true;
      lastFrame=null;
      requestAnimationFrame(animate);
    }
  }
  const observer=new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting;
    resumeAnimation();
  },{rootMargin:"200px"});
  document.addEventListener("visibilitychange",resumeAnimation);
  observer.observe(container);
  window.__journey3DUpdate=position;
  container.classList.add("journey-3d-ready");
  window.dispatchEvent(new Event("scroll"));
}
