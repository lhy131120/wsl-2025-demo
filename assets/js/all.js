document.addEventListener("DOMContentLoaded", () => {
	// 	const bg = document.querySelector(".bg");
	// 	const header = document.querySelector(".header");
	// 	const loader = document.querySelector(".loader");
	// 	const mainContent = document.querySelector(".indexMain");
	// 	let isHeaderFixed = false;

	// 	// 禁用滾動
	// 	document.body.classList.add("no-scroll");

	// 	// 設定 header 初始位置
	// 	function setInitialPosition() {
	// 		const bgRect = bg.getBoundingClientRect();
	// 		const loaderRect = loader.getBoundingClientRect();
	// 		const headerHeight = header.offsetHeight;

	// 		// 計算 .bg 的頂部位置
	// 		const bgTop = bgRect.top - loaderRect.top;
	// 		const initialTop = bgTop - headerHeight - 10;
	// 		header.style.top = `${Math.max(0, initialTop)}px`; // 確保 top 不小於 0
	// 		header.style.left = "0px";
	// 	}

	// 	// 初始化位置
	// 	setInitialPosition();

	// 	const animationPromise = new Promise((resolve) => {
	// 		// 更新 header 位置，實現跟隨和 sticky 效果
	// 		function updateHeaderPosition() {
	// 			const bgRect = bg.getBoundingClientRect();
	// 			const loaderRect = loader.getBoundingClientRect();
	// 			const headerHeight = header.offsetHeight;
	// 			const bgTop = bgRect.top - loaderRect.top;

	// 			// 計算目標 top 值，不小於 0
	// 			const targetTop = Math.max(0, bgTop - headerHeight);

	// 			header.style.top = `${targetTop}px`;
	// 			header.style.left = "0px";

	// 			// 若到達頂部，固定位置
	// 			if (targetTop <= 0) {
	// 				header.style.position = "fixed";
	// 				header.style.top = "0";
	// 				header.style.left = "0";
	// 				setTimeout(() => {
	// 					header.classList.add("fixed");
	// 					bg.classList.remove("hidden");
	// 					isHeaderFixed = true;
	// 					resolve();
	// 				}, 1000);
	// 			} else {
	// 				header.style.position = "absolute";
	// 				// 繼續監聽動畫
	// 				requestAnimationFrame(updateHeaderPosition);
	// 			}
	// 		}
	// 		// 開始監聽動畫
	// 		requestAnimationFrame(updateHeaderPosition);
	// 	});

	// 	animationPromise
	// 		.then(() => {
	// 			if (isHeaderFixed) {
	// 				document.body.classList.remove("no-scroll"); // 啟用滾動
	// 				setTimeout(() => {
	// 					bg.classList.add("loaded");
	// 					mainContent.classList.add("show"); // show <main>
	// 				}, 500); // .bg 動畫結束後顯示
	// 				animation.headerButtonInit();
	// 				animation.handleAimAnimation();
	// 			}
	// 		})
	// 		.catch((error) => {
	// 			console.error("Error of AnimationPromise:", error);


	const menuTrigger = document.querySelector(".btn-menu");
	const menuOverlay = document.querySelector(".menu-overlay");
	const menuItems = document.querySelectorAll(".menu-content li");
	let isAnimating = false;

	function toggleMenu() {
		if (isAnimating) return; // 如果動畫正在進行，則不響應

		isAnimating = true;
		menuTrigger.style.pointerEvents = "none"; // 禁用點擊

		if (menuOverlay.classList.contains("open")) {
			// 收起菜單
			menuOverlay.classList.remove("open");
			// menuTrigger.textContent = "☰";
			menuTrigger.classList.remove("close");
			menuTrigger.style.transform = "rotate(0deg)";
			menuItems.forEach((item) => item.classList.remove("fade-in"));
			setTimeout(() => {
				isAnimating = false;
				menuTrigger.style.pointerEvents = "auto"; // 恢復點擊
			}, 600); // 動畫結束
		} else {
			// 展開菜單
			menuOverlay.classList.add("open");
			// menuTrigger.textContent = "×";
			menuTrigger.classList.add("close");
			menuTrigger.style.transform = "rotate(90deg)";

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
	}

	menuTrigger.addEventListener("click", toggleMenu);

});

// 	const animation = {
// 		headerButtonInit: () => {
// 			const btns = document.querySelectorAll(".headerTools .btn");
// 			const animationDuration = 800; // 動畫持續時間（毫秒）
// 			const delayBetweenBtns = 200; // 每個按鈕之間的延遲（毫秒）
// 			btns.forEach((btn, index) => {
// 				const delay = index * delayBetweenBtns;
// 				btn.style.animation = `headerBtnFade ${animationDuration}ms ease-in-out forwards`;
// 				btn.style.animationDelay = `${delay}ms`;
// 			});
// 		},
// 		handleAimAnimation: () => {
// 			const master = gsap.timeline();
// 			const _tl_mainText = gsap.timeline();
// 			const _tl_triangle = gsap.timeline();
// 			// const _sub = gsap.timeline();
// 			// const _tl_triangle = gsap.timeline();
// 			// const _typeWriter = gsap.timeline();

// 			master.add(_tl_mainText).add(_tl_triangle);

// 			// const texts = document.querySelectorAll(".mainTitle .text");
// 			const textElements = gsap.utils.toArray(".mainTitle .text");
// 			const triangleElements = gsap.utils.toArray(".mainTitle .triangle");

// 			gsap.set(textElements, {
// 				opacity: 0, // 初始透明度為 0
// 				x: (index) => {
// 					// 根據索引設置初始 x 位置
// 					if (index === 0) return -150; // "W" 向左移動 100 單位
// 					if (index === 1) return -100; // "O" 向左移動 50 單位
// 					if (index === 2) return 100; // "R" 向右移動 50 單位
// 					if (index === 3) return 150; // "K" 向右移動 100 單位
// 				},
// 			});

// 			gsap.set(triangleElements, {
// 				opacity: 0,
// 				y: (index) => {
// 					if (index % 2 === 0) return -50;
// 					if (index % 2 !== 0) return 50;
// 				},
// 			});

// 			_tl_mainText.to(textElements, {
// 				opacity: 1,
// 				x: 0,
// 				duration: 2,
// 				stagger: 0.2, // 每個字母間隔 0.2 秒
// 				ease: "power2.out",
// 			});

// 			_tl_triangle.to(triangleElements, {
// 				opacity: 1,
// 				y: 0,
// 				duration: 2,
// 				stagger: 0.5,
// 				ease: "power2.out",
// 			});
// 		},
// 	};
// });
