export default function useCors(url: string): string {
	const corsUrl = 'https://corsproxy.io/?' + encodeURIComponent(url);
	return corsUrl;
  }