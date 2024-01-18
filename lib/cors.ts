export default function getCors(url: string): string {
	const corsUrl = process.env.CORS_PROXY + encodeURIComponent(url);
return corsUrl;
}