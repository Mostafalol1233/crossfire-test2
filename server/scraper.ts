import * as cheerio from 'cheerio';
import type { InsertEvent, InsertNews } from '@shared/schema';

interface ScrapedEvent {
  title: string;
  description: string;
  date: string;
  type: string;
  image: string;
}

interface ScrapedNews {
  title: string;
  dateRange: string;
  image: string;
  category: string;
  content: string;
  htmlContent?: string;
  author: string;
}

export class Z8GamesScraper {
  private readonly EVENTS_URL = 'https://crossfire.z8games.com/events.html';
  private readonly FORUM_BASE_URL = 'https://forum.z8games.com';

  private extractImageUrl($el: any, baseUrl: string = 'https://z8games.akamaized.net'): string {
    let imageUrl = '';
    
    // First, try to find an img tag
    const $img = $el.find('img').first();
    
    if ($img.length > 0) {
      imageUrl = $img.attr('src') || 
                 $img.attr('data-src') || 
                 $img.attr('data-original') || 
                 $img.attr('srcset')?.split(',')[0]?.trim()?.split(' ')[0] || '';
      
      if (!imageUrl) {
        const imgStyle = $img.attr('style') || '';
        const bgMatch = imgStyle.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/i);
        if (bgMatch) {
          imageUrl = bgMatch[1];
        }
      }
    }
    
    // If no image found in img tag, check the element itself for background-image
    if (!imageUrl) {
      const elementStyle = $el.attr('style') || '';
      const bgMatch = elementStyle.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/i);
      if (bgMatch) {
        imageUrl = bgMatch[1];
      }
    }
    
    // Check descendant elements for background-image in their style
    if (!imageUrl) {
      const $bgElement = $el.find('[style*="background-image"]').first();
      if ($bgElement.length > 0) {
        const bgStyle = $bgElement.attr('style') || '';
        const bgMatch = bgStyle.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/i);
        if (bgMatch) {
          imageUrl = bgMatch[1];
        }
      }
    }
    
    // Also check for data-background attribute (common in lazy loading)
    if (!imageUrl) {
      imageUrl = $el.attr('data-background') || 
                 $el.attr('data-bg') || 
                 $el.attr('data-image') || '';
      
      // Check descendants for data-background attributes
      if (!imageUrl) {
        const $dataEl = $el.find('[data-background], [data-bg], [data-image]').first();
        if ($dataEl.length > 0) {
          imageUrl = $dataEl.attr('data-background') || 
                     $dataEl.attr('data-bg') || 
                     $dataEl.attr('data-image') || '';
        }
      }
    }
    
    if (!imageUrl) return '';
    
    // Normalize the URL
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    if (imageUrl.startsWith('/')) {
      return `${baseUrl}${imageUrl}`;
    }
    
    return imageUrl;
  }

  private fixHtmlContentUrls(htmlContent: string, baseUrl: string = 'https://forum.z8games.com'): string {
    return htmlContent
      .replace(/src="(\/[^"]+)"/g, `src="${baseUrl}$1"`)
      .replace(/src='(\/[^']+)'/g, `src='${baseUrl}$1'`)
      .replace(/data-src="(\/[^"]+)"/g, `data-src="${baseUrl}$1"`)
      .replace(/data-src='(\/[^']+)'/g, `data-src='${baseUrl}$1'`)
      .replace(/data-original="(\/[^"]+)"/g, `data-original="${baseUrl}$1"`)
      .replace(/data-original='(\/[^']+)'/g, `data-original='${baseUrl}$1'`);
  }

  async scrapeEvents(): Promise<ScrapedEvent[]> {
    try {
      const response = await fetch(this.EVENTS_URL);
      const html = await response.text();
      const $ = cheerio.load(html);
      
      const events: ScrapedEvent[] = [];
      
      $('.event-card, .event-item, [class*="event"]').each((_, element) => {
        const $el = $(element);
        
        const title = $el.find('h3, h2, .event-title, [class*="title"]').first().text().trim();
        const description = $el.find('p, .event-description, [class*="description"]').first().text().trim();
        const dateText = $el.find('.event-date, [class*="date"], h4').first().text().trim();
        const imageUrl = this.extractImageUrl($el);
        
        if (title && title.length > 3) {
          events.push({
            title,
            description: description || title,
            date: dateText || 'Ongoing',
            type: dateText.toLowerCase().includes('ongoing') ? 'ongoing' : 'upcoming',
            image: imageUrl
          });
        }
      });
      
      return events.filter((event, index, self) => 
        index === self.findIndex(e => e.title === event.title)
      );
    } catch (error) {
      console.error('Error scraping events:', error);
      return [];
    }
  }

  async scrapeForumAnnouncements(forumUrl?: string): Promise<ScrapedNews[]> {
    try {
      const url = forumUrl || `${this.FORUM_BASE_URL}/categories/crossfire-announcements`;
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);
      
      const newsItems: ScrapedNews[] = [];
      
      $('article, .discussion, [class*="Discussion"]').each((_, element) => {
        const $el = $(element);
        
        const title = $el.find('h1, h2, h3, .discussion-title, [class*="Title"]').first().text().trim();
        const contentElement = $el.find('.discussion-content, [class*="Message"]').first();
        const content = contentElement.text().trim();
        
        // Extract HTML content with images
        let htmlContent = contentElement.html() || '';
        htmlContent = this.fixHtmlContentUrls(htmlContent);
        
        const author = $el.find('.author, [class*="Author"], [class*="GM"]').first().text().trim() || 'GM Xenon';
        const dateText = $el.find('time, .date, [class*="Date"]').first().text().trim();
        const imageUrl = this.extractImageUrl($el, this.FORUM_BASE_URL);
        
        if (title && title.length > 5) {
          newsItems.push({
            title,
            dateRange: dateText || new Date().toLocaleDateString(),
            image: imageUrl,
            category: 'Announcements',
            content: content || title,
            htmlContent: htmlContent,
            author: author.replace(/\[GM\]/gi, '').trim() || 'GM Xenon'
          });
        }
      });
      
      return newsItems.filter((news, index, self) => 
        index === self.findIndex(n => n.title === news.title)
      ).slice(0, 10);
    } catch (error) {
      console.error('Error scraping forum announcements:', error);
      return [];
    }
  }

  async scrapeSpecificForum(discussionUrl: string): Promise<ScrapedNews | null> {
    try {
      const response = await fetch(discussionUrl);
      const html = await response.text();
      const $ = cheerio.load(html);
      
      const title = $('h1').first().text().trim();
      const contentElement = $('article, .Message, [class*="Message"]').first();
      const content = contentElement.text().trim();
      
      // Extract HTML content with images
      let htmlContent = contentElement.html() || '';
      htmlContent = this.fixHtmlContentUrls(htmlContent);
      
      const author = $('.author, [class*="Author"]').first().text().trim() || 'GM Xenon';
      const dateText = $('time').first().text().trim();
      const imageUrl = this.extractImageUrl(contentElement, this.FORUM_BASE_URL);
      
      if (!title) return null;
      
      return {
        title,
        dateRange: dateText || new Date().toLocaleDateString(),
        image: imageUrl,
        category: 'News',
        content: content || title,
        htmlContent: htmlContent,
        author: author.replace(/\[GM\]/gi, '').trim() || 'GM Xenon'
      };
    } catch (error) {
      console.error('Error scraping specific forum:', error);
      return null;
    }
  }

  convertToInsertEvent(scraped: ScrapedEvent): InsertEvent {
    const mappedType = scraped.type === 'ongoing' ? 'trending' : scraped.type;
    
    return {
      title: scraped.title,
      titleAr: scraped.title,
      description: scraped.description,
      descriptionAr: scraped.description,
      date: scraped.date,
      type: mappedType as 'upcoming' | 'trending',
      image: scraped.image
    };
  }

  convertToInsertNews(scraped: ScrapedNews): InsertNews {
    return {
      title: scraped.title,
      titleAr: scraped.title,
      dateRange: scraped.dateRange,
      image: scraped.image,
      category: scraped.category,
      content: scraped.content,
      contentAr: scraped.content,
      htmlContent: scraped.htmlContent || scraped.content,
      author: scraped.author,
      featured: false
    };
  }
}

export const scraper = new Z8GamesScraper();
