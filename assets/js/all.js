document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  let isAnimating = false;
	const animationDuration = 800; // animation duration (ms)
	const delayBetweenBtns = 200; // each button delay (ms)

  const scrollCommonHandler = () => {
    const scrollY = window.scrollY;
    const header = document.querySelector(".header");
    if (scrollY > 0) {
      header.classList.add("fixed");
    } else {
      header.classList.remove("fixed");
    }
  };

	// init Animation

	document.querySelector("html").style.overflow = "hidden"

	const initAnimation = () => {
		// const tl = gsap.timeline({
		// 	scrollTrigger: {
		// 		trigger: ".hero",
		// 		start: "top center",
		// 		end: "bottom center",
		// 		scrub: 1,
		// 		markers: true
		// 	}
		// });
		const tl = gsap.timeline();
		tl.to('.logoWrap', {opacity: 1, duration: 1})
			.to('.loader', {opacity: 1, duration: 1}, "-=.2")
			.to('.loader', {width: '100%', duration: 1})
			.to(".loader", {height: "100vh", marginTop: 0, opacity: 0, top: 0, ease: "ease.out", duration: 1, onComplete: () => {
				document.querySelector(".headerContainer").classList.add("shown"); 
				document.querySelector("html").style.overflow = "";
				document.querySelectorAll(".headerTools button").forEach((btn, index) => {
					const delay = index * delayBetweenBtns;
					btn.style.animation = `headerBtnFade ${animationDuration}ms ease-in-out forwards`;
					btn.style.animationDelay = `${delay}ms`;
				});
			} })
			.to(".headerContainer", {height: "auto", duration: 1}, "<")
			.to(".main", {opacity: .8})
			.to(".typewriter", {opacity: 1, duration: .25, 
				onComplete: () => {
					document.querySelectorAll(".typewriter .word").forEach((word, index) => {
						word.classList.add("active")
					})
				}
			}, "+=.25")
		
	}

	// Event listeners

	// initAnimation()

  document.querySelector(".menuTrigger").addEventListener("click", (e) => {
    e.preventDefault();
    if (document.querySelector(".menuTrigger").classList.contains("close")) {
      document.querySelector(".menuTrigger").classList.remove("close");
      document.querySelector(".mobileNavWrap").classList.remove("show");
      // document.querySelector(".menu-overlay").classList.remove("active");
      document.querySelector("body").classList.remove("no-scroll");
      setTimeout(function () {
        document.querySelector(".wrapper").classList.remove("showMenu");
      }, 500);
      document
        .querySelectorAll(".mobileMenu ul li")
        .forEach((item) => item.classList.remove("fade-in"));
    } else {
      document.querySelector(".menuTrigger").classList.add("close");
      setTimeout(function() {
				document.querySelector(".mobileNavWrap").classList.add("show");
			},100)
      // document.querySelector(".menu-overlay").classList.add("active");
      document.querySelector("body").classList.add("no-scroll");
      document.querySelector(".wrapper").classList.add("showMenu");
      document.querySelectorAll(".mobileMenu ul li").forEach((item, index) => {
        setTimeout(() => {
          item.classList.add("fade-in");
        }, index * 150); // 每個項目間隔100ms淡入
      });
			document.querySelector(".mobileNav").setAttribute("tabindex", "0");
			document.querySelector(".mobileNav").focus();
    }
  });

  ["orientationchange", "resize", "scroll"].forEach((event) => {
    window.addEventListener(event, scrollCommonHandler);
  });
});
