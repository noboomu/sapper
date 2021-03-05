import { history, select_target, navigate, cid } from '../app';

export default function goto(href: string, opts = { replaceState: false  }) {
	const target = select_target(new URL(href, document.baseURI));

	if (target) {
		const res = navigate(target, null );
		history[opts.replaceState ? 'replaceState' : 'pushState']({ id: cid }, '', href);
		return res;
	}

	location.href = href;
	return new Promise(f => {}); // never resolves
}