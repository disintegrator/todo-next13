"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

type DateLike = string | number | Date;

function getLocale() {
	return navigator.languages?.length
		? navigator.languages[0]
		: navigator.language;
}

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;

export type RelativeTimeProps = {
	date: DateLike;
	reference?: DateLike;
	locale?: string;
};

export function RelativeTime(props: RelativeTimeProps) {
	const { date, reference = new Date(), locale: l } = props;
	const ref = new Date(reference).getTime();
	const inp = new Date(date).getTime();
	const diff = inp - ref;
	const abs = Math.abs(diff);

	const [locale, setLocale] = useState(l);
	useEffect(() => {
		if (locale == null) {
			setLocale(getLocale());
		}
	}, [locale]);

	if (locale == null) {
		return <span className="invisible">{new Date(date).toISOString()}</span>;
	}

	const absfmt = new Intl.DateTimeFormat(locale);
	const relfmt = new Intl.RelativeTimeFormat(locale, { style: "short" });

	let val: string;
	if (abs >= MONTH) {
		val = absfmt.format(inp);
	} else if (abs >= DAY) {
		val = relfmt.format(Math.trunc(diff / DAY), "day");
	} else if (abs >= HOUR) {
		val = relfmt.format(Math.trunc(diff / HOUR), "hour");
	} else {
		val = relfmt.format(Math.trunc(diff / MINUTE), "minute");
	}

	return <>{val}</>;
}
