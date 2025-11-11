const GLOBAL_SPEED_MULTIPLIER = 0.2;

function getContainerDimensions() {
  const container = document.querySelector(".orbit-container");
  const rect = container.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
    centerX: rect.width / 2,
    centerY: rect.height / 2,
  };
}

function calculateOrbitSizes() {
  const dims = getContainerDimensions();
  const baseWidth = 1400;
  const scale = Math.max(dims.width / baseWidth, 0.6);

  return [
    {
      el: document.getElementById("recruitment-path"),
      tailPath: document.getElementById("tail-recruitment"),
      dotStart: document.getElementById("dot-start-recruitment"),
      dotEnd: document.getElementById("dot-end-recruitment"),
      rx: 550 * scale,
      ry: 175 * scale,
      speed: 0.0008,
      angle: 0,
      tailLength: 0.9,
      ring: document.querySelector(".orbit-1"),
    },
    {
      el: document.getElementById("crm-path"),
      tailPath: document.getElementById("tail-crm"),
      dotStart: document.getElementById("dot-start-crm"),
      dotEnd: document.getElementById("dot-end-crm"),
      rx: 400 * scale,
      ry: 125 * scale,
      speed: 0.001,
      angle: 2.5,
      tailLength: 0.85,
      ring: document.querySelector(".orbit-2"),
    },
    {
      el: document.getElementById("reports-path"),
      tailPath: document.getElementById("tail-reports"),
      dotStart: document.getElementById("dot-start-reports"),
      dotEnd: document.getElementById("dot-end-reports"),
      rx: 475 * scale,
      ry: 150 * scale,
      speed: 0.0009,
      angle: 4.2,
      tailLength: 0.8,
      ring: document.querySelector(".orbit-3"),
    },
    {
      el: document.getElementById("people-path"),
      tailPath: document.getElementById("tail-people"),
      dotStart: document.getElementById("dot-start-people"),
      dotEnd: document.getElementById("dot-end-people"),
      rx: 625 * scale,
      ry: 200 * scale,
      speed: 0.0009,
      angle: 1.3,
      tailLength: 1.0,
      ring: document.querySelector(".orbit-4"),
    },
    {
      el: document.getElementById("project-path"),
      tailPath: document.getElementById("tail-project"),
      dotStart: document.getElementById("dot-start-project"),
      dotEnd: document.getElementById("dot-end-project"),
      rx: 325 * scale,
      ry: 100 * scale,
      speed: 0.0011,
      angle: 3.7,
      tailLength: 0.95,
      ring: document.querySelector(".orbit-5"),
    },
    {
      el: null,
      tailPath: null,
      dotStart: null,
      dotEnd: null,
      rx: 250 * scale, // smaller than orbit-5 rx
      ry: 70 * scale, // smaller than orbit-5 ry
      speed: 0,
      angle: 0,
      tailLength: 0,
      ring: document.querySelector(".orbit-6"),
    },
    {
      el: null,
      tailPath: null,
      dotStart: null,
      dotEnd: null,
      rx: 190 * scale,
      ry: 50 * scale,
      speed: 0,
      angle: 0,
      tailLength: 0,
      ring: document.querySelector(".orbit-7"),
    },
  ];
}

let orbits = calculateOrbitSizes();
let dims = getContainerDimensions();
let lastTime = Date.now();

const svg = document.querySelector(".orbit-tails");
svg.setAttribute("viewBox", `0 0 ${dims.width} ${dims.height}`);

function updateOrbitRings() {
  orbits.forEach((orbit) => {
    if (orbit.ring) {
      orbit.ring.style.width = orbit.rx * 2 + "px";
      orbit.ring.style.height = orbit.ry * 2 + "px";
    }
  });
}

updateOrbitRings();

window.addEventListener("resize", () => {
  dims = getContainerDimensions();
  orbits = calculateOrbitSizes();
  svg.setAttribute("viewBox", `0 0 ${dims.width} ${dims.height}`);
  updateOrbitRings();
});

function createTailPath(rx, ry, startAngle, endAngle, centerX, centerY) {
  let pathData = "";
  const steps = 30;
  const angleStep = (endAngle - startAngle) / steps;

  for (let i = 0; i <= steps; i++) {
    const angle = startAngle + angleStep * i;
    const x = centerX + rx * Math.cos(angle);
    const y = centerY + ry * Math.sin(angle);
    pathData += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }
  return pathData;
}

function animate() {
  const currentTime = Date.now();
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  const showTails = window.innerWidth > 991;

  orbits.forEach((orbit) => {
    if (orbit.el) {
      orbit.angle += orbit.speed * deltaTime * GLOBAL_SPEED_MULTIPLIER;

      const x = orbit.rx * Math.cos(orbit.angle);
      const y = orbit.ry * Math.sin(orbit.angle);

      orbit.el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;

      if (showTails && orbit.tailPath) {
        const tailStartAngle = orbit.angle - orbit.tailLength;
        const tailEndAngle = orbit.angle;
        const pathData = createTailPath(
          orbit.rx,
          orbit.ry,
          tailStartAngle,
          tailEndAngle,
          dims.centerX,
          dims.centerY
        );
        orbit.tailPath.setAttribute("d", pathData);

        orbit.dotStart.setAttribute(
          "cx",
          dims.centerX + orbit.rx * Math.cos(tailStartAngle)
        );
        orbit.dotStart.setAttribute(
          "cy",
          dims.centerY + orbit.ry * Math.sin(tailStartAngle)
        );
        orbit.dotEnd.setAttribute(
          "cx",
          dims.centerX + orbit.rx * Math.cos(tailEndAngle)
        );
        orbit.dotEnd.setAttribute(
          "cy",
          dims.centerY + orbit.ry * Math.sin(tailEndAngle)
        );
      }
    }
  });

  requestAnimationFrame(animate);
}

animate();
