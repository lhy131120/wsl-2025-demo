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

	document.querySelector("html").style.overflow = "hidden";

	const initAnimation = () => {
		const tl = gsap.timeline();
		tl.to(".logoWrap", { opacity: 1, duration: 1 })
			.to(".loader", { opacity: 1, duration: 1 }, "-=.2")
			.to(".loader", { width: "100%", duration: 1 })
			.to(".loader", {
				height: "100vh",
				marginTop: 0,
				opacity: 0,
				top: 0,
				ease: "ease.out",
				duration: 1,
				onComplete: () => {
					document.querySelector(".headerContainer").classList.add("shown");
					document.querySelector("html").style.overflow = "";
					document.querySelectorAll(".headerTools button").forEach((btn, index) => {
						const delay = index * delayBetweenBtns;
						btn.style.animation = `headerBtnFade ${animationDuration}ms ease-in-out forwards`;
						btn.style.animationDelay = `${delay}ms`;
					});
					setTimeout(() => {
						document.querySelector(".loader").style.display = "none";
					}, 300);
				},
			})
			.to(".headerContainer", { height: "auto", duration: 1 }, "<")
			.to(".main", { opacity: 0.8 })
			.to(
				".wordContainer",
				{
					opacity: 1,
					duration: 1,
					filter: "blur(0px)",
					maxWidth: "809px",
					ease: "ease.out",
					onComplete: () => {
						document.querySelectorAll(".words .word").forEach((word, index) => {
							setTimeout(() => {
								word.classList.add("shown");
							}, index * delayBetweenBtns);
						});
					},
				},
				"<"
			)
			.to(".word-caption.top", { opacity: 1, duration: 2, left: "15%", ease: "ease.in" }, "<")
			.to(".word-caption.botton", { opacity: 1, duration: 2, right: "20%", ease: "ease.in" }, "<")
			.to(
				".typewriter",
				{
					opacity: 1,
					duration: 0.25,
					onComplete: () => {
						document.querySelectorAll(".typewriter .word").forEach((word, index) => {
							word.classList.add("active");
						});
					},
				},
				"-=1"
			);
	};

	const sectionProjectAnimation = () => {

		let slidesContainer = document.querySelector(".projects");
		gsap.to(".projects", {
			scrollTrigger: {
				start: "top bottom",
				trigger: ".projects",
        toggleClass: "active",
				// markers: true,
			},
		});
		const slidesCol = gsap.utils.toArray(".projectWrap.column .project");
		slidesCol.forEach((slide) => {
			gsap.to(slide, {
				scrollTrigger: {
					trigger: slide,
					start: "top 45%",
					end: "bottom 50%",
					scrub: 1,
					// markers: true,
				},
				top: "+=4em",
				position: "sticky",
				transform: "scale(0.7) translateX(30%)",
				duration: 1.75,
			});
			gsap.to(slide.querySelector("a"), {
				scrollTrigger: {
					trigger: slide,
					start: "top 45%",
					end: "bottom 50%",
					scrub: 1,
					// markers: true,
				},
				opacity: 0,
				duration: 1.2,
			});
		});

		const panels = gsap.utils.toArray(".projectWrap.horizontal .project");
    
		let fullLength = () => {
			let lastItemR = panels[panels.length - 1].getBoundingClientRect().right;
			let containerR = document.querySelector(".projectWrap.horizontal").getBoundingClientRect().right;
			return lastItemR - containerR;
		};

		gsap.from(".projectWrap.horizontal", { x: "100%", ease: "none" });

		gsap.to(".projectWrap.horizontal", {
			x: () => -fullLength() - 100,
			ease: "none",
			scrollTrigger: {
				start: "top center-=20%",
				end: () => "+=" + fullLength(),
				trigger: document.querySelector(".projectWrap.horizontal"),
				pin: true,
				scrub: true,
				//markers: true,
				invalidateOnRefresh: true,
				onEnterBack: () => {
					console.log("onEnterBack");
				},
				onLeave: () => {
					console.log("onLeave");
				},
			},
		});
	};

	// Event listeners

	initAnimation();
	if (document.querySelector(".project")) sectionProjectAnimation();

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
			document.querySelectorAll(".mobileMenu ul li").forEach((item) => item.classList.remove("fade-in"));
		} else {
			document.querySelector(".menuTrigger").classList.add("close");
			setTimeout(function () {
				document.querySelector(".mobileNavWrap").classList.add("show");
			}, 100);
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

	// Accordion
	const accordions = document.querySelectorAll(".accordion");

	const toggleAccordion = function () {
		const item = this.parentElement; // current .accordion-item
		const accordion = item.closest(".accordion"); // get parent .accordion
		const content = item.querySelector(".accordion-content");
		const isActive = item.classList.contains("active");

		accordion.querySelectorAll(".accordion-item").forEach((el) => {
			if (el !== item) {
				// exclude current item
				el.classList.remove("active");
				const otherContent = el.querySelector(".accordion-content");
				otherContent.style.maxHeight = "0";
				otherContent.setAttribute("aria-hidden", "true");
				el.querySelector(".accordion-header").setAttribute("aria-expanded", "false");
			}
		});

		// switch active state
		if (!isActive) {
			item.classList.add("active");
			content.style.maxHeight = content.scrollHeight + "px";
			content.setAttribute("aria-hidden", "false");
			this.setAttribute("aria-expanded", "true");
		} else {
			item.classList.remove("active");
			content.style.maxHeight = "0";
			content.setAttribute("aria-hidden", "true");
			this.setAttribute("aria-expanded", "false");
		}
	};

	if (accordions.length > 0) {
		accordions.forEach((accordion) => {
			const accordionHeaders = accordion.querySelectorAll(".accordion-header");

			accordionHeaders.forEach((header) => {
				// mouse event
				header.addEventListener("click", toggleAccordion);

				// keyboard event
				header.addEventListener("keydown", function (event) {
					if (event.key === "Enter" || event.key === " ") {
						event.preventDefault(); // 防止頁面滾動
						toggleAccordion.call(this);
					}
				});
			});
		});
	}
	// map-container animation
	if (document.querySelector(".map-container")) {
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: ".map-container", // trigger element
				start: "top 55%",
				end: "bottom 40%",
				scrub: 1, // important
				// markers: true, // test use
			},
		});

		tl.fromTo(
			".map-container",
			{ width: "100%", borderRadius: "0" },
			{ width: "85%", borderRadius: "20px", duration: 2 }
		);

		// 為 button 添加動畫（與 map-container 同時進行）
		tl.fromTo(
			".qna .btn-viewall",
			{ marginBottom: "60px" }, // 初始狀態
			{ marginBottom: "40px", duration: 2 },
			0 // 在 timeline 的 0 秒處開始，與 map-container 同步
		);
	}
});
