const { URLSearchParams } = require('url');

function getLinkWithBackUrl(followLink, request) {
	const curentBackUrl = request.query['back_url'];
	if (curentBackUrl) {
		return curentBackUrl;
	}

	const backUrl = request.path;
	const backUrlParam = new URLSearchParams({ back_url: backUrl });

	return `${followLink}?${backUrlParam.toString()}`
};

function redirectToBackUrl(ctx, defaultUrl = '/') {
	const backUrl = ctx.request.query['back_url'] || defaultUrl;

	ctx.status = 303;
	ctx.redirect(backUrl);
}

async function checkAuth(ctx, next) {
	const userId = ctx.session.userId;
	const isAuth = Boolean(userId);

	if (!isAuth) {
		ctx.status = 401;
		ctx.redirect(getLinkWithBackUrl('/login', ctx.request));
		return;
	}
	await next();
}

function getPagination(list, pageNumber = 1, count = 6) {
	const start = (pageNumber - 1) * count;
	const end = start + count;
	const itemsInPage = list.slice(start, end);
  return {
		itemsInPage,
    hasMore: end < list.length
	};
}

module.exports = {
	getLinkWithBackUrl,
	checkAuth,
	getPagination,
	redirectToBackUrl
};
