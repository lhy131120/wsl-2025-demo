document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

	const header = document.querySelector(".header");
	const loader = document.querySelector(".loader");
	// const headerContainer = document.querySelector(".headerContainer");
	const headerContent = document.querySelector(".headerContent");
	const menuTrigger = document.querySelector(".menuTrigger");
	const menuOverlay = document.querySelector(".menu-overlay");
	const menuItems = document.querySelectorAll(".menu-content li");
	const accordions = document.querySelectorAll(".accordion");
	let isHeaderFixed = false;
	let animationFrameId;
	let isAnimating = false;

	// Disable scroll when loader is animating
	// document.body.classList.add("no-scroll");

	// set initial position of header
	const setInitialPosition = () => {
		const loaderRect = loader.getBoundingClientRect();
		const headerRect = document.querySelector(".header").getBoundingClientRect();
		const headerHeight = header.offsetHeight;
		const relativeTop = loaderRect.top - headerRect.top; // 相對於 .header 的位置
		header.style.top = `${relativeTop - headerHeight}px`;
		// console.log("loaderRect.top:", loaderRect.top, "headerHeight:", headerHeight, "relativeTop:", relativeTop);
	};

	if (header) {
		setTimeout(setInitialPosition, 500);
	}

	// dynamic update position of header
	const updatePosition = () => {
		const loaderRect = loader.getBoundingClientRect();
		const headerHeight = header.offsetHeight;
		const targetTop = loaderRect.top - headerHeight;

		// update position of header
		header.style.top = `${targetTop}px`;

		// if targetTop <= 0, fixed header
		if (targetTop <= 0 && isAnimating) {
			cancelAnimationFrame(animationFrameId);
			header.style.top = "0px";
			header.style.position = "fixed";
			header.classList.add("fixed");
			isAnimating = false;
		} else if (isAnimating) {
			animationFrameId = requestAnimationFrame(updatePosition);
		}
	};

	// Loader Animation Promise
	const loaderAnimatePromise = new Promise((resolve) => {
		// loader animation start
		loader.addEventListener("animationstart", (e) => {
			if (e.animationName === "loader-animate") {
				isAnimating = true; // 動畫開始時設置為 true
				updatePosition();
			}
		});

		// loader animation end
		loader.addEventListener("animationend", (e) => {
			if (e.animationName === "loader-animate") {
				cancelAnimationFrame(animationFrameId);
				header.style.top = "0px";
				header.style.position = "fixed";
				header.classList.add("fixed");
				// header.classList.remove("bg-white");
				isAnimating = false; // 動畫結束時設置為 false
				isHeaderFixed = true;

				// 顯示 headerContent
				headerContent.style.opacity = "1";
				headerContent.style.visibility = "visible";
				headerContent.style.zIndex = "2";
				loader.style.zIndex = "-1";

				// 動畫完成，resolve Promise
				resolve();
			}
		});
	});

	// Promise resolve here .....
	loaderAnimatePromise
		.then(() => {
			if (isHeaderFixed) {
				// document.body.classList.remove("no-scroll");
				headerButtonsFadeIn();
			}
		})
		.catch((error) => {
			console.error("Error:", error);
		});

	// 按鈕 fade-in animation
	const headerButtonsFadeIn = () => {
		const btns = document.querySelectorAll(".headerTools button");
		const animationDuration = 800; // animation duration (ms)
		const delayBetweenBtns = 200; // each button delay (ms)
		btns.forEach((btn, index) => {
			const delay = index * delayBetweenBtns;
			btn.style.animation = `headerBtnFade ${animationDuration}ms ease-in-out forwards`;
			btn.style.animationDelay = `${delay}ms`;
		});
	};

	const checkScrollPosition = () => {
		// 前設條件：檢查 header 是否有 'fixed' 類別
		if (headerContainer.classList.contains("fixed")) {
			const scrollPosition = window.scrollY || document.documentElement.scrollTop; // 獲取當前滾動距離

			if (scrollPosition > 250) {
				headerContainer.classList.add("scrolled"); // 滾動超過 250px，添加 scrolled 類別
			} else {
				headerContainer.classList.remove("scrolled"); // 滾動未超過 250px，移除 scrolled 類別
			}
		}
	};

	window.addEventListener("resize", () => {
		if (!isHeaderFixed) {
			if (isAnimating) {
				updatePosition();
			} else {
				if (header) {
					setInitialPosition();
				}
			}
		}
	});

	window.addEventListener("scroll", function () {
		if (isHeaderFixed) {
			checkScrollPosition();
		}
	});

	const toggleMenu = () => {
		if (isAnimating) return; // if isAnimating is true, disable click event

		isAnimating = true;
		menuTrigger.style.pointerEvents = "none"; // dis

		if (menuOverlay.classList.contains("open")) {
			// 收起菜單
			menuOverlay.classList.remove("open");
			menuTrigger.classList.remove("close");
			menuItems.forEach((item) => item.classList.remove("fade-in"));
			setTimeout(() => {
				isAnimating = false;
				menuTrigger.style.pointerEvents = "auto"; // 恢復點擊
			}, 600); // 動畫結束
		} else {
			// 展開菜單
			menuOverlay.classList.add("open");
			menuTrigger.classList.add("close");

			// 在展開到50%時（300ms後）開始淡入
			setTimeout(() => {
				menuItems.forEach((item, index) => {
					setTimeout(() => {
						item.classList.add("fade-in");
					}, index * 100); // 每個項目間隔100ms淡入
				});
			}, 300); // 50%展開時間

			setTimeout(() => {
				isAnimating = false;
				menuTrigger.style.pointerEvents = "auto"; // 恢復點擊
			}, 600); // 動畫結束
		}
	};

	if (menuTrigger) {
		menuTrigger.addEventListener("click", toggleMenu);
	}

	// accordions

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
  if(document.querySelector(".map-container")) {
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

