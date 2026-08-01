import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { getTrendingMovies, getTrendingTv } from "@/lib/tmdb";
import { mediaHref } from "@/lib/utils";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const staticRoutes = ["/", "/discover", "/about", "/privacy", "/terms"];
  const [moviesResult, tvResult] = await Promise.allSettled([getTrendingMovies(), getTrendingTv()]);
  const curatedMedia = [
    ...(moviesResult.status === "fulfilled" ? moviesResult.value.results.slice(0, 20) : []),
    ...(tvResult.status === "fulfilled" ? tvResult.value.results.slice(0, 20) : []),
  ];
  const dynamicRoutes = Array.from(new Map(curatedMedia.map((media) => [mediaHref(media), mediaHref(media)])).values());

  return [...staticRoutes, ...dynamicRoutes].map((route) => ({
    url: new URL(route, baseUrl).toString(),
  }));
}
