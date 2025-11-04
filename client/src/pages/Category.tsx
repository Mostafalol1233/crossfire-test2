import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { ArticleCard, type Article } from "@/components/ArticleCard";
import { Sidebar } from "@/components/Sidebar";
import { useLanguage } from "@/components/LanguageProvider";
import { CategoryFilter, type Category } from "@/components/CategoryFilter";
import { EventsRibbon, type Event } from "@/components/EventsRibbon";

interface NewsItem {
  id: string;
  title: string;
  dateRange?: string;
  date?: string;
  image: string;
  category: string;
  content: string;
  summary?: string;
  author: string;
  featured?: boolean;
  createdAt?: string;
}

export default function Category() {
  const { t } = useLanguage();
  const { category } = useParams<{ category: string }>();

  const { data: allPosts = [], isLoading: postsLoading } = useQuery<Article[]>({
    queryKey: ["/api/posts"],
  });

  const { data: newsItems = [], isLoading: newsLoading } = useQuery<NewsItem[]>({
    queryKey: ["/api/news"],
    enabled: category?.toLowerCase() === "news",
  });

  const { data: allEvents = [] } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const isLoading = postsLoading || newsLoading;

  const filteredArticles = useMemo(() => {
    if (!category) return [];
    
    let articles: Article[] = [];
    
    if (category.toLowerCase() === "news") {
      const newsAsArticles: Article[] = newsItems.map(item => ({
        id: item.id,
        title: item.title,
        summary: item.summary || item.content.substring(0, 150),
        category: item.category,
        image: item.image,
        author: item.author,
        date: item.dateRange || item.date || 'Recent',
        readingTime: Math.ceil((item.content?.length || 0) / 1000),
        views: 0,
        tags: [],
        featured: item.featured,
      }));
      
      const newsPosts = allPosts.filter(
        (article) => article.category.toLowerCase() === "news"
      );
      
      articles = [...newsAsArticles, ...newsPosts];
    } else if (category.toLowerCase() === "events") {
      articles = allPosts.filter(
        (article) => article.category.toLowerCase() === "events"
      );
    } else {
      articles = allPosts.filter(
        (article) => article.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    return articles.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [allPosts, newsItems, category]);

  const recentPosts = useMemo(() => {
    return allPosts.slice(0, 3).map((post) => ({
      id: post.id,
      title: post.title,
      image: post.image,
      date: post.date,
    }));
  }, [allPosts]);

  const popularTags = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    allPosts.forEach((post) => {
      (post.tags || []).forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [allPosts]);

  const mostViewed = useMemo(() => {
    return [...allPosts]
      .sort((a, b) => b.views - a.views)
      .slice(0, 3)
      .map((post) => ({
        id: post.id,
        title: post.title,
        views: post.views,
      }));
  }, [allPosts]);

  const bimoraPicks = useMemo(() => {
    return allPosts
      .filter((post) => post.featured)
      .slice(0, 2)
      .map((post) => ({
        id: post.id,
        title: post.title,
        image: post.image,
        date: post.date,
      }));
  }, [allPosts]);

  const categoryTitle = category
    ? category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
    : "";

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
          <div className="text-center">
            <p className="text-muted-foreground">{t("loading") || "Loading..."}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {allEvents.length > 0 && <EventsRibbon events={allEvents} />}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          <main className="lg:col-span-8 space-y-8 md:space-y-12">
            <div className="space-y-6">
              <h1 
                className="text-3xl md:text-4xl font-bold"
                data-testid="heading-category"
              >
                {categoryTitle}
              </h1>
              
              <p 
                className="text-muted-foreground"
                data-testid="text-category-description"
              >
                {t("browsing")} {categoryTitle.toLowerCase()} {t("articles")}
              </p>
              
              <CategoryFilter
                activeCategory={category?.toLowerCase() as Category || "all"}
                useNavigation={true}
              />
            </div>

            {filteredArticles.length === 0 ? (
              <div 
                className="text-center py-12"
                data-testid="container-no-posts"
              >
                <p className="text-muted-foreground">
                  {t("noArticlesFound") || `No ${categoryTitle.toLowerCase()} articles found.`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {filteredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </main>

          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <Sidebar
                recentPosts={recentPosts}
                popularTags={popularTags}
                mostViewed={mostViewed}
                bimoraPicks={bimoraPicks}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
