const preloadImage = (url: string) => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.src = url;
		img.onload = function () {
			resolve();
		};
		img.onerror = function (err) {
			reject(err);
		};
	});
};

const isImagedLoaded = (img: any) => {
	return img.status === "fulfilled";
};

export const preloadImages = (arr: string[]) => {
	const imagePromiseArr = arr.map(preloadImage);
	return Promise.allSettled(imagePromiseArr);
};

export const aggregateResult = (result: any[]) => {
	const succededArr = result.map(isImagedLoaded).filter(Boolean);
	const succeded = succededArr.length;
	const failed = result.length - succededArr.length;

	return { succeded, failed };
};
