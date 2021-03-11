import React from 'react';
import './index.css';

import ctx from './classes/Data/Data';
import Engine from './classes/Engine/Engine';
import Pos from './classes/Pos/Pos';
import Physics from './classes/Physics/Physics';
import Audio from './classes/AudioSystem/AudioSystem';


const engine = new Engine();
const jumpAudio = new Audio('/assets/audio/jump.wav');
const collideAudio = new Audio('/assets/audio/quack.wav');

let jump = false;
let collide = false;
let keyDownLock = false;

function collide()
{
  if(collide == false)
    collideAudio.play();
    collide = true;
}

function clicked()
{
  jump = true;
  jumpAudio.play();
}

document.addEventListener("mousedown", () => clicked());
document.addEventListener("touchstart", () => clicked());
document.addEventListener(
  "keydown",
  (event) => {
    if (event.key !== ' ' || keyDownLock)
    {
      return;
    }
    
    keyDownLock = true;

    clicked();
  }
);
document.addEventListener(
  "keyup",
  (event) => {
    if (event.key !== ' ')
    {
      return;
    }
    
    keyDownLock = false;
  }
);

function Hero(props)
{
  const element = React.useRef(null);
  const [context, setContext] = React.useContext(ctx);

  const [collider, setCollider] = React.useState(
    new Pos({
      x: 100,
      y: window.innerHeight / 2,
    })
  );
  
  const physics = React.useMemo(() => {
    return new Physics(-10, 1);
  }, []);

  React.useEffect(() => {
    document.addEventListener('isColliding', (event) => {
      if (event?.detail?.items?.includes(props?.id))
      {
        collided();
        engine.stop();
      }
    });

    context[props?.id] = {
      'tag': 'player'
    };
    setContext({...context});
  }, []);

  React.useEffect(() => {
    function move()
    {
      if (jump)
      {
        physics.applyJump(collider);
        jump = false;
      }
      else
      {
        physics.applyGravity(collider);
      }

      setCollider(new Pos({...collider}));
    };

    engine.requestAnimationFrame(move);
  }, [collider]);
  
  let rotation = Math.atan2(physics.getVelocity(), 6) * 180 / Math.PI;

  if (rotation < -40)
  {
    rotation = -40;
  }

  if (rotation > 40)
  {
    rotation = 40;
  }

  const styleRoot = {
    position: `fixed`,
    willChange: `transform`,
    transform: `translate3d(${collider.x}px, ${collider.y}px, 0) rotate(${rotation}deg)`,
  };
  
  return (
    <svg ref={element} id={props?.id} style={styleRoot} height="50px" version="1.1" viewBox="0 0 72.695 54.52" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(-63.611 -84.325)">
        <g stroke="#28220b">
        <ellipse cx="98.366" cy="116.63" rx="31.759" ry="17.625" fill="#fc0" fillRule="evenodd" strokeWidth=".24745"/>
        <ellipse cx="95.883" cy="134.04" rx="8.6278" ry="4.6856" fill="#f60" strokeWidth=".24784"/>
        <ellipse cx="117.06" cy="97.553" rx="16.571" ry="13.096" fill="#fc0" strokeWidth=".26458"/>
        <ellipse cx="131.36" cy="100.83" rx="4.8109" ry="3.2741" fill="#f60" strokeWidth=".26458"/>
        </g>
        <g strokeWidth=".26458">
        <ellipse cx="119.67" cy="95.883" rx="3.1404" ry="3.1404" fill="#28220b"/>
        <path d="m69.832 110.85a10.758 4.744 0 0 1-6.0829-4.1265 10.758 4.744 0 0 1 5.4902-4.285 10.758 4.744 0 0 1 11.154 0.16847" fill="#fc0" stroke="#28220b"/>
        <path transform="matrix(1.2706 0 0 .70673 -26.92 30.601)" d="m92.163 110.46c7.0526-0.57349 13.065-1.0384 18.959 3.5441 2.8957 2.2515-0.93968 8.5576-2.8468 11.41-3.8818 5.8064-7.4472 9.4699-14.606 11.69-3.5174 1.0909-5.0289-0.49088-7.0157-3.2841-4.0439-5.6852-3.3033-11.785-2.8827-19.267 0.20662-3.6764 4.9272-3.8118 8.3922-4.0935z" fill="#fc0" stroke="#28220b"/>
        </g>
      </g>
    </svg>
  );
}
engine.addObject(<Hero id={'Hero'} />);

function Pipe(props)
{
  const element = React.useRef(null);
  const [context, setContext] = React.useContext(ctx);

  const [collider, setCollider] = React.useState(
    new Pos({
      x: props?.data?.x,
      y: props?.data?.y,
    })
  );

  React.useEffect(() => {
    context[props?.id] = {
      'tag': 'obstacle'
    };
    setContext({...context});
  }, []);

  React.useEffect(() => {
    function move()
    {
      if (collider.x > -108.91)
      {
        collider.x += -6;
      }
      else
      {
        collider.x += 6*600;
      }

      setCollider(new Pos({...collider}));
    };

    engine.requestAnimationFrame(move);
  }, [collider]);

  let rotation = 0;
  if (props?.data?.rotation != null)
  {
    rotation = props?.data?.rotation;
  }

  const styleRoot = {
    position: `fixed`,
    willChange: `transform`,
    transform: `translate3d(${collider.x}px, ${collider.y}px, 0) rotate(${rotation}deg)`,
  };

  return (
    <svg ref={element} id={props?.id} style={styleRoot} height="800px" version="1.1" viewBox="0 0 70 514.19" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(-65 8.2278)" fill="#999" stroke="#000" strokeLinejoin="round">
        <rect transform="scale(1,-1)" x="70.798" y="-505.16" width="58.404" height="478.4" rx="0" ry="0" imageRendering="auto" strokeWidth="1.5964" style={{mixBlendMode: 'normal'}}/>
        <rect transform="scale(1,-1)" x="65.694" y="-26.078" width="68.612" height="33.612" ry="5.2732" strokeWidth="1.3882" style={{mixBlendMode: 'normal'}}/>
      </g>
    </svg>
  );
}

function PipeSet(props)
{
  function getRandomInt(min, max)
  {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  const offset = 1000;
  const randomInt = getRandomInt(400, 800);

  const styleRoot = {

  };

  return (
    <span style={styleRoot}>
      <Pipe id={`${props?.id}_up`} data={{x: (600 * props?.data?.i) + 600, y: randomInt}}/>
      <Pipe id={`${props?.id}_down`} data={{x: ((600 * props?.data?.i) + 600), y: randomInt - offset, rotation: 180}}/>
    </span>
  );
}

function PipeGroup()
{
  let items = [];
  for (let i = 0; i < 6; i++)
  {
    items.push(<PipeSet key={i} id={i} data={{i: i}} />);
  }

  const styleRoot = {

  };

  return (
    <span style={styleRoot}>
      {items}
    </span>
  );
}
engine.addObject(<PipeGroup />);

function BackgroundImage({style, className})
{
  return (
    <>
      <svg className={className} style={style} width="1e3" height="300" version="1.1" viewBox="0 0 264.58 79.375" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(0 -33.928)">
          <rect x="-1.1102e-16" y="33.928" width="264.58" height="79.375" fill="#ffb380" fill-rule="evenodd"/>
          <g transform="matrix(.8446 0 0 .88327 23.452 3.3686)">
          <g fill-rule="evenodd" stroke="#24221c" stroke-linejoin="round" stroke-width=".565">
            <rect x="90.872" y="43.817" width="40.625" height="46.505" fill="#afe9dd"/>
            <rect x="90.872" y="43.817" width="12.428" height="34.344" fill="#5fd35f"/>
            <rect x="119.87" y="43.817" width="11.626" height="34.077" fill="#5fd35f"/>
          </g>
          <path d="m112.39 90.055-0.13364-46.238" fill="none" stroke="#000" stroke-width=".565"/>
          <path d="m103.43 66.268 16.303-0.13364" fill="none" stroke="#000" stroke-width=".565"/>
          </g>
          <rect x="159.56" y="69.538" width="86.061" height="2.5941" fill="#c87137" fill-rule="evenodd" stroke="#28170b" stroke-linejoin="round" stroke-width=".53072"/>
          <g transform="matrix(.90046 0 0 .884 16.985 3.8828)" fill-rule="evenodd" stroke="#28170b" stroke-linejoin="round" stroke-width=".565">
          <rect x="170.79" y="61.59" width="7.2163" height="12.428" fill="#ff8080"/>
          <rect x="173.16" y="57.835" width="2.7403" height="3.7325" fill="#de8787"/>
          </g>
          <g transform="matrix(1 0 0 .88235 0 3.9915)" fill-rule="evenodd" stroke="#28170b" stroke-linejoin="round" stroke-width=".565">
          <rect x="187.69" y="70.21" width="12.428" height="3.8754" fill="#f60"/>
          <rect x="189.56" y="68.74" width="9.0203" height="1.47" fill="#a40"/>
          </g>
          <g transform="matrix(.84238 0 0 .88235 37.242 3.9915)">
          <g stroke="#28220b">
            <ellipse transform="scale(-1,1)" cx="-240.12" cy="71.84" rx="3.2327" ry="1.7402" fill="#fc0" fill-rule="evenodd" stroke-width=".225"/>
            <ellipse transform="scale(-1,1)" cx="-240.38" cy="73.558" rx=".87823" ry=".46263" fill="#f60" stroke-width=".225"/>
            <ellipse transform="scale(-1,1)" cx="-238.22" cy="69.956" rx="1.6867" ry="1.293" fill="#fc0" stroke-width=".227"/>
            <ellipse transform="scale(-1,1)" cx="-236.76" cy="70.279" rx=".4897" ry=".32326" fill="#f60" stroke-width=".227"/>
          </g>
          <ellipse transform="scale(-1,1)" cx="-237.95" cy="69.791" rx=".31967" ry=".31006" fill="#28220b" stroke-width=".026525"/>
          <path transform="scale(-1,1)" d="m-243.03 71.269a1.095 0.4684 0 0 1-0.61918-0.40742 1.095 0.4684 0 0 1 0.55885-0.42308 1.095 0.4684 0 0 1 1.1354 0.01663" fill="#fc0" stroke="#28220b" stroke-width=".227"/>
          <path transform="matrix(-.12934 0 0 .069778 252.88 63.346)" d="m92.163 110.46c7.0526-0.57349 13.065-1.0384 18.959 3.5441 2.8957 2.2515-0.93968 8.5576-2.8468 11.41-3.8818 5.8064-7.4472 9.4699-14.606 11.69-3.5174 1.0909-5.0289-0.49088-7.0157-3.2841-4.0439-5.6852-3.3033-11.785-2.8827-19.267 0.20662-3.6764 4.9272-3.8118 8.3922-4.0935z" fill="#fc0" stroke="#28220b" stroke-width="2.3684"/>
          </g>
          <g transform="matrix(.83281 0 0 .88235 36.172 3.9915)" fill-rule="evenodd" stroke="#28170b" stroke-linejoin="round">
          <ellipse cx="223.64" cy="70.577" rx="7.2831" ry="3.5079" fill="#ff2a2a" stroke-width=".565"/>
          <rect x="222.49" y="64.096" width="2.2551" height="2.9901" fill="#ff8080" stroke-width=".565"/>
          </g>
          <g transform="matrix(1 0 0 .88235 0 3.9915)" fill-rule="evenodd" stroke-linejoin="round">
          <g fill="#e6e6e6" stroke="#28170b" stroke-width=".565">
            <rect x="174.26" y="105.16" width="76.573" height="16.972"/>
            <rect x="176.77" y="122.16" width="2.1686" height="1.4375"/>
            <rect x="247.31" y="122.16" width="2.2974" height="1.4366"/>
            <rect x="172.43" y="106.24" width="1.7718" height="1.0631"/>
          </g>
          <rect x="169.5" y="105.18" width="2.9057" height="2.9529" fill="#b3b3b3" stroke="#28170b" stroke-width=".565"/>
          <g fill="#a05a2c" stroke="#28220b">
            <rect x="15.502" y="90.99" width="58.131" height="1.7373" stroke-width=".427"/>
            <rect x="20.502" y="92.728" width="1.1326" height="30.934" stroke-width=".4283"/>
            <rect x="67.5" y="92.728" width="1.1327" height="30.928" stroke-width=".42827"/>
          </g>
          </g>
          <g transform="matrix(.88588 0 0 .88349 14.148 5.2351)" fill-rule="evenodd" stroke-linejoin="round">
          <rect x="20.847" y="44.619" width="25.925" height="27.261" fill="#cdde87" stroke="#a05a2c" stroke-width=".565"/>
          <ellipse cx="33.409" cy="57.715" rx="6.6817" ry="8.2854" fill="#fc0" stroke="#2b2200" stroke-width=".565"/>
          <g>
            <ellipse transform="rotate(2.2223)" cx="33.213" cy="54.664" rx="1.2762" ry="1.2628" stroke-width=".427"/>
            <ellipse transform="rotate(2.2223)" cx="38.226" cy="54.47" rx="1.2762" ry="1.2628" stroke-width=".427"/>
            <ellipse transform="matrix(.98914 .14695 .14695 -.98914 0 0)" cx="41.912" cy="-53.415" rx="2.4961" ry="1.211" stroke-width=".636"/>
          </g>
          <ellipse transform="matrix(.99281 -.11966 -.11966 -.99281 0 0)" cx="26.86" cy="-62.207" rx="4.3111" ry="1.211" fill="#fc0" stroke-width=".83584"/>
          <ellipse transform="matrix(.99923 .039128 -.038427 .99926 0 0)" cx="33.205" cy="54.64" rx="1.1359" ry="1.1342" fill="#fff" stroke-width=".38178"/>
          <ellipse transform="matrix(.99923 .039128 -.038427 .99926 0 0)" cx="38.207" cy="54.456" rx="1.1359" ry="1.1342" fill="#fff" stroke-width=".38178"/>
          <ellipse transform="matrix(.99954 .03025 -.049695 .99876 0 0)" cx="33.801" cy="54.909" rx=".21209" ry=".1638" stroke-width=".06269"/>
          <ellipse transform="matrix(.99954 .03025 -.049695 .99876 0 0)" cx="38.949" cy="54.695" rx=".21209" ry=".1638" stroke-width=".06269"/>
          </g>
        </g>
        </svg>
    </>
  );
}

function Background()
{
  const [x, setX] = React.useState(0);
  let offset = 0;
  const speed = 0.25;

  React.useEffect(() => {
    engine.requestAnimationFrame(() => {
      let change = x - speed;

      if (x < -294)
      {
        offset = offset - 294;
        change = 0;
      }

      setX(change)
    });
  }, [x]);

  return (
    <>
      <style jsx>{`
        .backgroundImageContainer
        {
          height: 100%;
          width: ${2*294}vh;
          background: #ffb380;
        }

        .backgroundImage
        {
          height: 100%;
          width: 294vh;
          will-change: transform;
        }
      `}</style>
      <div className="backgroundImageContainer">
        <BackgroundImage className="backgroundImage" style={{transform: `translate3d(${offset + x}vh, 0, -1px)`}} />
        <BackgroundImage className="backgroundImage" style={{transform: `translate3d(${offset + x+(speed*2)}vh, 0, -2px)`}} />
      </div>
    </>
  );
}
engine.setBackground(<Background />);

engine.start();
