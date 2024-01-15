export default function getCors(url: string): string {
	const corsUrl = 'https://corsproxy.io/?' + encodeURIComponent(url);
	return corsUrl;
  }