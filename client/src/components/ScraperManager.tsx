import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Download, RefreshCw, Eye, ExternalLink, CheckSquare, Square } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export function ScraperManager() {
  const { toast } = useToast();
  const [forumUrl, setForumUrl] = useState("");
  const [previewData, setPreviewData] = useState<any>(null);
  const [previewType, setPreviewType] = useState<"events" | "news" | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  const previewEventsMutation = useMutation({
    mutationFn: () => apiRequest("/api/scrape/preview/events", "GET"),
    onSuccess: (data: any) => {
      setPreviewData(data);
      setPreviewType("events");
      setSelectedIndices([]);
      setIsPreviewOpen(true);
    },
    onError: (error: any) => {
      toast({
        title: "Preview Failed",
        description: error.message || "Failed to preview events",
        variant: "destructive",
      });
    },
  });

  const previewNewsMutation = useMutation({
    mutationFn: () => {
      const url = forumUrl ? `/api/scrape/preview/news?url=${encodeURIComponent(forumUrl)}` : "/api/scrape/preview/news";
      return apiRequest(url, "GET");
    },
    onSuccess: (data: any) => {
      setPreviewData(data);
      setPreviewType("news");
      setSelectedIndices([]);
      setIsPreviewOpen(true);
    },
    onError: (error: any) => {
      toast({
        title: "Preview Failed",
        description: error.message || "Failed to preview news",
        variant: "destructive",
      });
    },
  });

  const importEventsMutation = useMutation({
    mutationFn: (selectedItems?: any[]) => {
      const body = selectedItems ? { selectedItems } : {};
      return apiRequest("/api/scrape/events", "POST", body);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      const message = data.skipped > 0 
        ? `Imported ${data.count} new events, skipped ${data.skipped} duplicates`
        : `Successfully imported ${data.count} events from Z8Games`;
      toast({
        title: "Events Imported",
        description: message,
      });
      setIsPreviewOpen(false);
      setSelectedIndices([]);
    },
    onError: (error: any) => {
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import events",
        variant: "destructive",
      });
    },
  });

  const importNewsMutation = useMutation({
    mutationFn: (selectedItems?: any[]) => {
      const body = selectedItems 
        ? { selectedItems } 
        : forumUrl ? { url: forumUrl } : {};
      return apiRequest("/api/scrape/news", "POST", body);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      const message = data.skipped > 0 
        ? `Imported ${data.count} new items, skipped ${data.skipped} duplicates`
        : `Successfully imported ${data.count} news items from Z8Games`;
      toast({
        title: "News Imported",
        description: message,
      });
      setForumUrl("");
      setIsPreviewOpen(false);
      setSelectedIndices([]);
    },
    onError: (error: any) => {
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import news",
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="mb-6" data-testid="scraper-manager">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Z8Games Scraper
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Events Scraper</h3>
            <p className="text-xs text-muted-foreground">
              Scrape events from crossfire.z8games.com/events.html
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => previewEventsMutation.mutate()}
                disabled={previewEventsMutation.isPending}
                data-testid="button-preview-events"
              >
                <Eye className="h-4 w-4 mr-2" />
                {previewEventsMutation.isPending ? "Loading..." : "Preview"}
              </Button>
              <Button
                size="sm"
                onClick={() => importEventsMutation.mutate(undefined)}
                disabled={importEventsMutation.isPending}
                data-testid="button-import-events"
              >
                <Download className="h-4 w-4 mr-2" />
                {importEventsMutation.isPending ? "Importing..." : "Import All Events"}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm">News Scraper</h3>
            <p className="text-xs text-muted-foreground">
              Scrape news from Z8Games forum announcements
            </p>
            <div className="space-y-2">
              <Input
                placeholder="Optional: Specific forum URL"
                value={forumUrl}
                onChange={(e) => setForumUrl(e.target.value)}
                data-testid="input-forum-url"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => previewNewsMutation.mutate()}
                  disabled={previewNewsMutation.isPending}
                  data-testid="button-preview-news"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {previewNewsMutation.isPending ? "Loading..." : "Preview"}
                </Button>
                <Button
                  size="sm"
                  onClick={() => importNewsMutation.mutate(undefined)}
                  disabled={importNewsMutation.isPending}
                  data-testid="button-import-news"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {importNewsMutation.isPending ? "Importing..." : "Import All News"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ExternalLink className="h-3 w-3" />
            <span>Scrapes only events and news - no player or info data</span>
          </div>
        </div>

        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>
                Preview: {previewType === "events" ? "Events" : "News"} ({previewData?.count || 0} items)
              </DialogTitle>
              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const totalItems = previewType === "events" 
                      ? previewData?.events?.length || 0 
                      : previewData?.news?.length || 0;
                    if (selectedIndices.length === totalItems) {
                      setSelectedIndices([]);
                    } else {
                      setSelectedIndices(Array.from({ length: totalItems }, (_, i) => i));
                    }
                  }}
                  data-testid="button-toggle-all"
                >
                  {selectedIndices.length === (previewType === "events" ? previewData?.events?.length : previewData?.news?.length) ? (
                    <>
                      <Square className="h-4 w-4 mr-2" />
                      Deselect All
                    </>
                  ) : (
                    <>
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Select All
                    </>
                  )}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {selectedIndices.length} selected
                </span>
              </div>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {previewType === "events" && previewData?.events?.map((event: any, index: number) => (
                <Card key={index} data-testid={`preview-event-${index}`} className="hover-elevate">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedIndices.includes(index)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedIndices([...selectedIndices, index]);
                          } else {
                            setSelectedIndices(selectedIndices.filter(i => i !== index));
                          }
                        }}
                        data-testid={`checkbox-event-${index}`}
                      />
                      {event.image && (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm">{event.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {event.description?.substring(0, 150)}...
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {event.date}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {event.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {previewType === "news" && previewData?.news?.map((newsItem: any, index: number) => (
                <Card key={index} data-testid={`preview-news-${index}`} className="hover-elevate">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedIndices.includes(index)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedIndices([...selectedIndices, index]);
                          } else {
                            setSelectedIndices(selectedIndices.filter(i => i !== index));
                          }
                        }}
                        data-testid={`checkbox-news-${index}`}
                      />
                      {newsItem.image && (
                        <img
                          src={newsItem.image}
                          alt={newsItem.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm">{newsItem.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {newsItem.content?.substring(0, 150)}...
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {newsItem.dateRange}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {newsItem.author}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <DialogFooter className="pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsPreviewOpen(false)}
                data-testid="button-cancel-import"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const items = previewType === "events" 
                    ? previewData?.events?.filter((_: any, i: number) => selectedIndices.includes(i))
                    : previewData?.news?.filter((_: any, i: number) => selectedIndices.includes(i));
                  
                  if (previewType === "events") {
                    importEventsMutation.mutate(items);
                  } else {
                    importNewsMutation.mutate(items);
                  }
                }}
                disabled={selectedIndices.length === 0 || importEventsMutation.isPending || importNewsMutation.isPending}
                data-testid="button-import-selected"
              >
                <Download className="h-4 w-4 mr-2" />
                {importEventsMutation.isPending || importNewsMutation.isPending 
                  ? "Importing..." 
                  : `Import Selected (${selectedIndices.length})`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
