document.addEventListener("DOMContentLoaded", () => {
	const bg = document.querySelector(".bg");
	const header = document.querySelector(".header");
	const loader = document.querySelector(".loader");

	// 設定 header 初始位置
	function setInitialPosition() {
		const bgRect = bg.getBoundingClientRect();
		const loaderRect = loader.getBoundingClientRect();
		const headerHeight = header.offsetHeight;

		// 計算 .bg 的頂部位置
		const bgTop = bgRect.top - loaderRect.top;
		const initialTop = bgTop - headerHeight - 10;
		header.style.top = `${Math.max(0, initialTop)}px`; // 確保 top 不小於 0
		header.style.left = "0px"; // 與 .bg 左對齊
	}

	// 初始化位置
	setInitialPosition();

	// 更新 header 位置，實現跟隨和 sticky 效果
	function updateHeaderPosition() {
		const bgRect = bg.getBoundingClientRect();
		const loaderRect = loader.getBoundingClientRect();
		const headerHeight = header.offsetHeight;
		const bgTop = bgRect.top - loaderRect.top;

		// 計算目標 top 值，不小於 0
		const targetTop = Math.max(0, bgTop - headerHeight);

		header.style.top = `${targetTop}px`;
		header.style.left = "0px";

		// 若到達頂部，固定位置
		if (targetTop <= 0) {
			header.style.position = "fixed";
			header.style.top = "0";
			header.style.left = "0";
			setTimeout(() => {
				header.classList.add("fixed");
				bg.classList.remove("hidden");
			}, 500);
		} else {
			header.style.position = "absolute";
			// 繼續監聽動畫
			requestAnimationFrame(updateHeaderPosition);
		}
	}

	// 開始監聽動畫
	requestAnimationFrame(updateHeaderPosition);
});
