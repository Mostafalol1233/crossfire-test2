import { Link } from "wouter";
import { Clock, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  image: string;
  author: string;
  date: string;
  readingTime: number;
  views: number;
  tags: string[];
  featured?: boolean;
}

interface ArticleCardProps {
  article: Article;
  translations?: {
    featured?: string;
    readingTime?: string;
  };
}

export function ArticleCard({ article, translations = {} }: ArticleCardProps) {
  const { featured = "Featured", readingTime = "min read" } = translations;

  return (
    <Card
      className="overflow-hidden hover-elevate active-elevate-2 transition-all duration-300 hover:scale-[1.02]"
      data-testid={`card-article-${article.id}`}
    >
      <Link href={`/article/${article.id}`}>
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          {article.featured && (
            <Badge
              variant="default"
              className="absolute top-4 left-4"
              data-testid="badge-featured"
            >
              {featured}
            </Badge>
          )}
          <Badge
            variant="secondary"
            className="absolute top-4 right-4"
            data-testid={`badge-category-${article.category.toLowerCase()}`}
          >
            {article.category}
          </Badge>
        </div>

        <CardContent className="p-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            {article.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs"
                data-testid={`badge-tag-${tag.toLowerCase()}`}
              >
                {tag}
              </Badge>
            ))}
          </div>

          <h3 className="text-xl font-semibold line-clamp-2 leading-snug">
            {article.title}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {article.summary}
          </p>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
            <span className="font-medium">{article.author}</span>
            <span>•</span>
            <span>{article.date}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>
                {article.readingTime} {readingTime}
              </span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{article.views.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
