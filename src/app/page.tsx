'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {NewsArticle} from '@/services/news-aggregator';
import {useEffect, useState} from 'react';
import {getNewsArticles} from '@/services/news-aggregator';
import {Button} from '@/components/ui/button';
import {summarizeArticle} from '@/ai/flows/summarize-article';
import {useToast} from '@/hooks/use-toast';
import {Toaster} from '@/components/ui/toaster';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Home, Terminal} from 'lucide-react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';

const mockArticles: NewsArticle[] = [
  {
    title: 'Dark Web Market Trends',
    url: 'https://example.com/dark-market-trends',
    publicationDate: '2024-01-01T00:00:00.000Z',
  },
  {
    title: 'New Security Breaches Discovered',
    url: 'https://example.com/security-breaches',
    publicationDate: '2024-01-02T00:00:00.000Z',
  },
];

export default function DailyNewsPage() {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [researchArticles, setResearchArticles] = useState<NewsArticle[]>(mockArticles);
  const [latestArticles, setLatestArticles] = useState<NewsArticle[]>(mockArticles);
  const {toast} = useToast();

  useEffect(() => {
    const fetchArticles = async () => {
      const fetchedArticles = await getNewsArticles('https://example.com/darkweb-news');
      setNewsArticles(fetchedArticles);
    };

    fetchArticles();
  }, []);

  const handleSummarizeArticle = async (article: NewsArticle) => {
    try {
      const mockArticleContent = `This is a long article about ${article.title}. It discusses various aspects of the topic in detail.`;
      const summary = await summarizeArticle({articleContent: mockArticleContent});

      toast({
        title: `Summary for: ${article.title}`,
        description: summary.summary,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error summarizing article',
        description: error.message,
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarTrigger className="md:hidden"/>
            <h2 className="text-lg font-bold">DeepDive Daily</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton href="#" isActive>
                  <Home className="mr-2 h-4 w-4"/>
                  <span>Daily News</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="#">
                  <Terminal className="mr-2 h-4 w-4"/>
                  <span>Hacking Practice</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarSeparator/>
            <p className="text-xs text-muted-foreground p-2">
              © {new Date().getFullYear()} DeepDive Daily
            </p>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1">
          <ScrollArea className="flex-1">
            <div className="p-4">
              <h1 className="text-2xl font-bold mb-4">Today&apos;s DeepDive</h1>

              <Tabs defaultValue="news" className="w-[400px]">
                <TabsList>
                  <TabsTrigger value="news">News</TabsTrigger>
                  <TabsTrigger value="research">Research</TabsTrigger>
                  <TabsTrigger value="latest">Latest News</TabsTrigger>
                </TabsList>
                <TabsContent value="news">
                  {newsArticles.length > 0 ? (
                    newsArticles.map((article) => (
                      <Card key={article.url} className="mb-4">
                        <CardHeader>
                          <CardTitle>{article.title}</CardTitle>
                          <CardDescription>{new Date(article.publicationDate).toLocaleDateString()}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button onClick={() => handleSummarizeArticle(article)}>Summarize</Button>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p>Loading news articles...</p>
                  )}
                </TabsContent>
                <TabsContent value="research">
                  {researchArticles.length > 0 ? (
                    researchArticles.map((article) => (
                      <Card key={article.url} className="mb-4">
                        <CardHeader>
                          <CardTitle>{article.title}</CardTitle>
                          <CardDescription>{new Date(article.publicationDate).toLocaleDateString()}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button onClick={() => handleSummarizeArticle(article)}>Summarize</Button>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p>Loading research articles...</p>
                  )}
                </TabsContent>
                <TabsContent value="latest">
                  {latestArticles.length > 0 ? (
                    latestArticles.map((article) => (
                      <Card key={article.url} className="mb-4">
                        <CardHeader>
                          <CardTitle>{article.title}</CardTitle>
                          <CardDescription>{new Date(article.publicationDate).toLocaleDateString()}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button onClick={() => handleSummarizeArticle(article)}>Summarize</Button>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p>Loading latest articles...</p>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        </div>
      </div>
      <Toaster/>
    </SidebarProvider>
  );
}
