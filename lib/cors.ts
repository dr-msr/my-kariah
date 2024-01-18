export default function getCors(url: string): string {
	const corsUrl = process.env.NEXT_PUBLIC_CORS_PROXY + "/?" + encodeURIComponent(url);
return corsUrl;
}