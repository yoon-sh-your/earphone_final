function loco(){
  gsap.registerPlugin(ScrollTrigger);

// Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

const locoScroll = new LocomotiveScroll({
  el: document.querySelector("#main"),
  smooth: true
});
// each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
locoScroll.on("scroll", ScrollTrigger.update);

// tell ScrollTrigger to use these proxy methods for the "#main" element since Locomotive Scroll is hijacking things
ScrollTrigger.scrollerProxy("#main", {
  scrollTop(value) {
    return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
  }, // we don't have to define a scrollLeft because we're only scrolling vertically.
  getBoundingClientRect() {
    return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
  },
  // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
  pinType: document.querySelector("#main").style.transform ? "transform" : "fixed"
});




// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

// after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
ScrollTrigger.refresh();

}

loco()


// 요소 선택 및 변수 선언
let nextButton = document.querySelector('#next');
let prevButton = document.querySelector('#prev');
let backButton = document.querySelector('#back');
let seeMoreButton = document.querySelector('.seeMore');
let carousel = document.querySelector('.carousel');
let listHTML = document.querySelector('.carousel .list');
let unAcceptClick; // unAcceptClick 변수 선언

// 다음 슬라이드 버튼 클릭 이벤트
nextButton.onclick = function() {
  showSlider('next');
}

// 이전 슬라이드 버튼 클릭 이벤트
prevButton.onclick = function() {
  showSlider('prev');
}

// 슬라이드 표시 함수
const showSlider = (type) => {
  nextButton.style.pointerEvents = 'none';
  prevButton.style.pointerEvents = 'none';

  let items = document.querySelectorAll('.carousel .list .item');
  carousel.classList.remove('prev', 'next');
  if (type === 'next') {
    listHTML.appendChild(items[0]);
    carousel.classList.add('next');
  } else {
    let positionLast = items.length - 1;
    listHTML.prepend(items[positionLast]);
    carousel.classList.add('prev');
  }
  clearTimeout(unAcceptClick);
  unAcceptClick = setTimeout(() => {
    nextButton.style.pointerEvents = 'auto';
    prevButton.style.pointerEvents = 'auto';
  }, 2000);
}

// 섹션 1 애니메이션 설정
function section1() {
  let tl = gsap.timeline();
  tl.from("header", {
    y: -50,
    opacity: 0,
    duration: 1,
  });
  tl.from(".carousel img", {
    y: 100,
    opacity: 0,
    duration: 0.8,
  });
  tl.from(".arrows", {
    y: 100,
    opacity: 0,
    duration: 0.5,
  });
}
section1();





// GSAP 및 ScrollTrigger 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

// ScrollTrigger를 사용하여 .section2에 진입할 때 #headset을 고정하고, 나갈 때 원래 위치로 되돌림
ScrollTrigger.create({
  trigger: ".section2",
  start: "top top", // .section2의 상단이 뷰포트 상단에 닿을 때 시작
  end: "bottom bottom", // .section2의 하단이 뷰포트 하단에 닿을 때 끝
  onEnter: () => {
    // 헤드셋을 고정시키는 애니메이션
    gsap.to("#headset", {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    });

    // SVG를 순차적으로 애니메이션
    gsap.utils.toArray(".line-con").forEach((lineCon, index) => {
      const line = lineCon.querySelector(".line-1");
      const lineTxt = lineCon.querySelector(".line_txt");
      const transformOrigin = (index < 3) ? "left center" : "right center"; // 3번째까지 왼쪽, 그 이후는 오른쪽에서 시작

      const timeline = gsap.timeline({
        delay: index * 0.3 // 0.3초 간격으로 순차적으로 애니메이션
      });

      timeline
        .fromTo(line, {
          scaleX: 0, // 초기 scaleX 설정
          transformOrigin: transformOrigin // 애니메이션 시작 위치 설정
        }, {
          scaleX: 1,
          duration: 1,
          ease: "power2.out"
        })
        .fromTo(line.querySelector("circle"), {
          scale: 0, // 초기 scale 설정
          transformOrigin: transformOrigin // 애니메이션 시작 위치 설정
        }, {
          scale: 1,
          duration: 1,
          ease: "power2.out"
        }, "<") // <를 사용하여 이전 애니메이션과 동시에 시작
        .fromTo(lineTxt, {
          opacity: 0,
          y: 20 // 초기 transformY 설정
        }, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out"
        });
    });
  },
  onLeave: () => {
    gsap.to("#headset img", {
      scale: 0,
      duration: 0.3,
      ease: "power2.out"
    });
    gsap.to(".h-lines", {
      scale: 0,
      duration: 0.3,
      ease: "power2.out"
    });
  },
  onEnterBack: () => {
    gsap.to("#headset", {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      scale: 1,
      opacity: 1,
      duration: 0.1,
      ease: "power2.out"
    });
    gsap.to("#headset img", {
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    });

    // .h-lines의 scale을 1로 되돌리는 애니메이션 추가
    gsap.to(".h-lines", {
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    });

    // SVG를 순차적으로 애니메이션
    gsap.utils.toArray(".line-con").forEach((lineCon, index) => {
      const line = lineCon.querySelector(".line-1");
      const lineTxt = lineCon.querySelector(".line_txt");
      const transformOrigin = (index < 3) ? "left center" : "right center"; // 3번째까지 왼쪽, 그 이후는 오른쪽에서 시작

      const timeline = gsap.timeline({
        delay: index * 0.5 // 0.5초 간격으로 순차적으로 애니메이션
      });

      timeline
        .fromTo(line, {
          scaleX: 0, // 초기 scaleX 설정
          transformOrigin: transformOrigin // 애니메이션 시작 위치 설정
        }, {
          scaleX: 1,
          duration: 0.3,
          ease: "power2.out"
        })
        .fromTo(line.querySelector("circle"), {
          scale: 0, // 초기 scale 설정
          transformOrigin: transformOrigin // 애니메이션 시작 위치 설정
        }, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        }, "<") // <를 사용하여 이전 애니메이션과 동시에 시작
        .fromTo(lineTxt, {
          opacity: 0,
          y: 20 // 초기 transformY 설정
        }, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        });
    });
  },
  onLeaveBack: () => {
    gsap.to("#headset", {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      scale: 0,
      ease: "none"
    });
  },
  markers: false // 디버깅을 위해 마커를 표시합니다. 배포 시에는 제거하세요.
});

// #headset 요소를 초기 상태로 설정
gsap.set("#headset", {
  scale: 0
});

// SVG의 초기 상태를 설정
gsap.set(".line-1", {
  scaleX: 0
});










function canvas() {
  const canvas = document.querySelector("#page3>canvas");
  const context = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
  });

  function files(index) {
    const basePath = "./images/";
    const fileExtension = ".jpg";
    const fileNumber = index + 1;
    const formattedNumber = fileNumber.toString().padStart(4, '0');
    return `${basePath}${formattedNumber}${fileExtension}`;
  }

  const frameCount = 300;
  const images = [];
  const imageSeq = { frame: 1 };

  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = files(i);
    images.push(img);
  }

  gsap.to(imageSeq, {
    frame: frameCount - 1,
    snap: "frame",
    ease: `none`,
    scrollTrigger: {
      scrub: 0.5,
      trigger: `#page3`,
      start: `top top`,
      end: `250% top`,
      scroller: `#main`,
    },
    onUpdate: render,
  });

  images[1].onload = render;

  function render() {
    scaleImage(images[imageSeq.frame], context);
  }

  function scaleImage(img, ctx) {
    var canvas = ctx.canvas;
    var hRatio = canvas.width / img.width;
    var vRatio = canvas.height / img.height;
    var ratio = Math.max(hRatio, vRatio);
    var centerShift_x = (canvas.width - img.width * ratio) / 2;
    var centerShift_y = (canvas.height - img.height * ratio) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShift_x,
      centerShift_y,
      img.width * ratio,
      img.height * ratio
    );
  }

  ScrollTrigger.create({
    trigger: "#page3",
    pin: true,
    scroller: `#main`,
    start: `top top`,
    end: `250% top`,
  });
}

function canvas2() {
  const canvas = document.querySelector("#page7>canvas");
  const context = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
  });

  function files(index) {
    const basePath = "./images3/";
    const fileExtension = ".jpg";
    const fileNumber = index + 1;
    return `${basePath}${fileNumber}${fileExtension}`;
  }

  const frameCount = 70;
  const images = [];
  const imageSeq = { frame: 1 };

  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = files(i);
    images.push(img);
  }

  gsap.to(imageSeq, {
    frame: frameCount - 1,
    snap: "frame",
    ease: `none`,
    scrollTrigger: {
      scrub: 0.5,
      trigger: `#page7`,
      start: `top top`,
      end: `250% top`,
      scroller: `#main`,
    },
    onUpdate: render,
  });

  images[1].onload = render;

  function render() {
    scaleImage(images[imageSeq.frame], context);
  }

  function scaleImage(img, ctx) {
    var canvas = ctx.canvas;
    var hRatio = canvas.width / img.width;
    var vRatio = canvas.height / img.height;
    var ratio = Math.max(hRatio, vRatio);
    var centerShift_x = (canvas.width - img.width * ratio) / 2;
    var centerShift_y = (canvas.height - img.height * ratio) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShift_x,
      centerShift_y,
      img.width * ratio,
      img.height * ratio
    );
  }

  ScrollTrigger.create({
    trigger: "#page7",
    pin: true,
    scroller: `#main`,
    start: `top top`,
    end: `250% top`,
  });
}

function canvas1() {
  const canvas = document.querySelector("#page5>canvas");
  const context = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
  });

  function files(index) {
    const basePath = "./images2/";
    const fileExtension = ".jpg";
    const fileNumber = index + 1;
    const formattedNumber = fileNumber.toString().padStart(4, '0');
    return `${basePath}${formattedNumber}${fileExtension}`;
  }

  const frameCount = 109;
  const images = [];
  const imageSeq = { frame: 1 };

  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = files(i);
    images.push(img);
  }

  gsap.to(imageSeq, {
    frame: frameCount - 1,
    snap: "frame",
    ease: `none`,
    scrollTrigger: {
      scrub: 0.5,
      trigger: `#page5`,
      start: `top top`,
      end: `250% top`,
      scroller: `#main`,
    },
    onUpdate: render,
  });

  images[1].onload = render;

  function render() {
    scaleImage(images[imageSeq.frame], context);
  }

  function scaleImage(img, ctx) {
    var canvas = ctx.canvas;
    var hRatio = canvas.width / img.width;
    var vRatio = canvas.height / img.height;
    var ratio = Math.max(hRatio, vRatio);
    var centerShift_x = (canvas.width - img.width * ratio) / 2;
    var centerShift_y = (canvas.height - img.height * ratio) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShift_x,
      centerShift_y,
      img.width * ratio,
      img.height * ratio
    );
  }

  ScrollTrigger.create({
    trigger: "#page5",
    start: "top center",
    end: "bottom center",
    scroller: `#main`,
    onEnter: () => {
      gsap.utils.toArray(".page5_txt p, .page5_txt span").forEach((elem, index) => {
        gsap.fromTo(
          elem,
          { x: -100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            delay: 1 + index * 0.3,
          }
        );
      });
    },
    onEnterBack: () => {
      gsap.utils.toArray(".page5_txt p, .page5_txt span").forEach((elem, index) => {
        gsap.fromTo(
          elem,
          { x: -100, opacity: 0 },
          {
            x: -0,
            opacity: 1,
            delay: 0.5 + index * 0.3,
          }
        );
      });
    },
  });

  ScrollTrigger.create({
    trigger: "#page5",
    pin: true,
    scroller: `#main`,
    start: `top top`,
    end: `250% top`,
  });
}



// DOMContentLoaded 이벤트에서 캔버스 함수 호출
  canvas();
  canvas2();
  canvas1();


  function cursor() {
    let cursor = document.querySelector(".cursor");
    let body = document.querySelector("body");
  
    // 초기 위치와 함께 트랜지션 설정 (부드러운 움직임을 위해)
    cursor.style.position = "absolute";
    cursor.style.transition = "transform 0.1s ease";
  
    // 마우스 이동 이벤트 리스너 추가
    body.addEventListener("mousemove", (e) => {
      cursor.style.transform = `translate(${e.pageX}px, ${e.pageY}px)`;
    });
  }
  
  cursor();

  function playCursor() {
    let sectionTwo = document.querySelector("#page11");
    let cursor = document.querySelector(".cursor");
  
    sectionTwo.addEventListener("mouseenter", () => {
      cursor.style.height = "100px";
      cursor.style.width = "100px";
      cursor.style.fontSize = "25px";
      cursor.style.color = "black";
      cursor.style.margin = "20px";
      cursor.style.background = "white";
      cursor.innerHTML = "<i class='fa-solid fa-volume-high'></i>"
    });
  
    sectionTwo.addEventListener("mouseleave", () => {
      cursor.style.height = "18px";
      cursor.style.width = "18px";
      cursor.style.margin = "0";
      cursor.innerHTML = "";
  
    });
  }
  
  playCursor();
  


 

  function section4() {
    let sectionFour = document.querySelector("#page2");
    let movingText = document.querySelector("#page2 h2");
  
    // 스크롤 위치에 따라 sectionFour의 배경색과 색상 변경
    function handleScroll() {
      let movingTextRect = movingText.getBoundingClientRect();
      let viewportHeight = window.innerHeight;
      let scrollPos = window.scrollY + viewportHeight;
  
      if (movingTextRect.bottom < scrollPos && movingTextRect.top > scrollPos - viewportHeight * 0.5) {
        sectionFour.style.background = "#0f0f0f";
        sectionFour.style.color = "white";
      } else {
        sectionFour.style.background = "";
        sectionFour.style.color = "";
      }
    }
  
    // 초기 스크롤 처리
    handleScroll();
    window.addEventListener("scroll", handleScroll);
  
  
  }
  
  section4();
  

  function section3() {
    let cursor = document.querySelector(".cursor");
    let sectionThree = document.querySelector(".section3");
  
    // Utility function to update cursor style
    function updateCursorStyle(styles) {
      Object.assign(cursor.style, styles);
    }
  
    // Event listener for mouseenter on sectionThree
    sectionThree.addEventListener("mouseenter", () => {
      updateCursorStyle({
        background: "#0f0f0f",
        transition: "background 0.3s ease" // Smooth transition for background color change
      });
    });
  
    // Optional: Reset cursor style when mouse leaves the section
    sectionThree.addEventListener("mouseleave", () => {
      updateCursorStyle({
        background: "",
        transition: "background 0.3s ease" // Smooth transition for background color change
      });
    });
  }
  
  section3();
  

